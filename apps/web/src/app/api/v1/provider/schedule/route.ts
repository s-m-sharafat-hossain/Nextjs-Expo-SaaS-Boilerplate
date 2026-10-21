// apps/web/src/app/api/v1/provider/schedule/route.ts
import { NextRequest } from "next/server";
import { ProviderController } from "@/features/portals/provider-portal/provider.controller";

export async function GET(req: NextRequest) {
  return ProviderController.getSlots(req);
}

export async function POST(req: NextRequest) {
  return ProviderController.setSlots(req);
}
