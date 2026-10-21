// apps/web/src/app/api/v1/provider/stats/route.ts
import { NextRequest } from "next/server";
import { ProviderController } from "@/features/portals/provider-portal/provider.controller";

export async function GET(req: NextRequest) {
  return ProviderController.getStats(req);
}
