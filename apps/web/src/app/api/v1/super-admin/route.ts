// apps/web/src/app/api/v1/super-admin/route.ts
import { NextRequest } from "next/server";
import { SuperAdminController } from "@/features/portals/super-admin-portal/super-admin.controller";

export async function GET(req: NextRequest) {
  return SuperAdminController.getDashboard(req);
}

export async function POST(req: NextRequest) {
  return SuperAdminController.handleAction(req);
}
