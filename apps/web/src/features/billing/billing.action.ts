// apps/web/src/features/billing/billing.action.ts
"use server";

import { BillingService } from "./billing.service";
import { checkoutSessionSchema, manualPaymentSchema, payoutRequestSchema, CheckoutSessionInput, ManualPaymentInput, PayoutRequestInput } from "./billing.schema";
import { revalidatePath } from "next/cache";

export async function createCheckoutAction(userId: string, input: CheckoutSessionInput) {
  try {
    const validated = checkoutSessionSchema.parse(input);
    const result = await BillingService.createCheckoutSession(userId, validated);
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to initiate payment checkout" };
  }
}

export async function submitManualTrxAction(userId: string, input: ManualPaymentInput) {
  try {
    const validated = manualPaymentSchema.parse(input);
    const result = await BillingService.submitManualTransaction(userId, validated);
    revalidatePath("/consumer/billing");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit transaction reference" };
  }
}

export async function requestPayoutAction(userId: string, input: PayoutRequestInput) {
  try {
    const validated = payoutRequestSchema.parse(input);
    const result = await BillingService.requestPayout(userId, validated);
    revalidatePath("/provider/payouts");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Payout request failed" };
  }
}
