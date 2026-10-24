// apps/web/src/features/portals/super-admin-portal/super-admin.schema.ts
import { z } from "zod";

export const updatePlatformSettingsSchema = z.object({
  platformName: z.string().min(1, "Platform name cannot be empty").optional(),
  maintenanceMode: z.boolean().optional(),
  maintenanceMessage: z.string().nullable().optional(),
  registrationEnabled: z.boolean().optional(),
  defaultPlan: z.enum(["FREE", "STARTER", "PRO", "AGENCY"]).optional(),
  maxFreeCredits: z.number().int().min(0).optional(),
  platformFeePercent: z.number().min(0).max(100).optional(),
  minPayoutAmount: z.number().min(0).optional(),
  kycRequired: z.boolean().optional(),
  termsRequired: z.boolean().optional(),
});

export const manageAdminSchema = z.object({
  targetUserId: z.string().min(1, "Target User ID is required"),
  action: z.enum([
    "ACTIVATE",
    "DEACTIVATE",
    "DELETE",
    "RESET_PASSWORD",
    "PROMOTE_TO_ADMIN",
    "PROMOTE_TO_SUPER_ADMIN",
    "DEMOTE_TO_USER",
    "SUSPEND",
    "ADJUST_CREDITS",
  ]),
  creditsDelta: z.number().optional(),
  reason: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export const promoteToAdminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "PROVIDER", "CONSUMER"]),
  reason: z.string().optional(),
});

export const superAdminFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "PROVIDER", "CONSUMER"]).optional(),
});

export type UpdatePlatformSettingsInput = z.infer<typeof updatePlatformSettingsSchema>;
export type ManageAdminInput = z.infer<typeof manageAdminSchema>;
export type PromoteToAdminInput = z.infer<typeof promoteToAdminSchema>;
export type SuperAdminFilterInput = z.infer<typeof superAdminFilterSchema>;
