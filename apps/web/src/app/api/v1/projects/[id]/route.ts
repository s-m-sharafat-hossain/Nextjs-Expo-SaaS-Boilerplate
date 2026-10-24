// apps/web/src/app/api/v1/projects/[id]/route.ts
import { NextRequest } from "next/server";
import { ProjectsController } from "@/features/projects/projects.controller";
import { auth } from "@/shared/lib/auth";
import { ApiResponse } from "@/shared/utils/api-response";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, props: RouteProps) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { id } = await props.params;
  return ProjectsController.getProject(id);
}

export async function PUT(req: NextRequest, props: RouteProps) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { id } = await props.params;
  return ProjectsController.updateProject(id, req);
}

export async function DELETE(req: NextRequest, props: RouteProps) {
  const session = await auth();
  if (!session?.user?.id) return ApiResponse.error("Unauthorized", 401);

  const { id } = await props.params;
  return ProjectsController.deleteProject(id);
}
