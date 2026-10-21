// apps/web/src/features/portals/admin-portal/admin.schema.ts
import { z } from "zod";

export const reviewKycSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
  status: z.enum(["VERIFIED", "APPROVED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});

export const processPayoutSchema = z.object({
  payoutId: z.string().min(1, "Payout ID is required"),
  status: z.enum(["PAID", "REJECTED"]),
  rejectionReason: z.string().optional(),
  transactionRef: z.string().optional(),
});

export const verifyTransactionSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  status: z.enum(["PAID", "COMPLETED", "FAILED"]),
  rejectionReason: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  isActive: z.boolean().optional(),
  isBanned: z.boolean().optional(),
  role: z.enum(["ADMIN", "PROVIDER", "CONSUMER"]).optional(),
  creditsDelta: z.number().optional(),
});

export const getUsersFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["ADMIN", "PROVIDER", "CONSUMER"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export type ReviewKycInput = z.infer<typeof reviewKycSchema>;
export type ProcessPayoutInput = z.infer<typeof processPayoutSchema>;
export type VerifyTransactionInput = z.infer<typeof verifyTransactionSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type GetUsersFilterInput = z.infer<typeof getUsersFilterSchema>;
