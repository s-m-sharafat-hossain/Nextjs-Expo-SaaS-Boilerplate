// apps/web/src/features/chat-n8n/chat.repository.ts
import { prisma } from "@/shared/lib/db";

export class ChatRepository {
  /**
   * Retrieves all chat sessions belonging to a specific user (Tenant Isolation)
   */
  static async getSessionsByUser(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Retrieves a specific session with messages, enforcing ownership
   */
  static async getSessionById(sessionId: string, userId?: string) {
    return prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        ...(userId ? { userId } : {}),
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  /**
   * Creates a new chat session for a user or anonymous widget visitor
   */
  static async createSession(userId?: string, title: string = "New Health Consultation") {
    return prisma.chatSession.create({
      data: {
        title,
        ...(userId ? { userId } : {}),
      },
    });
  }

  /**
   * Saves a message to a session
   */
  static async saveMessage(chatSessionId: string, role: string, content: string) {
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          chatSessionId,
          role,
          content,
        },
      }),
      prisma.chatSession.update({
        where: { id: chatSessionId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return message;
  }

  /**
   * Deletes a chat session enforcing user isolation
   */
  static async deleteSession(sessionId: string, userId: string) {
    return prisma.chatSession.deleteMany({
      where: {
        id: sessionId,
        userId,
      },
    });
  }
}
