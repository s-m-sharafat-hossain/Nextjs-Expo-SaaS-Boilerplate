// apps/web/src/features/portals/admin-portal/admin.repository.ts
import { prisma } from "@/shared/lib/db";
import { KycStatus, PayoutStatus, PaymentStatus, Role } from "@prisma/client";
import { GetUsersFilterInput } from "./admin.schema";

export class AdminRepository {
  /**
   * Aggregate platform-wide analytics and queue counts
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      totalProviders,
      totalConsumers,
      pendingKycs,
      pendingPayouts,
      pendingTrx,
      paymentsAgg,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.PROVIDER } }),
      prisma.user.count({ where: { role: Role.CONSUMER } }),
      prisma.kycDocument.count({ where: { status: KycStatus.PENDING } }),
      prisma.payoutRequest.count({ where: { status: PayoutStatus.PENDING } }),
      prisma.paymentTransaction.count({ where: { status: PaymentStatus.PENDING } }),
      prisma.paymentTransaction.aggregate({
        where: { status: PaymentStatus.PAID },
        _sum: { finalAmount: true },
        _count: { _all: true },
      }),
    ]);

    const grossVolume = paymentsAgg._sum?.finalAmount || 0;
    const platformCommission = grossVolume * 0.15; // 15% standard commission rate

    return {
      totalUsers,
      totalProviders,
      totalConsumers,
      pendingKycs,
      pendingPayouts,
      pendingTrx,
      grossVolume,
      platformCommission,
      completedTransactionsCount: paymentsAgg._count?._all || 0,
    };
  }

  /**
   * Get paginated users directory
   */
  static async getUsers(filter: GetUsersFilterInput) {
    const where: any = {};
    if (filter.role) {
      where.role = filter.role;
    }
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          credits: true,
          isActive: true,
          isBanned: true,
          kycStatus: true,
          createdAt: true,
          wallet: {
            select: {
              balance: true,
              totalEarned: true,
            },
          },
        },
      }),
    ]);

    return { total, users, page: filter.page, totalPages: Math.ceil(total / filter.limit) };
  }

  /**
   * Update User status, ban, role or balance
   */
  static async updateUser(userId: string, data: { isActive?: boolean; isBanned?: boolean; role?: Role; creditsDelta?: number }) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.isBanned !== undefined ? { isBanned: data.isBanned } : {}),
        ...(data.role ? { role: data.role } : {}),
        ...(data.creditsDelta ? { credits: { increment: data.creditsDelta } } : {}),
      },
    });
  }

  /**
   * Get KYC queue documents
   */
  static async getKycs(status?: KycStatus) {
    return prisma.kycDocument.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Review KYC document and sync user status
   */
  static async updateKycStatus(
    documentId: string,
    status: KycStatus,
    rejectionReason?: string,
    adminId?: string
  ) {
    return prisma.$transaction(async (tx: any) => {
      const doc = await tx.kycDocument.update({
        where: { id: documentId },
        data: {
          status,
          rejectionReason: status === KycStatus.REJECTED ? rejectionReason : null,
          reviewedAt: new Date(),
          reviewedBy: adminId || "SUPER_ADMIN",
        },
      });

      // Update user kycStatus
      await tx.user.update({
        where: { id: doc.userId },
        data: {
          kycStatus: status === KycStatus.VERIFIED ? KycStatus.VERIFIED : KycStatus.REJECTED,
        },
      });

      return doc;
    });
  }

  /**
   * Get Payout requests
   */
  static async getPayoutRequests(status?: PayoutStatus) {
    return prisma.payoutRequest.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            wallet: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Process Payout Request (PAID or REJECTED)
   */
  static async processPayout(
    payoutId: string,
    status: PayoutStatus,
    rejectionReason?: string,
    transactionRef?: string
  ) {
    return prisma.$transaction(async (tx: any) => {
      const payout = await tx.payoutRequest.findUnique({
        where: { id: payoutId },
        include: { user: { include: { wallet: true } } },
      });

      if (!payout) throw new Error("Payout request not found");

      const updated = await tx.payoutRequest.update({
        where: { id: payoutId },
        data: {
          status,
          rejectionReason: status === PayoutStatus.REJECTED ? rejectionReason : null,
          processedAt: new Date(),
        },
      });

      // Wallet adjustments
      if (payout.user.wallet) {
        if (status === PayoutStatus.PAID) {
          await tx.wallet.update({
            where: { id: payout.user.wallet.id },
            data: {
              totalWithdrawn: { increment: payout.netAmount },
            },
          });
        } else if (status === PayoutStatus.REJECTED) {
          // Refund back to available balance
          await tx.wallet.update({
            where: { id: payout.user.wallet.id },
            data: {
              balance: { increment: payout.amount },
            },
          });
        }
      }

      return updated;
    });
  }

  /**
   * Get Manual Transactions (bKash, Nagad, Bank, Crypto)
   */
  static async getTransactions(status?: PaymentStatus) {
    return prisma.paymentTransaction.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Verify Manual Transaction
   */
  static async verifyTransaction(
    transactionId: string,
    status: PaymentStatus,
    rejectionReason?: string
  ) {
    return prisma.$transaction(async (tx: any) => {
      const trx = await tx.paymentTransaction.update({
        where: { id: transactionId },
        data: {
          status,
        },
      });

      // If completed, update user credits or associated order if applicable
      if (status === PaymentStatus.PAID && trx.userId) {
        await tx.user.update({
          where: { id: trx.userId },
          data: {
            credits: { increment: Math.floor(trx.finalAmount * 10) }, // 10 credits per USD
          },
        });
      }

      return trx;
    });
  }
}
