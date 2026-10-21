// apps/web/src/features/workspaces/workspaces.repository.ts
import { prisma } from "@/shared/lib/db";
import { WorkspaceRole } from "@prisma/client";
import { CreateWorkspaceInput } from "./workspaces.schema";

export class WorkspacesRepository {
  static async getUserWorkspaces(userId: string) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true, role: true },
                },
              },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.workspace,
      myRole: m.role,
    }));
  }

  static async getWorkspaceById(workspaceId: string, userId: string) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      include: {
        workspace: {
          include: {
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true, role: true },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) return null;

    return {
      ...membership.workspace,
      myRole: membership.role,
    };
  }

  static async createWorkspace(userId: string, data: CreateWorkspaceInput, slug: string) {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: data.name,
          slug,
          logoUrl: data.logoUrl,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: WorkspaceRole.OWNER,
        },
      });

      return workspace;
    });
  }

  static async addMember(workspaceId: string, targetUserId: string, role: WorkspaceRole) {
    return prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: { workspaceId, userId: targetUserId },
      },
      update: { role },
      create: {
        workspaceId,
        userId: targetUserId,
        role,
      },
    });
  }

  static async updateMemberRole(workspaceId: string, targetUserId: string, role: WorkspaceRole) {
    return prisma.workspaceMember.update({
      where: {
        workspaceId_userId: { workspaceId, userId: targetUserId },
      },
      data: { role },
    });
  }

  static async removeMember(workspaceId: string, targetUserId: string) {
    return prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: { workspaceId, userId: targetUserId },
      },
    });
  }
}
