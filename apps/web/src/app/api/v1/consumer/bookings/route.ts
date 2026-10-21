// apps/web/src/app/api/v1/consumer/bookings/route.ts
import { NextRequest } from "next/server";
import { ConsumerController } from "@/features/portals/consumer-portal/consumer.controller";

export async function GET(req: NextRequest) {
  return ConsumerController.getBookings(req);
}

export async function POST(req: NextRequest) {
  return ConsumerController.createBooking(req);
}

export async function PATCH(req: NextRequest) {
  return ConsumerController.cancelBooking(req);
}
