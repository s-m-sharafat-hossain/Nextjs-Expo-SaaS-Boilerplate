// apps/web/src/features/billing/billing.controller.ts
import { NextRequest } from "next/server";
import { BillingService } from "./billing.service";
import { BillingRepository } from "./billing.repository";
import { checkoutSessionSchema, manualPaymentSchema } from "./billing.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class BillingController {
  static checkout = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") || "demo-user";
    const body = await req.json();
    const validated = checkoutSessionSchema.parse(body);
    const result = await BillingService.createCheckoutSession(userId, validated);
    return ApiResponse.success(result, "Checkout session initialized", 200);
  });

  static submitManualTrx = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id") || "demo-user";
    const body = await req.json();
    const validated = manualPaymentSchema.parse(body);
    const result = await BillingService.submitManualTransaction(userId, validated);
    return ApiResponse.success(result, "Transaction ID submitted for verification");
  });

  static listTransactions = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const txs = await BillingRepository.getUserTransactions(userId);
    return ApiResponse.success(txs, "Billing transactions retrieved");
  });

  static stripeWebhook = asyncHandler(async (req: NextRequest) => {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return ApiResponse.error("Missing stripe-signature header", 400);
    }

    const rawBody = await req.text();
    const result = await BillingService.handleStripeWebhook(rawBody, signature);
    return ApiResponse.success(result, "Webhook processed successfully");
  });
}
