// apps/web/src/app/api/v1/reviews/route.ts
import { ReviewsController } from "@/features/reviews-disputes/reviews.controller";

export const GET = ReviewsController.getProviderReviews;
export const POST = ReviewsController.submitReview;
