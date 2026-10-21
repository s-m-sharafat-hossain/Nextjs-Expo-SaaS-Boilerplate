// apps/web/src/features/ai-engine/ai.repository.ts
import { prisma } from "@/shared/lib/db";

export class AiRepository {
  static async saveGeneration(data: {
    userId: string;
    toolType: string;
    prompt: string;
    output: string;
    creditsUsed: number;
  }) {
    return prisma.aiGeneration.create({
      data,
    });
  }

  static async getHistory(userId: string) {
    return prisma.aiGeneration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
