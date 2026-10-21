// apps/web/src/features/workspaces/workspaces.schema.ts
import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and dashes").optional(),
  logoUrl: z.string().url().optional(),
});

export const inviteMemberSchema = z.object({
  workspaceId: z.string().cuid(),
  email: z.string().email("Invalid email address"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
});

export const updateMemberRoleSchema = z.object({
  workspaceId: z.string().cuid(),
  userId: z.string().cuid(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER", "VIEWER"]),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
