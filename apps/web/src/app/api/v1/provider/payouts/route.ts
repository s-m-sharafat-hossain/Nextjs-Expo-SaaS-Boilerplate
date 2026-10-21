// apps/web/src/app/api/v1/provider/payouts/route.ts
import { NextRequest } from "next/server";
import { ProviderController } from "@/features/portals/provider-portal/provider.controller";

export async function GET(req: NextRequest) {
  return ProviderController.getWallet(req);
}

export async function POST(req: NextRequest) {
  return ProviderController.requestPayout(req);
}
