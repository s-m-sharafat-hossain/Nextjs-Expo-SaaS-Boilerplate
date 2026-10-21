import { z } from "zod";

export const PaymentGatewayEnum = z.enum([
  "STRIPE",
  "PAYPAL",
  "SSLCOMMERZ",
  "BKASH",
  "RAZORPAY",
  "PAYSTACK",
  "MANUAL_BANK",
]);

export type PaymentGatewayType = z.infer<typeof PaymentGatewayEnum>;

export const GatewayInfoSchema = z.object({
  id: PaymentGatewayEnum,
  name: z.string(),
  currencies: z.array(z.string()),
  country: z.string(),
  badge: z.string().optional(),
});

export type GatewayInfo = z.infer<typeof GatewayInfoSchema>;

export const CreditPackageSchema = z.object({
  id: z.string(),
  name: z.string(),
  credits: z.number(),
  price: z.number(),
  currency: z.string().default("USD"),
  popular: z.boolean().default(false),
  features: z.array(z.string()),
});

export type CreditPackage = z.infer<typeof CreditPackageSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  type: z.enum(["CREDIT_PURCHASE", "BOOKING_PAYMENT", "PROVIDER_PAYOUT", "REFUND"]),
  status: z.enum(["COMPLETED", "PENDING", "FAILED", "REJECTED"]),
  gateway: PaymentGatewayEnum,
  trxId: z.string().optional(),
  description: z.string(),
  createdAt: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const PayoutRequestSchema = z.object({
  amount: z.number().min(10, "Minimum payout is $10"),
  payoutMethod: z.enum(["BANK_TRANSFER", "PAYPAL", "STRIPE_CONNECT", "BKASH"]),
  accountDetails: z.string().min(5, "Please enter valid account or bank details"),
  notes: z.string().optional(),
});

export type PayoutRequestInput = z.infer<typeof PayoutRequestSchema>;

export const ManualTrxSubmitSchema = z.object({
  gateway: PaymentGatewayEnum,
  amount: z.number().min(1, "Amount must be at least 1"),
  transactionId: z.string().min(4, "Transaction ID/Ref is required"),
  senderNumberOrAccount: z.string().min(4, "Sender account/phone is required"),
  packageId: z.string().optional(),
  proofImageUrl: z.string().optional(),
});

export type ManualTrxSubmitInput = z.infer<typeof ManualTrxSubmitSchema>;
