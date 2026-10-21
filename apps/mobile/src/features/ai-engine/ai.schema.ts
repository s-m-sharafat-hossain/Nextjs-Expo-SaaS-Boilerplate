import { z } from "zod";

export const AiModelEnum = z.enum([
  "gpt-4o",
  "claude-3-5-sonnet",
  "gemini-1-5-pro",
]);

export type AiModelType = z.infer<typeof AiModelEnum>;

export const AiTaskEnum = z.enum([
  "CONSULTATION_ASSISTANT",
  "DOCUMENT_SUMMARIZER",
  "CLINICAL_CODE_MATCHER",
  "MARKETPLACE_COPY",
  "GENERAL_CHAT",
]);

export type AiTaskType = z.infer<typeof AiTaskEnum>;

export const GenerateAiContentSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters"),
  model: AiModelEnum.default("gpt-4o"),
  task: AiTaskEnum.default("GENERAL_CHAT"),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().default(1000),
});

export type GenerateAiContentInput = z.infer<typeof GenerateAiContentSchema>;

export const AiGenerationResultSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  output: z.string(),
  model: AiModelEnum,
  task: AiTaskEnum,
  creditsUsed: z.number(),
  createdAt: z.string(),
});

export type AiGenerationResult = z.infer<typeof AiGenerationResultSchema>;
