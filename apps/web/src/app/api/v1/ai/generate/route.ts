// apps/web/src/app/api/v1/ai/generate/route.ts
import { AiController } from "@/features/ai-engine/ai.controller";

export const POST = AiController.generate;
export const GET = AiController.history;
