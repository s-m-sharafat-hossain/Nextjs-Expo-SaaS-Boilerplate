// apps/web/src/app/api/v1/notifications/push/send/route.ts
import { NextRequest } from "next/server";
import { PushNotificationService } from "@/shared/notifications/push-service";
import { ApiResponse } from "@/shared/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, templateType, lang, title, message, url } = body;

    if (!userId) {
      return ApiResponse.error("userId is required", 400);
    }

    let payload: import("@/shared/notifications/push-service").PushNotificationPayload = {
      title: title || "Notification",
      body: message || "You have an update",
      url,
    };
    if (templateType) {
      payload = PushNotificationService.getTemplate(templateType, lang || "en", body.params || {});
    }

    const result = await PushNotificationService.sendWebPush(userId, payload);
    return ApiResponse.success(result, `Dispatched push to ${result.sentCount} client device(s)`);
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to dispatch push notification", 500);
  }
}
