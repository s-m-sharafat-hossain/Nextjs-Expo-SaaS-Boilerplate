// apps/web/src/features/credits/credits.action.ts
"use server";

import { CreditsService } from "./credits.service";
import { deductCreditsSchema, DeductCreditsInput } from "./credits.schema";
import { revalidatePath } from "next/cache";

export async function deductCreditsAction(userId: string, input: DeductCreditsInput) {
  try {
    const validated = deductCreditsSchema.parse(input);
    const result = await CreditsService.assertAndDeduct(userId, validated);
    revalidatePath("/consumer/credits");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to process credit deduction" };
  }
}
