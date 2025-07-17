// components/MedicationDetail.js

import { useContext, useMemo } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import dayjs from "dayjs";
import RemindersContext from "./RemindersContext";

export default function MedicationDetail({ route }) {
  const { medId } = route.params;
  const { medications, intakeLogs, logIntake } = useContext(RemindersContext);

  // Medikament-Daten aus dem Context holen
  const med = medications.find((m) => m.id === medId);

  // Logs für dieses Medikament (oder leeres Array)
  const rawLogs = intakeLogs[medId] || [];

  // Logs sortieren: neueste zuerst
  const sortedLogs = useMemo(
    () =>
      [...rawLogs].sort(
        (a, b) =>
          dayjs(b.date + " " + b.time).valueOf() -
          dayjs(a.date + " " + a.time).valueOf()
      ),
    [rawLogs]
  );

  if (!med) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Medikament nicht gefunden.</Text>
      </View>
    );
  }

  // Heute und jetzt
  const today = dayjs().format("YYYY-MM-DD");
  const now = dayjs().format("HH:mm");

  const handleTake = (status) => {
    logIntake({
      medId,
      date: today,
      time: now,
      status,
    });
    Alert.alert(
      "Einnahme protokolliert",
      status === "taken"
        ? "Du hast die Einnahme als genommen markiert."
        : "Du hast die Einnahme als verpasst markiert."
    );
  };

  const renderLog = ({ item }) => (
    <View style={styles.logItem}>
      <Text style={styles.logText}>
        {item.date} — {item.time} —{" "}
        {item.status === "taken" ? "✔️ eingenommen" : "❌ verpasst"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{med.name}</Text>
      <Text style={styles.subtitle}>{med.dosage}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonTaken]}
          onPress={() => handleTake("taken")}
        >
          <Text style={styles.buttonText}>Genommen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonMissed]}
          onPress={() => handleTake("missed")}
        >
          <Text style={styles.buttonText}>Verpasst</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logContainer}>
        <Text style={styles.logHeader}>Einnahme-Protokoll:</Text>
        <FlatList
          data={sortedLogs}
          renderItem={renderLog}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyLogText}>
              Noch keine Einträge vorhanden.
            </Text>
          }
          contentContainerStyle={
            sortedLogs.length === 0 ? styles.emptyContainer : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#999",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  button: {
    flex: 0.4,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonTaken: {
    backgroundColor: "#10b981",
  },
  buttonMissed: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  logContainer: {
    flex: 1,
    marginTop: 16,
  },
  logHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  logItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  logText: {
    fontSize: 14,
    color: "#555",
  },
  emptyLogText: {
    textAlign: "center",
    color: "#999",
    marginTop: 24,
    fontSize: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
