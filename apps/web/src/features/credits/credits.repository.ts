// apps/web/src/features/credits/credits.repository.ts
import { prisma } from "@/shared/lib/db";

export class CreditsRepository {
  static async getBalance(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true },
    });
    return user?.credits ?? 0;
  }

  static async deductCredits(userId: string, action: string, cost: number, metadata?: any) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      if (!user || user.credits < cost) {
        throw new Error("Insufficient credits");
      }

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: cost } },
        select: { credits: true },
      });

      const log = await tx.usageLog.create({
        data: {
          userId,
          action,
          creditsUsed: cost,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });

      return { remainingCredits: updatedUser.credits, logId: log.id };
    });
  }

  static async addCredits(userId: string, amount: number) {
    return prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: amount } },
      select: { credits: true },
    });
  }

  static async getUsageHistory(userId: string) {
    return prisma.usageLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
