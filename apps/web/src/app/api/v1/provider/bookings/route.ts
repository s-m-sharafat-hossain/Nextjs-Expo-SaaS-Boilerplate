// apps/web/src/app/api/v1/provider/bookings/route.ts
import { NextRequest } from "next/server";
import { ProviderController } from "@/features/portals/provider-portal/provider.controller";

export async function GET(req: NextRequest) {
  return ProviderController.getBookings(req);
}

export async function PATCH(req: NextRequest) {
  return ProviderController.updateBookingStatus(req);
}
