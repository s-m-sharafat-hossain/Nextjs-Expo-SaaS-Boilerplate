// apps/web/src/features/ai-engine/ai.action.ts
"use server";

import { AiService } from "./ai.service";
import { generateAiSchema, GenerateAiInput } from "./ai.schema";
import { revalidatePath } from "next/cache";

export async function generateAiAction(userId: string, input: GenerateAiInput) {
  try {
    const validated = generateAiSchema.parse(input);
    const result = await AiService.generate(userId, validated);
    revalidatePath("/consumer/chat");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "AI generation failed" };
  }
}
