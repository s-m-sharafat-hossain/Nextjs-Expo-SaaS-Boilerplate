// apps/web/src/app/api/v1/billing/manual-trx/route.ts
import { BillingController } from "@/features/billing/billing.controller";

export const POST = BillingController.submitManualTrx;
