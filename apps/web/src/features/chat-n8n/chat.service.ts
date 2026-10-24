// apps/web/src/features/chat-n8n/chat.service.ts
import { ChatRepository } from "./chat.repository";
import { SendMessageInput } from "./chat.schema";
import { siteConfig } from "@shared/config";
import { prisma } from "@/shared/lib/db";
import { AppError } from "@/shared/utils/error-handler";
import { WebhookSecurity } from "@/shared/security/webhook";

export class ChatService {
  /**
   * Main messaging pipeline: persists user message, deducts credits, proxies to n8n or fallback AI
   */
  static async processMessage(input: SendMessageInput, userId?: string, userRole?: string) {
    let sessionId = input.sessionId;

    // 1. Ensure valid session exists
    if (!sessionId) {
      const newSession = await ChatRepository.createSession(userId, "Clinical Consultation");
      sessionId = newSession.id;
    } else {
      const existing = await ChatRepository.getSessionById(sessionId, userId);
      if (!existing) {
        throw new AppError("Chat session not found or unauthorized", 404);
      }
    }

    // 2. Pre-action credit check (for logged-in users)
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      const cost = siteConfig.rewards.creditCostPerAiAction;
      if (user && user.credits < cost) {
        throw new AppError(
          `Insufficient credits. This AI operation requires ${cost} credits. Please upgrade your plan or top up.`,
          402
        );
      }

      // Deduct credits atomically
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: cost } },
        }),
        prisma.usageLog.create({
          data: {
            userId,
            action: "ai_chat",
            creditsUsed: cost,
            metadata: JSON.stringify({ sessionId, promptLength: input.message.length }),
          },
        }),
      ]);
    }

    // 3. Persist User Message
    await ChatRepository.saveMessage(sessionId, "user", input.message);

    // 4. Dispatch to n8n Webhook with HMAC signature and exponential retry
    let assistantReply = "";
    const n8nConfig = siteConfig.n8n;

    if (n8nConfig.enabled && n8nConfig.webhookUrl && !n8nConfig.webhookUrl.includes("yourdomain")) {
      const payload = {
        sessionId,
        message: input.message,
        userId: userId ?? "anonymous-visitor",
        userRole: userRole ?? "CONSUMER",
        timestamp: new Date().toISOString(),
      };

      const result = await WebhookSecurity.dispatchWithRetry(
        n8nConfig.webhookUrl,
        payload,
        n8nConfig.secretToken || "default-n8n-token",
        3
      );

      if (result.success && result.response) {
        assistantReply =
          result.response.output ||
          result.response.text ||
          result.response.message ||
          "Thank you. Your request has been processed.";
      }
    }

    // 5. Portfolio Demo Fallback Engine (when n8n is offline or unconfigured)
    if (!assistantReply) {
      assistantReply = this.generateFallbackResponse(input.message);
    }

    // 6. Persist Assistant Reply
    const savedAssistantMessage = await ChatRepository.saveMessage(
      sessionId,
      "assistant",
      assistantReply
    );

    return {
      sessionId,
      message: savedAssistantMessage,
      remainingCredits: userId
        ? (await prisma.user.findUnique({ where: { id: userId }, select: { credits: true } }))?.credits
        : null,
    };
  }

  /**
   * Helper fallback when live n8n webhook is not yet deployed
   */
  private static generateFallbackResponse(userPrompt: string): string {
    const prompt = userPrompt.toLowerCase();

    if (prompt.includes("appointment") || prompt.includes("book") || prompt.includes("doctor")) {
      return (
        "I can certainly help you book an appointment! Dr. Sarah Mitchell is currently accepting " +
        "virtual consultations. You can view her available calendar slots directly from the 'Find & Book Doctor' " +
        "tab or click into the Provider Directory. Would you like me to guide you to her scheduling page?"
      );
    }

    if (prompt.includes("cost") || prompt.includes("price") || prompt.includes("fee") || prompt.includes("payment")) {
      return (
        "Standard telemedicine consultations start at $80 for a 30-minute second opinion and $120 for a " +
        "comprehensive clinical evaluation. We support Stripe, PayPal, bKash, and manual bank transfers with automatic split " +
        "calculation and instant receipt generation."
      );
    }

    if (prompt.includes("symptom") || prompt.includes("fever") || prompt.includes("headache") || prompt.includes("pain")) {
      return (
        "I've noted your symptoms. While I can assist with general triage information, this is an automated " +
        "pre-assessment. For acute or severe discomfort, please book an immediate consultation with one of our verified " +
        "physicians on the portal or visit the nearest emergency care facility."
      );
    }

    return (
      `Hello! I am your AI Health & Scheduling Assistant powered by n8n and our enterprise MVC architecture. ` +
      `I can help you review symptoms, find qualified doctors, manage appointments, and check your invoice receipts. ` +
      `How can I assist your health journey today?`
    );
  }
}
