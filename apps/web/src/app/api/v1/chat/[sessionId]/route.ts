// apps/web/src/app/api/v1/chat/[sessionId]/route.ts
import { ChatController } from "@/features/chat-n8n/chat.controller";

export const GET = ChatController.getSession;
