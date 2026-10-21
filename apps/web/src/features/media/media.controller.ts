// apps/web/src/features/media/media.controller.ts
import { NextRequest } from "next/server";
import { MediaService } from "./media.service";
import { uploadMediaSchema } from "./media.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class MediaController {
  static index = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const files = await MediaService.list(userId);
    return ApiResponse.success(files, "Media files retrieved");
  });

  static store = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = uploadMediaSchema.parse(body);
    const saved = await MediaService.upload(userId, validated);
    return ApiResponse.success(saved, "Media uploaded successfully", 201);
  });
}
