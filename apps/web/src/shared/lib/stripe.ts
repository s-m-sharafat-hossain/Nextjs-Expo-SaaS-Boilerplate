// src/shared/lib/stripe.ts
// Stripe singleton helper — one import, everywhere
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "[Stripe] STRIPE_SECRET_KEY is not set. Billing features will run in Demo Mode."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-09-30.endive",
});

/**
 * Price IDs — map to your Stripe dashboard price IDs
 * Replace these with your actual Stripe Price IDs after creating products in Stripe dashboard
 */
export const STRIPE_PRICE_IDS = {
  STARTER_MONTHLY: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? "",
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  AGENCY_MONTHLY: process.env.STRIPE_PRICE_AGENCY_MONTHLY ?? "",
} as const;
