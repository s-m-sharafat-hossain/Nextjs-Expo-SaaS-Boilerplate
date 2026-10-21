// apps/web/src/features/workspaces/workspaces.service.ts
import { WorkspacesRepository } from "./workspaces.repository";
import { CreateWorkspaceInput, InviteMemberInput, UpdateMemberRoleInput } from "./workspaces.schema";
import { WorkspaceRole } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { prisma } from "@/shared/lib/db";

export class WorkspacesService {
  static async listUserWorkspaces(userId: string) {
    return WorkspacesRepository.getUserWorkspaces(userId);
  }

  static async getWorkspace(workspaceId: string, userId: string) {
    const workspace = await WorkspacesRepository.getWorkspaceById(workspaceId, userId);
    if (!workspace) {
      throw new AppError("Workspace not found or unauthorized", 404);
    }
    return workspace;
  }

  static async create(userId: string, data: CreateWorkspaceInput) {
    const slugBase =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    let uniqueSlug = slugBase;
    let counter = 1;

    while (await prisma.workspace.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slugBase}-${counter}`;
      counter++;
    }

    return WorkspacesRepository.createWorkspace(userId, data, uniqueSlug);
  }

  static async inviteMember(callerUserId: string, input: InviteMemberInput) {
    const workspace = await this.getWorkspace(input.workspaceId, callerUserId);

    if (workspace.myRole !== "OWNER" && workspace.myRole !== "ADMIN") {
      throw new AppError("Only workspace owners or admins can invite new members", 403);
    }

    // Find user by email
    let targetUser = await prisma.user.findUnique({ where: { email: input.email } });
    if (!targetUser) {
      // Auto-provision invited user
      targetUser = await prisma.user.create({
        data: {
          email: input.email,
          name: input.email.split("@")[0],
          credits: 10,
        },
      });
    }

    return WorkspacesRepository.addMember(
      input.workspaceId,
      targetUser.id,
      input.role as WorkspaceRole
    );
  }

  static async updateMemberRole(callerUserId: string, input: UpdateMemberRoleInput) {
    const workspace = await this.getWorkspace(input.workspaceId, callerUserId);
    if (workspace.myRole !== "OWNER") {
      throw new AppError("Only the workspace owner can modify team roles", 403);
    }

    return WorkspacesRepository.updateMemberRole(
      input.workspaceId,
      input.userId,
      input.role as WorkspaceRole
    );
  }

  static async removeMember(callerUserId: string, workspaceId: string, targetUserId: string) {
    const workspace = await this.getWorkspace(workspaceId, callerUserId);
    if (workspace.myRole !== "OWNER" && workspace.myRole !== "ADMIN") {
      throw new AppError("Insufficient permissions to remove team member", 403);
    }

    if (callerUserId === targetUserId) {
      throw new AppError("You cannot remove yourself from your own workspace", 400);
    }

    return WorkspacesRepository.removeMember(workspaceId, targetUserId);
  }
}
