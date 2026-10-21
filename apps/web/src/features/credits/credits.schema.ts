// apps/web/src/features/credits/credits.schema.ts
import { z } from "zod";

export const deductCreditsSchema = z.object({
  action: z.string().min(2, "Action name required"),
  cost: z.number().int().positive("Cost must be a positive integer").default(2),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const purchaseCreditsSchema = z.object({
  packId: z.enum(["pack_starter_50", "pack_pro_250", "pack_agency_1000"]),
  gateway: z.enum(["STRIPE", "BKASH", "SSLCOMMERZ", "PAYPAL", "MANUAL_BANK"]).default("STRIPE"),
});

export type DeductCreditsInput = z.infer<typeof deductCreditsSchema>;
export type PurchaseCreditsInput = z.infer<typeof purchaseCreditsSchema>;
