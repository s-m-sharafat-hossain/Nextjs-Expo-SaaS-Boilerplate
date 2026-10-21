// apps/web/src/features/ai-engine/ai.controller.ts
import { NextRequest } from "next/server";
import { AiService } from "./ai.service";
import { AiRepository } from "./ai.repository";
import { generateAiSchema } from "./ai.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class AiController {
  static generate = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = generateAiSchema.parse(body);
    const result = await AiService.generate(userId, validated);
    return ApiResponse.success(result, "AI output generated successfully", 200);
  });

  static history = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const data = await AiRepository.getHistory(userId);
    return ApiResponse.success(data, "AI generation history retrieved");
  });
}
