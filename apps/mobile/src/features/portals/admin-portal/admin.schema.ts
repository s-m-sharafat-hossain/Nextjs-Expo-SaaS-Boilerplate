import { z } from "zod";

export const AdminMetricsSchema = z.object({
  mrr: z.number(),
  arr: z.number(),
  totalUsers: z.number(),
  activeProviders: z.number(),
  pendingKycCount: z.number(),
  pendingPayoutsCount: z.number(),
  pendingManualTrxCount: z.number(),
  openDisputesCount: z.number(),
  grossRevenue: z.number(),
  platformCommission: z.number(),
});

export type AdminMetrics = z.infer<typeof AdminMetricsSchema>;

export const KycVerificationItemSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  email: z.string(),
  specialtyOrBusiness: z.string(),
  documentType: z.enum(["PASSPORT", "NATIONAL_ID", "MEDICAL_LICENSE", "BUSINESS_REG"]),
  documentUrl: z.string(),
  status: z.enum(["PENDING", "VERIFIED", "REJECTED"]),
  submittedAt: z.string(),
});

export type KycVerificationItem = z.infer<typeof KycVerificationItemSchema>;

export const AdminPayoutItemSchema = z.object({
  id: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  amount: z.number(),
  currency: z.string(),
  method: z.string(),
  accountDetails: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  requestedAt: z.string(),
});

export type AdminPayoutItem = z.infer<typeof AdminPayoutItemSchema>;

export const AdminManualTrxItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  amount: z.number(),
  currency: z.string(),
  gateway: z.string(),
  transactionId: z.string(),
  senderAccount: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  submittedAt: z.string(),
});

export type AdminManualTrxItem = z.infer<typeof AdminManualTrxItemSchema>;

export const DisputeItemSchema = z.object({
  id: z.string(),
  ticketNumber: z.string(),
  consumerName: z.string(),
  providerName: z.string(),
  bookingId: z.string(),
  reason: z.string(),
  amount: z.number(),
  status: z.enum(["OPEN", "INVESTIGATING", "RESOLVED_REFUNDED", "RESOLVED_DISMISSED"]),
  createdAt: z.string(),
});

export type DisputeItem = z.infer<typeof DisputeItemSchema>;
