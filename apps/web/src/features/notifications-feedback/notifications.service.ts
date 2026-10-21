// apps/web/src/features/notifications-feedback/notifications.service.ts
import { NotificationsRepository } from "./notifications.repository";
import { CreateNotificationInput, SubmitFeedbackInput } from "./notifications.schema";

export class NotificationsService {
  static async list(userId: string) {
    return NotificationsRepository.getUserNotifications(userId);
  }

  static async markRead(notificationId: string, userId: string) {
    return NotificationsRepository.markAsRead(notificationId, userId);
  }

  static async markAllRead(userId: string) {
    return NotificationsRepository.markAllAsRead(userId);
  }

  static async dispatch(input: CreateNotificationInput) {
    return NotificationsRepository.createNotification(input);
  }

  static async submitFeedback(userId: string | undefined, input: SubmitFeedbackInput) {
    return NotificationsRepository.saveFeedback(userId, input);
  }
}
