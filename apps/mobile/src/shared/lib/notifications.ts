// apps/mobile/src/shared/lib/notifications.ts
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { ApiClient } from "./api-client";
import { SecureStoreManager } from "./secure-store";

// Configure default notification presentation behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class MobileNotificationService {
  /**
   * Request permissions and retrieve Expo push token
   */
  static async registerForPushNotifications(): Promise<string | null> {
    if (Platform.OS === "web") {
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.warn("[MobileNotifications] Push notification permissions denied");
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      // Save token in secure store
      await SecureStoreManager.setItem("push_notification_token", token);

      // Register token with backend push dispatcher
      try {
        await ApiClient.post("/notifications/push/subscribe", {
          subscription: {
            endpoint: token,
            platform: Platform.OS,
          },
        });
      } catch (err) {
        console.warn("[MobileNotifications] Could not sync push token with backend:", err);
      }

      return token;
    } catch (error) {
      console.warn("[MobileNotifications] Error registering for push notifications:", error);
      return null;
    }
  }

  /**
   * Add listener for incoming notifications in foreground
   */
  static addNotificationReceivedListener(callback: (notification: Notifications.Notification) => void) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add listener for user interactions with notifications
   */
  static addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Schedule a local notification
   */
  static async scheduleLocalNotification(title: string, body: string, data?: Record<string, any>) {
    return Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // deliver immediately
    });
  }
}
