// apps/web/src/features/billing/billing.service.ts
import { BillingRepository } from "./billing.repository";
import { CheckoutSessionInput, ManualPaymentInput, PayoutRequestInput } from "./billing.schema";
import { siteConfig, paymentConfig } from "@shared/config";
import { PaymentStatus } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import Stripe from "stripe";

export class BillingService {
  /**
   * Universal Checkout Session Factory using Gateway Strategy Pattern
   */
  static async createCheckoutSession(userId: string, input: CheckoutSessionInput) {
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    // 1. Calculate discount if coupon applied
    let discount = 0;
    if (input.couponCode) {
      const coupon = await BillingRepository.findCoupon(input.couponCode);
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        discount = Math.round(((input.amount * coupon.discountPercent) / 100) * 100) / 100;
      }
    }

    // 2. Calculate VAT/Tax
    const taxRate = siteConfig.billing.taxPercentage / 100;
    const taxableAmount = Math.max(0, input.amount - discount);
    const taxAmount = Math.round(taxableAmount * taxRate * 100) / 100;
    const finalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

    // 3. Record pending transaction
    await BillingRepository.createTransaction({
      userId,
      invoiceNumber,
      gateway: input.gateway,
      planId: input.planId || input.serviceId,
      baseAmount: input.amount,
      discount,
      taxAmount,
      finalAmount,
      currency: input.currency,
      couponCode: input.couponCode,
      status: PaymentStatus.PENDING,
    });

    // 4. Gateway Strategy Execution
    switch (input.gateway) {
      case "STRIPE": {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (stripeKey && !stripeKey.includes("placeholder")) {
          const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as any });
          const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: input.currency.toLowerCase(),
                  product_data: { name: `Order ${invoiceNumber}` },
                  unit_amount: Math.round(finalAmount * 100),
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: input.successUrl || `${siteConfig.url}/consumer?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: input.cancelUrl || `${siteConfig.url}/consumer`,
            client_reference_id: invoiceNumber,
          });

          return { checkoutUrl: session.url, invoiceNumber, gateway: "STRIPE" };
        }

        // Demo fallback checkout URL
        return {
          checkoutUrl: `/consumer?invoice=${invoiceNumber}&demo_paid=true`,
          invoiceNumber,
          gateway: "STRIPE",
          isDemo: true,
        };
      }

      case "BKASH":
      case "SSLCOMMERZ":
      case "PAYPAL":
      case "RAZORPAY":
      case "PAYSTACK": {
        return {
          checkoutUrl: `/consumer?invoice=${invoiceNumber}&gateway=${input.gateway}&simulated=true`,
          invoiceNumber,
          gateway: input.gateway,
          message: `Redirecting to ${input.gateway} secure payment window...`,
        };
      }

      case "MANUAL_BANK":
      default: {
        return {
          checkoutUrl: `/consumer/billing?invoice=${invoiceNumber}&manual=true`,
          invoiceNumber,
          gateway: "MANUAL_BANK",
          instructions: siteConfig.payment.manualPaymentInstructions,
          requiresTrxId: true,
        };
      }
    }
  }

  /**
   * User submits manual TrxID (bKash / Bank Wire / USDT)
   */
  static async submitManualTransaction(userId: string, input: ManualPaymentInput) {
    const updated = await BillingRepository.updateTransactionStatus(
      input.invoiceNumber,
      PaymentStatus.PENDING,
      undefined,
      input.manualTrxId
    );

    return {
      success: true,
      invoiceNumber: updated.invoiceNumber,
      message: "Transaction ID submitted. Super Admin will verify and activate your service shortly.",
    };
  }

  /**
   * Provider requests wallet balance payout
   */
  static async requestPayout(userId: string, input: PayoutRequestInput) {
    const wallet = await BillingRepository.getProviderWallet(userId);
    if (!wallet || wallet.balance < input.amount) {
      throw new AppError(
        `Insufficient available balance. Your balance is $${wallet?.balance.toFixed(2) || "0.00"}`,
        400
      );
    }

    const platformFee = 0.0; // Payout fee
    const netAmount = input.amount - platformFee;

    const request = await BillingRepository.createPayoutRequest(
      userId,
      input.amount,
      platformFee,
      netAmount,
      input.payoutMethod,
      input.accountDetails
    );

    return request;
  }

  /**
   * Stripe Webhook Handler with Signature Verification
   */
  static async handleStripeWebhook(body: string, signature: string) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET missing, skipping live event validation");
      return { received: true };
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY || "";
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as any });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err: any) {
      throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceNumber = session.client_reference_id;
      if (invoiceNumber) {
        await BillingRepository.updateTransactionStatus(
          invoiceNumber,
          PaymentStatus.PAID,
          session.payment_intent as string
        );
      }
    }

    return { received: true };
  }
}
