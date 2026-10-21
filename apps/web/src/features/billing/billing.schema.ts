// apps/web/src/features/billing/billing.schema.ts
import { z } from "zod";

export const checkoutSessionSchema = z.object({
  gateway: z.enum([
    "STRIPE",
    "PAYPAL",
    "SSLCOMMERZ",
    "BKASH",
    "RAZORPAY",
    "PAYSTACK",
    "MANUAL_BANK",
  ]),
  planId: z.string().optional(),
  serviceId: z.string().optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  currency: z.string().default("USD"),
  couponCode: z.string().optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const manualPaymentSchema = z.object({
  invoiceNumber: z.string().min(3),
  manualTrxId: z.string().min(4, "Transaction ID must be at least 4 characters"),
  gateway: z.string().default("MANUAL_BANK"),
  amount: z.number().positive(),
  notes: z.string().optional(),
});

export const payoutRequestSchema = z.object({
  amount: z.number().min(20, "Minimum withdrawal amount is $20"),
  payoutMethod: z.enum(["BANK_TRANSFER", "PAYPAL", "BKASH", "STRIPE_CONNECT"]),
  accountDetails: z.record(z.string(), z.any()),
});

export const applyCouponSchema = z.object({
  code: z.string().min(2),
  amount: z.number().positive(),
});

export type CheckoutSessionInput = z.infer<typeof checkoutSessionSchema>;
export type ManualPaymentInput = z.infer<typeof manualPaymentSchema>;
export type PayoutRequestInput = z.infer<typeof payoutRequestSchema>;
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
