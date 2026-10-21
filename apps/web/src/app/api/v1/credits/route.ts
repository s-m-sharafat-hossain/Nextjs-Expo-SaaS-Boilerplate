// apps/web/src/app/api/v1/credits/route.ts
import { CreditsController } from "@/features/credits/credits.controller";

export const GET = CreditsController.getBalance;
export const POST = CreditsController.deduct;
