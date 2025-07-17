import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
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
    };
    load();
  }, [storageKey]);

  const saveMedications = async (data) => {
    setMedications(data);
    if (storageKey) {
      await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    }
  };

  const saveIntakeLogs = async (data) => {
    setIntakeLogs(data);
    if (logKey) {
      await AsyncStorage.setItem(logKey, JSON.stringify(data));
    }
  };

  const addMedication = (med) => {
    const updated = [...medications, med];
    saveMedications(updated);
  };

  const removeMedication = (id) => {
    const updated = medications.filter((m) => m.id !== id);
    saveMedications(updated);
  };

  const logIntake = ({ medId, date, time, status }) => {
    const current = intakeLogs[medId] || [];
    const updatedLogs = {
      ...intakeLogs,
      [medId]: [...current, { date, time, status }],
    };
    saveIntakeLogs(updatedLogs);
  };

  return (
    <RemindersContext.Provider
      value={{
        medications,
        intakeLogs,
        addMedication,
        removeMedication,
        logIntake,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
};

export default RemindersContext;
