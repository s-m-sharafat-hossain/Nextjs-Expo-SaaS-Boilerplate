// apps/web/src/app/api/v1/consumer/explore/route.ts
import { NextRequest } from "next/server";
import { ConsumerController } from "@/features/portals/consumer-portal/consumer.controller";

export async function GET(req: NextRequest) {
  return ConsumerController.getExploreServices(req);
}
