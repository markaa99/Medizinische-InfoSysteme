// components/NotificationService.js

import * as Notifications from "expo-notifications";

// Funktion: Berechtigungen einholen
export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      alert(
        "Ohne Benachrichtigungen kannst du keine Einnahmeerinnerungen erhalten."
      );
      return false;
    }
  }
  return true;
}

// Beispiel: Eine Erinnerung sofort testen
export async function scheduleImmediateTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test",
      body: "Falls du das siehst, funktionieren Notifications.",
    },
    trigger: null, // Sofort anzeigen
  });
}
