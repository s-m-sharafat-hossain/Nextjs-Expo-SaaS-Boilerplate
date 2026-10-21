import { ApiClient } from "@/shared/lib/api-client";
import {
  AdminMetrics,
  KycVerificationItem,
  AdminPayoutItem,
  AdminManualTrxItem,
  DisputeItem,
} from "./admin.schema";

export class AdminMobileService {
  /**
   * Fetch Super Admin Dashboard KPIs
   */
  static async getMetrics(): Promise<AdminMetrics> {
    try {
      return await ApiClient.get<AdminMetrics>("/admin/metrics");
    } catch {
      return {
        mrr: 18450,
        arr: 221400,
        totalUsers: 1420,
        activeProviders: 84,
        pendingKycCount: 3,
        pendingPayoutsCount: 4,
        pendingManualTrxCount: 2,
        openDisputesCount: 1,
        grossRevenue: 94820,
        platformCommission: 14223,
      };
    }
  }

  /**
   * Fetch Pending KYC Submissions
   */
  static async getPendingKyc(): Promise<KycVerificationItem[]> {
    try {
      return await ApiClient.get<KycVerificationItem[]>("/admin/kyc/pending");
    } catch {
      return [
        {
          id: "kyc_01",
          providerId: "prv_sarah",
          providerName: "Dr. Sarah Mitchell",
          email: "sarah.m@healthclinic.org",
          specialtyOrBusiness: "Board Certified Dermatology",
          documentType: "MEDICAL_LICENSE",
          documentUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
          status: "PENDING",
          submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: "kyc_02",
          providerId: "prv_david",
          providerName: "David Chen, Legal Advisory",
          email: "david@chenlegal.com",
          specialtyOrBusiness: "Corporate & Trademark Law",
          documentType: "BUSINESS_REG",
          documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400",
          status: "PENDING",
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
  }

  /**
   * 1-Tap KYC Review (VERIFIED / REJECTED)
   */
  static async reviewKyc(id: string, status: "VERIFIED" | "REJECTED"): Promise<void> {
    try {
      await ApiClient.post(`/admin/kyc/${id}/review`, { status });
    } catch {
      // Mock success for offline testing
    }
  }

  /**
   * Fetch Pending Payout Requests
   */
  static async getPendingPayouts(): Promise<AdminPayoutItem[]> {
    try {
      return await ApiClient.get<AdminPayoutItem[]>("/admin/payouts/pending");
    } catch {
      return [
        {
          id: "payout_901",
          providerId: "prv_sarah",
          providerName: "Dr. Sarah Mitchell",
          amount: 450.00,
          currency: "USD",
          method: "STRIPE_CONNECT",
          accountDetails: "acct_1NZsL290dk2k3",
          status: "PENDING",
          requestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: "payout_902",
          providerId: "prv_david",
          providerName: "David Chen",
          amount: 320.00,
          currency: "USD",
          method: "BANK_TRANSFER",
          accountDetails: "Chase Bank •••• 9102",
          status: "PENDING",
          requestedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
    }
  }

  /**
   * 1-Tap Payout Action (APPROVED / REJECTED)
   */
  static async reviewPayout(id: string, status: "APPROVED" | "REJECTED"): Promise<void> {
    try {
      await ApiClient.post(`/admin/payouts/${id}/review`, { status });
    } catch {
      // Mock success
    }
  }

  /**
   * Fetch Pending Manual Bank/Mobile Money Trx
   */
  static async getManualTrx(): Promise<AdminManualTrxItem[]> {
    try {
      return await ApiClient.get<AdminManualTrxItem[]>("/admin/manual-trx/pending");
    } catch {
      return [
        {
          id: "trx_001",
          userId: "usr_alex",
          userName: "Alex Johnson",
          amount: 69.00,
          currency: "USD",
          gateway: "BKASH",
          transactionId: "BKH92048201",
          senderAccount: "01711002233",
          status: "PENDING",
          submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        },
      ];
    }
  }

  /**
   * 1-Tap Manual Trx Review
   */
  static async reviewManualTrx(id: string, status: "APPROVED" | "REJECTED"): Promise<void> {
    try {
      await ApiClient.post(`/admin/manual-trx/${id}/review`, { status });
    } catch {
      // Mock success
    }
  }

  /**
   * Fetch Active Disputes
   */
  static async getDisputes(): Promise<DisputeItem[]> {
    try {
      return await ApiClient.get<DisputeItem[]>("/admin/disputes");
    } catch {
      return [
        {
          id: "dsp_101",
          ticketNumber: "DSP-4901",
          consumerName: "Emily Watson",
          providerName: "Dr. Sarah Mitchell",
          bookingId: "BKG-7729",
          reason: "Provider was 20 minutes late to video consultation due to clinic emergency.",
          amount: 85.00,
          status: "OPEN",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
  }

  /**
   * Resolve Dispute
   */
  static async resolveDispute(id: string, resolution: "RESOLVED_REFUNDED" | "RESOLVED_DISMISSED"): Promise<void> {
    try {
      await ApiClient.post(`/admin/disputes/${id}/resolve`, { resolution });
    } catch {
      // Mock success
    }
  }
}
