// components/AddMedicationModal.js

import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddMedicationModal({ onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timesText, setTimesText] = useState(""); // z. B. "08:00, 20:00"

  const handleSubmit = () => {
    const times = timesText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => /^\d{2}:\d{2}$/.test(s)); // einfache Validierung HH:MM
    if (!name || !dosage || times.length === 0) {
      alert("Bitte alle Felder korrekt ausfüllen!");
      return;
    }
    onConfirm(name, dosage, times);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalContainer}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Neues Medikament hinzufügen</Text>

        <Text style={styles.label}>Name des Medikaments</Text>
        <TextInput
          style={styles.input}
          placeholder="z. B. Metformin"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Dosierung</Text>
        <TextInput
          style={styles.input}
          placeholder="z. B. 500 mg"
          value={dosage}
          onChangeText={setDosage}
        />

        <Text style={styles.label}>Uhrzeiten (HH:MM, Komma-getrennt)</Text>
        <TextInput
          style={styles.input}
          placeholder="z. B. 08:00, 20:00"
          value={timesText}
          onChangeText={setTimesText}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
            <Text style={styles.buttonText}>Abbrechen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonOk} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Hinzufügen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  inner: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  buttonCancel: {
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
  buttonOk: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#3b82f6",
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});
