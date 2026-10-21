// apps/web/src/features/credits/credits.controller.ts
import { NextRequest } from "next/server";
import { CreditsService } from "./credits.service";
import { deductCreditsSchema } from "./credits.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class CreditsController {
  static getBalance = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const data = await CreditsService.getBalance(userId);
    return ApiResponse.success(data, "Credit balance retrieved");
  });

  static deduct = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = deductCreditsSchema.parse(body);
    const result = await CreditsService.assertAndDeduct(userId, validated);
    return ApiResponse.success(result, "Credits deducted successfully");
  });
}
