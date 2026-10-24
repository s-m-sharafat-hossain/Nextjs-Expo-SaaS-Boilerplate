// apps/web/src/app/api/v1/projects/route.ts
import { NextRequest } from "next/server";
import { ProjectsController } from "@/features/projects/projects.controller";
import { auth } from "@/shared/lib/auth";
import { ApiResponse } from "@/shared/utils/api-response";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }
  return ProjectsController.listProjects(req);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }
  return ProjectsController.createProject(req);
}
