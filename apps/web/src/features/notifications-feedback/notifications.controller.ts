// apps/web/src/features/notifications-feedback/notifications.controller.ts
import { NextRequest } from "next/server";
import { NotificationsService } from "./notifications.service";
import { submitFeedbackSchema } from "./notifications.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class NotificationsController {
  static list = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const notifications = await NotificationsService.list(userId);
    return ApiResponse.success(notifications, "Notifications retrieved");
  });

  static markRead = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    if (body.all) {
      await NotificationsService.markAllRead(userId);
    } else if (body.id) {
      await NotificationsService.markRead(body.id, userId);
    }
    return ApiResponse.success(null, "Notification status updated");
  });

  static submitFeedback = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") || undefined;
    const body = await req.json();
    const validated = submitFeedbackSchema.parse(body);
    const feedback = await NotificationsService.submitFeedback(userId, validated);
    return ApiResponse.success(feedback, "Feedback submitted successfully", 201);
  });
}
