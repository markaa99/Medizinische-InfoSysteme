import { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scheduleImmediateTestNotification } from "./NotificationService";
import RemindersContext from "./RemindersContext";
import UserContext from "./UserContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);
  const { refreshNotifications, clearAllNotifications } = useContext(RemindersContext);

  const handleLogout = () => {
    Alert.alert("Abmelden", "Möchtest du dich wirklich abmelden?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Abmelden",
        style: "destructive",
        onPress: async () => {
          await clearAllNotifications();
          logout();
        },
      },
    ]);
  };

  const handleTestNotification = async () => {
    await scheduleImmediateTestNotification();
    Alert.alert("Test-Benachrichtigung", "Eine Test-Benachrichtigung wurde gesendet!");
  };

  const handleRefreshNotifications = async () => {
    await refreshNotifications();
    Alert.alert("Erinnerungen aktualisiert", "Alle Benachrichtigungen wurden neu geplant!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Angemeldet als:</Text>
      <Text style={styles.username}>
        {user ? user.name : "Kein Benutzer aktiv"}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTestNotification}>
          <Text style={styles.buttonText}>🔔 Test-Benachrichtigung</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.refreshButton]} onPress={handleRefreshNotifications}>
          <Text style={styles.buttonText}>🔄 Erinnerungen aktualisieren</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>🚪 Abmelden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: "#666",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#f59e0b",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
