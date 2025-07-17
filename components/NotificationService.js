// components/NotificationService.js

import dayjs from "dayjs";
import * as Notifications from "expo-notifications";

// Notification Handler konfigurieren
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

// Alle geplanten Benachrichtigungen für ein Medikament löschen
export async function cancelMedicationNotifications(medId) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduledNotifications.filter(
    (notification) => notification.identifier.startsWith(`med_${medId}_`)
  );
  
  for (const notification of toCancel) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
}

// Benachrichtigungen für ein Medikament planen
export async function scheduleMedicationNotifications(medication) {
  // Zuerst alle bestehenden Benachrichtigungen für dieses Medikament löschen
  await cancelMedicationNotifications(medication.id);
  
  const now = dayjs();
  const scheduledIds = [];
  
  // Für jeden Einnahmezeitpunkt
  for (const time of medication.times) {
    // Für die nächsten 30 Tage planen
    for (let day = 0; day < 30; day++) {
      const scheduleDate = now.add(day, 'day');
      const [hour, minute] = time.split(':').map(Number);
      const scheduleTime = scheduleDate.hour(hour).minute(minute).second(0);
      
      // Nur planen, wenn der Zeitpunkt in der Zukunft liegt
      if (scheduleTime.isAfter(now)) {
        const identifier = `med_${medication.id}_${scheduleTime.format('YYYY-MM-DD_HH-mm')}`;
        
        try {
          await Notifications.scheduleNotificationAsync({
            identifier,
            content: {
              title: "🔔 Medikament-Erinnerung",
              body: `Zeit für ${medication.name} (${medication.dosage})`,
              data: {
                medId: medication.id,
                medName: medication.name,
                dosage: medication.dosage,
                scheduledTime: time,
                date: scheduleDate.format('YYYY-MM-DD'),
              },
            },
            trigger: {
              date: scheduleTime.toDate(),
            },
          });
          
          scheduledIds.push(identifier);
        } catch (error) {
          console.error('Fehler beim Planen der Benachrichtigung:', error);
        }
      }
    }
  }
  
  return scheduledIds;
}

// Alle Benachrichtigungen für alle Medikamente planen
export async function scheduleAllMedicationNotifications(medications) {
  const allScheduledIds = [];
  
  for (const medication of medications) {
    const scheduledIds = await scheduleMedicationNotifications(medication);
    allScheduledIds.push(...scheduledIds);
  }
  
  return allScheduledIds;
}

// Alle Medikamenten-Benachrichtigungen löschen
export async function cancelAllMedicationNotifications() {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const medNotifications = scheduledNotifications.filter(
    (notification) => notification.identifier.startsWith('med_')
  );
  
  for (const notification of medNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
}

// Notification Response Handler
export function addNotificationResponseListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
