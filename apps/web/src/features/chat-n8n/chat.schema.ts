// apps/web/src/features/chat-n8n/chat.schema.ts
import { z } from "zod";

export const sendMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
  sessionId: z.string().cuid().optional(),
  context: z.record(z.string(), z.any()).optional(),
});

export const createSessionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
});

export const n8nWebhookPayloadSchema = z.object({
  sessionId: z.string(),
  message: z.string(),
  userId: z.string().optional(),
  userRole: z.string().optional(),
  timestamp: z.string(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type N8nWebhookPayload = z.infer<typeof n8nWebhookPayloadSchema>;

export interface ChatMessageDTO {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date | string;
}

export interface ChatSessionDTO {
  id: string;
  title: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  messages: ChatMessageDTO[];
}
