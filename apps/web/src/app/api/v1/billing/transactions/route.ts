// apps/web/src/app/api/v1/billing/transactions/route.ts
import { BillingController } from "@/features/billing/billing.controller";

export const GET = BillingController.listTransactions;
