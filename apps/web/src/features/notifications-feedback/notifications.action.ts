// apps/web/src/features/notifications-feedback/notifications.action.ts
"use server";

import { NotificationsService } from "./notifications.service";
import { submitFeedbackSchema, SubmitFeedbackInput } from "./notifications.schema";
import { revalidatePath } from "next/cache";

export async function markNotificationReadAction(notificationId: string, userId: string) {
  try {
    await NotificationsService.markRead(notificationId, userId);
    revalidatePath("/consumer");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to mark as read" };
  }
}

export async function submitFeedbackAction(userId: string | undefined, input: SubmitFeedbackInput) {
  try {
    const validated = submitFeedbackSchema.parse(input);
    const feedback = await NotificationsService.submitFeedback(userId, validated);
    return { success: true, data: feedback };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit feedback" };
  }
}
