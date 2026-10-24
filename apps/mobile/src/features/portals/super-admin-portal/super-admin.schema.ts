// apps/mobile/src/features/portals/super-admin-portal/super-admin.schema.ts
import { z } from "zod";

/**
 * Platform Global Settings Update Schema
 */
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

export type UpdatePlatformSettingsInput = z.infer<typeof updatePlatformSettingsSchema>;

/**
 * Admin Account Governance Schema
 * Supports ACTIVATE, DEACTIVATE, DELETE, and RESET_PASSWORD
 */
export const manageAdminSchema = z.object({
  targetUserId: z.string().min(1, "Target User ID is required"),
  action: z.enum([
    "ACTIVATE",
    "DEACTIVATE",
    "DELETE",
    "RESET_PASSWORD",
    "ADJUST_CREDITS",
    "PROMOTE_TO_ADMIN",
    "PROMOTE_TO_SUPER_ADMIN",
    "DEMOTE_TO_USER",
    "SUSPEND",
  ]),
  reason: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  creditsDelta: z.number().optional(),
});

export type ManageAdminInput = z.infer<typeof manageAdminSchema>;

/**
 * Promote User Role Schema
 */
export const promoteToAdminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "PROVIDER", "CONSUMER"]),
  reason: z.string().optional(),
});

export type PromoteToAdminInput = z.infer<typeof promoteToAdminSchema>;

/**
 * Platform Aggregate Stats Schema
 */
export const superAdminStatsSchema = z.object({
  totalUsers: z.number(),
  superAdminsCount: z.number(),
  adminsCount: z.number(),
  providersCount: z.number(),
  consumersCount: z.number(),
  totalWorkspaces: z.number(),
  activeSessionsCount: z.number(),
  totalAuditLogs: z.number(),
  grossVolume: z.number(),
  estimatedPlatformFees: z.number(),
  completedTransactionsCount: z.number(),
  maintenanceMode: z.boolean(),
  registrationEnabled: z.boolean(),
});

export type SuperAdminStats = z.infer<typeof superAdminStatsSchema>;

/**
 * Admin User Item Schema
 */
export const adminUserItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "PROVIDER", "CONSUMER"]),
  plan: z.string().optional(),
  credits: z.number(),
  isActive: z.boolean(),
  isBanned: z.boolean(),
  createdAt: z.string(),
});

export type AdminUserItem = z.infer<typeof adminUserItemSchema>;
