import { useContext, useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import UserContext from "./UserContext";

export default function LoginScreen() {
  const { login } = useContext(UserContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const passwordRef = useRef(null);

  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert("Fehler", "Bitte Name und Passwort eingeben.");
      return;
    }

    try {
      await login(name.trim(), password);
    } catch (err) {
      Alert.alert("Login fehlgeschlagen", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Willkommen!</Text>

      <TextInput
        style={styles.input}
        placeholder="Dein Name"
        value={name}
        onChangeText={setName}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()} // Fokus auf Passwortfeld
      />

      <TextInput
        ref={passwordRef} // mit useRef verbinden
        style={styles.input}
        placeholder="Passwort"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />

      <Button title="Einloggen" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
});
