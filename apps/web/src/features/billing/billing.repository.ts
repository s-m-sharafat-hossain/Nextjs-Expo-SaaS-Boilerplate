// apps/web/src/features/billing/billing.repository.ts
import { prisma } from "@/shared/lib/db";
import { PaymentStatus, PayoutStatus } from "@prisma/client";

export class BillingRepository {
  static async createTransaction(data: {
    userId: string;
    invoiceNumber: string;
    gateway: string;
    planId?: string;
    baseAmount: number;
    discount?: number;
    taxAmount?: number;
    finalAmount: number;
    currency?: string;
    creditsAdded?: number;
    couponCode?: string;
    status?: PaymentStatus;
  }) {
    return prisma.paymentTransaction.create({
      data: {
        userId: data.userId,
        invoiceNumber: data.invoiceNumber,
        gateway: data.gateway,
        planId: data.planId,
        baseAmount: data.baseAmount,
        discount: data.discount ?? 0,
        taxAmount: data.taxAmount ?? 0,
        finalAmount: data.finalAmount,
        currency: data.currency ?? "USD",
        creditsAdded: data.creditsAdded ?? 0,
        couponCode: data.couponCode,
        status: data.status ?? PaymentStatus.PENDING,
      },
    });
  }

  static async updateTransactionStatus(
    invoiceNumber: string,
    status: PaymentStatus,
    externalTrxId?: string,
    manualTrxId?: string
  ) {
    return prisma.paymentTransaction.update({
      where: { invoiceNumber },
      data: {
        status,
        ...(externalTrxId ? { externalTrxId } : {}),
        ...(manualTrxId ? { manualTrxId } : {}),
      },
    });
  }

  static async getUserTransactions(userId: string) {
    return prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProviderWallet(userId: string) {
    return prisma.wallet.findUnique({
      where: { userId },
    });
  }

  static async createPayoutRequest(
    userId: string,
    amount: number,
    platformFee: number,
    netAmount: number,
    payoutMethod: string,
    accountDetails: any
  ) {
    return prisma.$transaction(async (tx) => {
      // Deduct available balance
      await tx.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
        },
      });

      return tx.payoutRequest.create({
        data: {
          userId,
          amount,
          platformFee,
          netAmount,
          payoutMethod,
          accountDetails,
          status: PayoutStatus.PENDING,
        },
      });
    });
  }

  static async findCoupon(code: string) {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  }
}
