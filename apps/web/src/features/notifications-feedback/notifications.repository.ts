// apps/web/src/features/notifications-feedback/notifications.repository.ts
import { prisma } from "@/shared/lib/db";
import { CreateNotificationInput, SubmitFeedbackInput } from "./notifications.schema";

export class NotificationsRepository {
  static async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  static async createNotification(data: CreateNotificationInput) {
    return prisma.notification.create({
      data,
    });
  }

  static async saveFeedback(userId: string | undefined, data: SubmitFeedbackInput) {
    return prisma.feedback.create({
      data: {
        userId,
        type: data.type,
        message: data.message,
        rating: data.rating,
        email: data.email,
      },
    });
  }
}
