import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import {
    cancelAllMedicationNotifications,
    cancelMedicationNotifications,
    scheduleAllMedicationNotifications,
    scheduleMedicationNotifications
} from "./NotificationService";
import UserContext from "./UserContext";

const RemindersContext = createContext();

export const RemindersProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [medications, setMedications] = useState([]);
  const [intakeLogs, setIntakeLogs] = useState({});

  const storageKey = user ? `medications_${user.name}` : null;
  const logKey = user ? `intakelogs_${user.name}` : null;

  useEffect(() => {
    const load = async () => {
      if (!storageKey) return;
      const meds = JSON.parse(await AsyncStorage.getItem(storageKey)) || [];
      const logs = JSON.parse(await AsyncStorage.getItem(logKey)) || {};
      setMedications(meds);
      setIntakeLogs(logs);
      
      // Benachrichtigungen für alle Medikamente planen
      if (meds.length > 0) {
        await scheduleAllMedicationNotifications(meds);
      }
    };
    load();
  }, [storageKey, logKey]);

  const saveMedications = async (data) => {
    setMedications(data);
    if (storageKey) {
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
      // Benachrichtigungen neu planen
      await scheduleAllMedicationNotifications(data);
    }
  };

  const saveIntakeLogs = async (data) => {
    setIntakeLogs(data);
    if (logKey) {
      await AsyncStorage.setItem(logKey, JSON.stringify(data));
    }
  };

  const addMedication = async (med) => {
    const updated = [...medications, med];
    await saveMedications(updated);
    // Benachrichtigungen für das neue Medikament planen
    await scheduleMedicationNotifications(med);
  };

  const removeMedication = async (id) => {
    const updated = medications.filter((m) => m.id !== id);
    await saveMedications(updated);
    // Benachrichtigungen für das gelöschte Medikament entfernen
    await cancelMedicationNotifications(id);
  };

  const logIntake = ({ medId, date, time, status }) => {
    const current = intakeLogs[medId] || [];
    const updatedLogs = {
      ...intakeLogs,
      [medId]: [...current, { date, time, status }],
    };
    saveIntakeLogs(updatedLogs);
  };

  const refreshNotifications = async () => {
    if (medications.length > 0) {
      await scheduleAllMedicationNotifications(medications);
    }
  };

  const clearAllNotifications = async () => {
    await cancelAllMedicationNotifications();
  };

  return (
    <RemindersContext.Provider
      value={{
        medications,
        intakeLogs,
        addMedication,
        removeMedication,
        logIntake,
        refreshNotifications,
        clearAllNotifications,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersContext;
