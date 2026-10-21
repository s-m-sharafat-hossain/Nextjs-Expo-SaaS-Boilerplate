// apps/mobile/src/features/chat-n8n/chat.schema.ts
import { z } from "zod";

export const MessageRoleSchema = z.enum(["user", "assistant", "system"]);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: MessageRoleSchema,
  content: z.string(),
  createdAt: z.string().or(z.date()),
  tokensUsed: z.number().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const SendMessageInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  sessionId: z.string().optional(),
  model: z.string().optional().default("gpt-4o-mini"),
  temperature: z.number().min(0).max(1).optional().default(0.7),
});
export type SendMessageInput = {
  message: string;
  sessionId?: string;
  model?: string;
  temperature?: number;
};

export const ChatSessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  messages: z.array(ChatMessageSchema).optional(),
});
export type ChatSession = z.infer<typeof ChatSessionSchema>;
