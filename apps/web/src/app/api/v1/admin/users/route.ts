// apps/web/src/app/api/v1/admin/users/route.ts
import { NextRequest } from "next/server";
import { AdminController } from "@/features/portals/admin-portal/admin.controller";

export async function GET(req: NextRequest) {
  return AdminController.getUsers(req);
}

export async function PATCH(req: NextRequest) {
  return AdminController.updateUser(req);
}
