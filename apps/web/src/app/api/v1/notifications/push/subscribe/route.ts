// apps/web/src/app/api/v1/notifications/push/subscribe/route.ts
import { NextRequest } from "next/server";
import { PushNotificationService } from "@/shared/notifications/push-service";
import { ApiResponse } from "@/shared/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = req.headers.get("x-user-id") || body.userId || "anonymous";

    if (!body.subscription) {
      return ApiResponse.error("Subscription payload required", 400);
    }

    const result = PushNotificationService.saveSubscription(userId, body.subscription);
    return ApiResponse.success(result, "Push subscription registered successfully");
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to register subscription", 500);
  }
}
