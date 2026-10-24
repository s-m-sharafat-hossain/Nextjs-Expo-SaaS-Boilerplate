// apps/web/src/app/api/v1/super-admin/users/route.ts
import { NextRequest } from "next/server";
import { SuperAdminController } from "@/features/portals/super-admin-portal/super-admin.controller";

export async function GET(req: NextRequest) {
  return SuperAdminController.searchUsers(req);
}
