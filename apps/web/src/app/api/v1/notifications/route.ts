// apps/web/src/app/api/v1/notifications/route.ts
import { NotificationsController } from "@/features/notifications-feedback/notifications.controller";

export const GET = NotificationsController.list;
export const POST = NotificationsController.markRead;
