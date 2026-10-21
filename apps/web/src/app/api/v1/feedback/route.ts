// apps/web/src/app/api/v1/feedback/route.ts
import { NotificationsController } from "@/features/notifications-feedback/notifications.controller";

export const POST = NotificationsController.submitFeedback;
