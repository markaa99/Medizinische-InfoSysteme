import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("currentUser");
      if (saved) setUser(JSON.parse(saved));
      setLoadingUser(false);
    };
    loadUser();
  }, []);

  const login = async (name, password) => {
    const users = JSON.parse(await AsyncStorage.getItem("users") || "{}");

    if (users[name]) {
      if (users[name].password !== password) {
        throw new Error("Falsches Passwort");
      }
    } else {
      // neuer Benutzer wird gespeichert
      users[name] = { password };
      await AsyncStorage.setItem("users", JSON.stringify(users));
    }

    const userObj = { name };
    setUser(userObj);
    await AsyncStorage.setItem("currentUser", JSON.stringify(userObj));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
