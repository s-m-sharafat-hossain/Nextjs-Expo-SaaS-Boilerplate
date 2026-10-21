// apps/web/src/app/api/v1/webhooks/stripe/route.ts
import { BillingController } from "@/features/billing/billing.controller";

export const POST = BillingController.stripeWebhook;
