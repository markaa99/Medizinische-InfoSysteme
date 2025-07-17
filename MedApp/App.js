import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useContext, useEffect, useRef } from "react";
import 'react-native-get-random-values';

import { requestNotificationPermission } from "./components/NotificationService";
import { RemindersProvider } from "./components/RemindersContext";
import UserContext, { UserProvider } from "./components/UserContext";

// Screens
import DrugInfoScreen from "./components/DrugInfoScreen";
import LoginScreen from "./components/LoginScreen";
import MedicationDetail from "./components/MedicationDetail";
import MedicationList from "./components/MedicationList";
import ProfileScreen from "./components/ProfileScreen";

const Stack = createStackNavigator();

function MainNavigator() {
  const { user, loadingUser } = useContext(UserContext);
  const navigationRef = useRef();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!loadingUser && !user && navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [user, loadingUser]);

  if (loadingUser) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="MedList"
              component={MedicationList}
              options={{ title: "Meine Medikation" }}
            />
            <Stack.Screen
              name="MedDetail"
              component={MedicationDetail}
              options={{ title: "Details" }}
            />
            <Stack.Screen
              name="DrugInfo"
              component={DrugInfoScreen}
              options={{ title: "Infos" }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: "Profil" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
console.log("LoginScreen:", LoginScreen);

export default function App() {
  return (
    <UserProvider>
      <RemindersProvider>
        <MainNavigator />
      </RemindersProvider>
    </UserProvider>
  );
}
