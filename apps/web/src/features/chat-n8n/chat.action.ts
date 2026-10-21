// apps/web/src/features/chat-n8n/chat.action.ts
"use server";

import { ChatService } from "./chat.service";
import { ChatRepository } from "./chat.repository";
import { sendMessageSchema, SendMessageInput } from "./chat.schema";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(input: SendMessageInput, userId?: string, userRole?: string) {
  try {
    const validated = sendMessageSchema.parse(input);
    const result = await ChatService.processMessage(validated, userId, userRole);
    revalidatePath("/consumer/chat");
    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to process message with AI assistant",
    };
  }
}

export async function getSessionsAction(userId: string) {
  try {
    const sessions = await ChatRepository.getSessionsByUser(userId);
    return { success: true, data: sessions };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch chat sessions" };
  }
}

export async function getSessionDetailAction(sessionId: string, userId?: string) {
  try {
    const session = await ChatRepository.getSessionById(sessionId, userId);
    return { success: true, data: session };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch session detail" };
  }
}

export async function deleteSessionAction(sessionId: string, userId: string) {
  try {
    await ChatRepository.deleteSession(sessionId, userId);
    revalidatePath("/consumer/chat");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete session" };
  }
}
