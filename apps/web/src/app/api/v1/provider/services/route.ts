// apps/web/src/app/api/v1/provider/services/route.ts
import { NextRequest } from "next/server";
import { ProviderController } from "@/features/portals/provider-portal/provider.controller";

export async function GET(req: NextRequest) {
  return ProviderController.getServices(req);
}

export async function POST(req: NextRequest) {
  return ProviderController.createService(req);
}

export async function PATCH(req: NextRequest) {
  return ProviderController.updateService(req);
}

export async function DELETE(req: NextRequest) {
  return ProviderController.deleteService(req);
}
