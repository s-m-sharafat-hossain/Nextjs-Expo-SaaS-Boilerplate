// apps/web/src/features/portals/admin-portal/admin.service.ts
import { AdminRepository } from "./admin.repository";
import {
  ReviewKycInput,
  ProcessPayoutInput,
  VerifyTransactionInput,
  UpdateUserStatusInput,
  GetUsersFilterInput,
} from "./admin.schema";
import { KycStatus, PayoutStatus, PaymentStatus } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { NotificationsRepository } from "@/features/notifications-feedback/notifications.repository";

export class AdminService {
  /**
   * Get Platform overview metrics
   */
  static async getPlatformStats() {
    return AdminRepository.getPlatformStats();
  }

  /**
   * Directory of users
   */
  static async getUsers(filter: GetUsersFilterInput) {
    return AdminRepository.getUsers(filter);
  }

  /**
   * Update User
   */
  static async updateUser(input: UpdateUserStatusInput) {
    const updated = await AdminRepository.updateUser(input.userId, {
      isActive: input.isActive,
      isBanned: input.isBanned,
      role: input.role,
      creditsDelta: input.creditsDelta,
    });

    return updated;
  }

  /**
   * List KYC documents
   */
  static async getKycs(status?: string) {
    const kycStatus = status ? (status as KycStatus) : undefined;
    return AdminRepository.getKycs(kycStatus);
  }

  /**
   * Approve or Reject KYC
   */
  static async reviewKyc(input: ReviewKycInput, adminId?: string) {
    if (input.status === "REJECTED" && !input.rejectionReason) {
      throw new AppError("A rejection reason is required when declining KYC credentials.", 400);
    }

    const prismaStatus =
      input.status === "APPROVED" || input.status === "VERIFIED"
        ? KycStatus.VERIFIED
        : KycStatus.REJECTED;

    const doc = await AdminRepository.updateKycStatus(
      input.documentId,
      prismaStatus,
      input.rejectionReason,
      adminId
    );

    // Send notification to user
    await NotificationsRepository.createNotification({
      userId: doc.userId,
      title: prismaStatus === KycStatus.VERIFIED ? "KYC Verification Approved" : "KYC Verification Rejected",
      message:
        prismaStatus === KycStatus.VERIFIED
          ? "Congratulations! Your professional credentials have been verified. You can now accept client bookings."
          : `Your KYC submission was declined: ${input.rejectionReason}`,
      link: "/provider/kyc",
    });

    return doc;
  }

  /**
   * List Payout Requests
   */
  static async getPayoutRequests(status?: string) {
    const payoutStatus = status ? (status as PayoutStatus) : undefined;
    return AdminRepository.getPayoutRequests(payoutStatus);
  }

  /**
   * Process Payout Request
   */
  static async processPayout(input: ProcessPayoutInput) {
    if (input.status === "REJECTED" && !input.rejectionReason) {
      throw new AppError("Rejection reason is required when rejecting a payout request.", 400);
    }

    const result = await AdminRepository.processPayout(
      input.payoutId,
      input.status as PayoutStatus,
      input.rejectionReason,
      input.transactionRef
    );

    // Notify provider
    await NotificationsRepository.createNotification({
      userId: result.userId,
      title: input.status === "PAID" ? "Payout Dispatched" : "Payout Request Declined",
      message:
        input.status === "PAID"
          ? `Your withdrawal request of $${result.netAmount} has been processed via ${result.payoutMethod}.`
          : `Your payout request was rejected and funds refunded to your wallet: ${input.rejectionReason}`,
      link: "/provider/payouts",
    });

    return result;
  }

  /**
   * List Transactions
   */
  static async getTransactions(status?: string) {
    const paymentStatus = status ? (status as PaymentStatus) : undefined;
    return AdminRepository.getTransactions(paymentStatus);
  }

  /**
   * Verify Manual Transaction
   */
  static async verifyTransaction(input: VerifyTransactionInput) {
    const prismaStatus =
      input.status === "PAID" || input.status === "COMPLETED"
        ? PaymentStatus.PAID
        : PaymentStatus.FAILED;

    const result = await AdminRepository.verifyTransaction(
      input.transactionId,
      prismaStatus,
      input.rejectionReason
    );

    if (result.userId) {
      await NotificationsRepository.createNotification({
        userId: result.userId,
        title: prismaStatus === PaymentStatus.PAID ? "Payment Confirmed" : "Payment Verification Failed",
        message:
          prismaStatus === PaymentStatus.PAID
            ? `Your payment of $${result.finalAmount} has been verified and processed.`
            : `Your manual payment verification failed. Please contact support.`,
      });
    }

    return result;
  }
}
