// apps/web/src/features/workspaces/workspaces.controller.ts
import { NextRequest } from "next/server";
import { WorkspacesService } from "./workspaces.service";
import { createWorkspaceSchema, inviteMemberSchema } from "./workspaces.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { asyncHandler } from "@/shared/utils/error-handler";

export class WorkspacesController {
  static index = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const workspaces = await WorkspacesService.listUserWorkspaces(userId);
    return ApiResponse.success(workspaces, "Workspaces retrieved successfully");
  });

  static store = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = createWorkspaceSchema.parse(body);
    const workspace = await WorkspacesService.create(userId, validated);
    return ApiResponse.success(workspace, "Workspace created successfully", 201);
  });

  static invite = asyncHandler(async (req: NextRequest) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) return ApiResponse.error("Unauthorized", 401);

    const body = await req.json();
    const validated = inviteMemberSchema.parse(body);
    const member = await WorkspacesService.inviteMember(userId, validated);
    return ApiResponse.success(member, "Member invited successfully");
  });
}
