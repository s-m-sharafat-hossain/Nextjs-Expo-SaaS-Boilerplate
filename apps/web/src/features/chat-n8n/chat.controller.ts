// apps/web/src/features/chat-n8n/chat.controller.ts
import { NextRequest } from "next/server";
import { ChatService } from "./chat.service";
import { ChatRepository } from "./chat.repository";
import { sendMessageSchema } from "./chat.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class ChatController {
  /**
   * POST /api/v1/chat
   * Dispatches a message to n8n webhook or AI triage
   */
  static sendMessage = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") || undefined;
    const userRole = req.headers.get("x-user-role") || "CONSUMER";

    const body = await req.json();
    const validated = sendMessageSchema.parse(body);

    const result = await ChatService.processMessage(validated, userId, userRole);
    return ApiResponse.success(result, "AI message processed successfully", 200);
  });

  /**
   * GET /api/v1/chat/sessions
   * Lists all sessions for the authenticated user / mobile client
   */
  static listSessions = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return ApiResponse.error("Authentication required to list chat history", 401);
    }

    const sessions = await ChatRepository.getSessionsByUser(userId);
    return ApiResponse.success(sessions, "Chat sessions retrieved successfully");
  });

  /**
   * GET /api/v1/chat/sessions/[id]
   * Gets specific session with message history
   */
  static getSession = asyncHandler(async (req: NextRequest, { params }: { params: { id: string } }) => {
    const userId = req.headers.get("x-user-id") || undefined;
    const session = await ChatRepository.getSessionById(params.id, userId);

    if (!session) {
      return ApiResponse.error("Chat session not found", 404);
    }

    return ApiResponse.success(session, "Chat session details retrieved");
  });
}
