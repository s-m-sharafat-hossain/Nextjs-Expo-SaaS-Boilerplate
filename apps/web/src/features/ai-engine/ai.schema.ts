// apps/web/src/features/ai-engine/ai.schema.ts
import { z } from "zod";

export const generateAiSchema = z.object({
  toolType: z.enum([
    "CLINICAL_TRIAGE",
    "SYMPTOM_CHECKER",
    "APPOINTMENT_SUMMARY",
    "MARKETPLACE_COPYWRITER",
    "CODE_ASSISTANT",
  ]),
  prompt: z.string().min(3, "Prompt must be at least 3 characters").max(4000),
  temperature: z.number().min(0).max(1).default(0.7),
});

export type GenerateAiInput = z.infer<typeof generateAiSchema>;
