import { useContext } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import UserContext from "./UserContext";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert("Abmelden", "Möchtest du dich wirklich abmelden?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Abmelden",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Angemeldet als:</Text>
      <Text style={styles.username}>
        {user ? user.name : "Kein Benutzer aktiv"}
      </Text>

      <Button title="Abmelden" color="#ef4444" onPress={handleLogout} />
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
});
