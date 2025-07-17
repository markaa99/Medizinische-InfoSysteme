// components/MedicationReminderModal.js

import dayjs from "dayjs";
import { useContext } from "react";
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RemindersContext from "./RemindersContext";

export default function MedicationReminderModal({ 
  visible, 
  onClose, 
  medication, 
  scheduledTime 
}) {
  const { logIntake } = useContext(RemindersContext);

  const handleTaken = () => {
    const now = dayjs();
    logIntake({
      medId: medication.id,
      date: now.format("YYYY-MM-DD"),
      time: now.format("HH:mm"),
      status: "taken",
    });
    
    Alert.alert(
      "Einnahme protokolliert",
      `${medication.name} wurde als eingenommen markiert.`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const handleSkipped = () => {
    const now = dayjs();
    logIntake({
      medId: medication.id,
      date: now.format("YYYY-MM-DD"),
      time: now.format("HH:mm"),
      status: "missed",
    });
    
    Alert.alert(
      "Einnahme protokolliert",
      `${medication.name} wurde als verpasst markiert.`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  const handleSnooze = () => {
    Alert.alert(
      "Erinnerung verschoben",
      "Du wirst in 10 Minuten erneut erinnert.",
      [{ text: "OK", onPress: onClose }]
    );
    // Hier könnte man eine neue Benachrichtigung in 10 Minuten planen
  };

  if (!medication) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>🔔 Medikament-Erinnerung</Text>
          
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName}>{medication.name}</Text>
            <Text style={styles.dosage}>{medication.dosage}</Text>
            <Text style={styles.scheduledTime}>
              Geplant für: {scheduledTime}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.takenButton]}
              onPress={handleTaken}
            >
              <Text style={styles.buttonText}>✓ Eingenommen</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skippedButton]}
              onPress={handleSkipped}
            >
              <Text style={styles.buttonText}>✗ Verpasst</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.snoozeButton]}
              onPress={handleSnooze}
            >
              <Text style={styles.buttonText}>⏰ Später</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  medicationInfo: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  dosage: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  scheduledTime: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  takenButton: {
    backgroundColor: "#10b981",
  },
  skippedButton: {
    backgroundColor: "#ef4444",
  },
  snoozeButton: {
    backgroundColor: "#f59e0b",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#6b7280",
    fontSize: 16,
  },
});
