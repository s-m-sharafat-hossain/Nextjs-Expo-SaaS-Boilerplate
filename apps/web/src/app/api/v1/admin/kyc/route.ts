// apps/web/src/app/api/v1/admin/kyc/route.ts
import { NextRequest } from "next/server";
import { AdminController } from "@/features/portals/admin-portal/admin.controller";

export async function GET(req: NextRequest) {
  return AdminController.getKycs(req);
}

export async function POST(req: NextRequest) {
  return AdminController.reviewKyc(req);
}
