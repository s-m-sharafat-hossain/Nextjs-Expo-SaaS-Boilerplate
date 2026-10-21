// apps/web/src/app/api/v1/disputes/route.ts
import { ReviewsController } from "@/features/reviews-disputes/reviews.controller";

export const GET = ReviewsController.listDisputes;
export const POST = ReviewsController.fileDispute;
