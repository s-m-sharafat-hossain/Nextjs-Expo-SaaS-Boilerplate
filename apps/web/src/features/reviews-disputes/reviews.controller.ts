// apps/web/src/features/reviews-disputes/reviews.controller.ts
import { NextRequest } from "next/server";
import { ReviewsService } from "./reviews.service";
import { ReviewsRepository } from "./reviews.repository";
import { submitReviewSchema, fileDisputeSchema, resolveDisputeSchema } from "./reviews.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class ReviewsController {
  static submitReview = asyncHandler(async (req: NextRequest) => {
    const consumerId = req.headers.get("x-user-id");
    if (!consumerId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = submitReviewSchema.parse(body);
    const review = await ReviewsService.submitReview(consumerId, validated);
    return ApiResponse.success(review, "Review submitted successfully", 201);
  });

  static getProviderReviews = asyncHandler(async (req: NextRequest) => {
    const providerId = req.nextUrl.searchParams.get("providerId");
    if (!providerId) return ApiResponse.error("providerId query param required", 400);

    const reviews = await ReviewsRepository.getProviderReviews(providerId);
    return ApiResponse.success(reviews, "Provider reviews retrieved");
  });

  static fileDispute = asyncHandler(async (req: NextRequest) => {
    const consumerId = req.headers.get("x-user-id");
    if (!consumerId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = fileDisputeSchema.parse(body);
    const dispute = await ReviewsService.fileDispute(consumerId, validated);
    return ApiResponse.success(dispute, "Dispute filed and queued for admin review", 201);
  });

  static listDisputes = asyncHandler(async () => {
    const disputes = await ReviewsRepository.listAllDisputes();
    return ApiResponse.success(disputes, "Dispute records retrieved");
  });

  static resolveDispute = asyncHandler(async (req: NextRequest) => {
    const adminId = req.headers.get("x-user-id") || "admin";
    const body = await req.json();
    const validated = resolveDisputeSchema.parse(body);
    const result = await ReviewsService.resolveDispute(adminId, validated);
    return ApiResponse.success(result, "Dispute resolution processed");
  });
}
