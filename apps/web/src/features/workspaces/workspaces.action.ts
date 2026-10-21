// apps/web/src/features/workspaces/workspaces.action.ts
"use server";

import { WorkspacesService } from "./workspaces.service";
import { createWorkspaceSchema, inviteMemberSchema, CreateWorkspaceInput, InviteMemberInput } from "./workspaces.schema";
import { revalidatePath } from "next/cache";

export async function createWorkspaceAction(userId: string, input: CreateWorkspaceInput) {
  try {
    const validated = createWorkspaceSchema.parse(input);
    const workspace = await WorkspacesService.create(userId, validated);
    revalidatePath("/dashboard");
    return { success: true, data: workspace };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create workspace" };
  }
}

export async function inviteMemberAction(callerUserId: string, input: InviteMemberInput) {
  try {
    const validated = inviteMemberSchema.parse(input);
    const member = await WorkspacesService.inviteMember(callerUserId, validated);
    revalidatePath("/dashboard");
    return { success: true, data: member };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to invite member" };
  }
}
