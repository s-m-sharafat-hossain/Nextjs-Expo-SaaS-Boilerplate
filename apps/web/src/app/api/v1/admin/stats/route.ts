// apps/web/src/app/api/v1/admin/stats/route.ts
import { NextRequest } from "next/server";
import { AdminController } from "@/features/portals/admin-portal/admin.controller";

export async function GET(req: NextRequest) {
  return AdminController.getStats(req);
}
