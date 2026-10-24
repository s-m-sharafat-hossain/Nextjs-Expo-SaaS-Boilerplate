// apps/web/src/app/api/v1/billing/tax/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { TaxService } from "@/features/billing/tax.service";
import { z } from "zod";

const taxSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("USD"),
  countryCode: z.string().length(2),
  stateOrProvince: z.string().optional(),
  postalCode: z.string().optional(),
});

/**
 * POST /api/v1/billing/tax - Preview tax calculations for checkout
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = taxSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.errors[0]?.message || "Invalid payload", 400);
    }

    const result = await TaxService.calculateTax(parsed.data);
    return ApiResponse.success(result, "Tax calculation computed");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to calculate tax", 500);
  }
}
