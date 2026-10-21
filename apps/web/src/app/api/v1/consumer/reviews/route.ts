// apps/web/src/app/api/v1/consumer/reviews/route.ts
import { NextRequest } from "next/server";
import { ConsumerController } from "@/features/portals/consumer-portal/consumer.controller";

export async function POST(req: NextRequest) {
  return ConsumerController.submitReview(req);
}
