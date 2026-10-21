// apps/web/src/features/reviews-disputes/reviews.action.ts
"use server";

import { ReviewsService } from "./reviews.service";
import { submitReviewSchema, providerReplySchema, fileDisputeSchema, resolveDisputeSchema, SubmitReviewInput, ProviderReplyInput, FileDisputeInput, ResolveDisputeInput } from "./reviews.schema";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(consumerId: string, input: SubmitReviewInput) {
  try {
    const validated = submitReviewSchema.parse(input);
    const review = await ReviewsService.submitReview(consumerId, validated);
    revalidatePath("/consumer");
    return { success: true, data: review };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit review" };
  }
}

export async function fileDisputeAction(consumerId: string, input: FileDisputeInput) {
  try {
    const validated = fileDisputeSchema.parse(input);
    const dispute = await ReviewsService.fileDispute(consumerId, validated);
    revalidatePath("/consumer");
    return { success: true, data: dispute };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit dispute" };
  }
}
