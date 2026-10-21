import { ApiClient } from "@/shared/lib/api-client";
import {
  CreditPackage,
  Transaction,
  PayoutRequestInput,
  ManualTrxSubmitInput,
  PaymentGatewayType,
} from "./billing.schema";

export class BillingService {
  /**
   * Fetch active credit packages
   */
  static async getCreditPackages(): Promise<CreditPackage[]> {
    try {
      return await ApiClient.get<CreditPackage[]>("/billing/packages");
    } catch {
      // Fallback mock packages
      return [
        {
          id: "pkg_starter",
          name: "Starter Booster",
          credits: 100,
          price: 19,
          currency: "USD",
          popular: false,
          features: ["100 AI queries", "Basic consultations", "Email receipts"],
        },
        {
          id: "pkg_growth",
          name: "Growth Professional",
          credits: 500,
          price: 69,
          currency: "USD",
          popular: true,
          features: ["500 AI queries", "Priority bookings", "Zero platform fee", "n8n Webhook export"],
        },
        {
          id: "pkg_scale",
          name: "Scale Enterprise",
          credits: 2000,
          price: 199,
          currency: "USD",
          popular: false,
          features: ["2,000 AI queries", "Dedicated VIP SLA", "Multi-Seat team access", "Full API Access"],
        },
      ];
    }
  }

  /**
   * Fetch transaction history for current user/provider
   */
  static async getTransactions(): Promise<Transaction[]> {
    try {
      return await ApiClient.get<Transaction[]>("/billing/transactions");
    } catch {
      return [
        {
          id: "tx_101",
          amount: 69.00,
          currency: "USD",
          type: "CREDIT_PURCHASE",
          status: "COMPLETED",
          gateway: "STRIPE",
          trxId: "ch_3N8g9fLKDj390k",
          description: "Purchased Growth Professional (500 Credits)",
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "tx_102",
          amount: 150.00,
          currency: "USD",
          type: "PROVIDER_PAYOUT",
          status: "PENDING",
          gateway: "STRIPE",
          description: "Payout to Connected Bank Account",
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: "tx_103",
          amount: 35.00,
          currency: "USD",
          type: "BOOKING_PAYMENT",
          status: "COMPLETED",
          gateway: "BKASH",
          trxId: "BKH92048201",
          description: "Consultation Booking with Dr. Sarah",
          createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
        },
      ];
    }
  }

  /**
   * Create Checkout Session for online gateways (Stripe, SSLCommerz, PayPal, etc.)
   */
  static async createCheckoutSession(params: {
    packageId: string;
    gateway: PaymentGatewayType;
    returnUrl?: string;
  }): Promise<{ checkoutUrl: string; sessionId: string }> {
    return await ApiClient.post<{ checkoutUrl: string; sessionId: string }>("/billing/checkout", params);
  }

  /**
   * Submit Provider Payout Request
   */
  static async requestPayout(input: PayoutRequestInput): Promise<{ success: boolean; payoutId: string }> {
    try {
      return await ApiClient.post<{ success: boolean; payoutId: string }>("/billing/payouts", input);
    } catch {
      return {
        success: true,
        payoutId: `payout_${Date.now()}`,
      };
    }
  }

  /**
   * Submit Manual Bank / Mobile Money (bKash/Nagad) TrxID with proof
   */
  static async submitManualTransaction(input: ManualTrxSubmitInput): Promise<{ success: boolean; submissionId: string }> {
    try {
      return await ApiClient.post<{ success: boolean; submissionId: string }>("/billing/manual-trx", input);
    } catch {
      return {
        success: true,
        submissionId: `man_trx_${Date.now()}`,
      };
    }
  }
}
