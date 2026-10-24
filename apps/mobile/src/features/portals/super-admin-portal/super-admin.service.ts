// apps/mobile/src/features/portals/super-admin-portal/super-admin.service.ts
import { ApiClient } from "@/shared/lib/api-client";

export interface SuperAdminDashboardData {
  stats: {
    totalUsers: number;
    superAdminsCount: number;
    adminsCount: number;
    providersCount: number;
    consumersCount: number;
    totalWorkspaces: number;
    activeSessionsCount: number;
    totalAuditLogs: number;
    grossVolume: number;
    estimatedPlatformFees: number;
    completedTransactionsCount: number;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
  };
  settings: {
    id: string;
    platformName: string;
    maintenanceMode: boolean;
    maintenanceMessage: string | null;
    registrationEnabled: boolean;
    defaultPlan: string;
    maxFreeCredits: number;
    platformFeePercent: number;
    minPayoutAmount: number;
    kycRequired: boolean;
    termsRequired: boolean;
  };
  admins: Array<{
    id: string;
    name: string;
    email: string;
    role: "SUPER_ADMIN" | "ADMIN";
    plan: string;
    credits: number;
    isActive: boolean;
    isBanned: boolean;
    createdAt: string;
  }>;
  recentLogs: Array<{
    id: string;
    action: string;
    entity: string;
    createdAt: string;
    user?: { name: string; email: string };
  }>;
}

export class SuperAdminMobileService {
  /**
   * Fetch aggregate governance dashboard data
   */
  static async getDashboard() {
    return ApiClient.get<SuperAdminDashboardData>("/super-admin");
  }

  /**
   * Fetch platform statistics: GET /api/v1/super-admin?action=stats
   */
  static async getStats() {
    return ApiClient.get<SuperAdminDashboardData["stats"]>("/super-admin?action=stats");
  }

  /**
   * Fetch platform global settings: GET /api/v1/super-admin?action=settings
   */
  static async getSettings() {
    return ApiClient.get<SuperAdminDashboardData["settings"]>("/super-admin?action=settings");
  }

  /**
   * Fetch administrators directory: GET /api/v1/super-admin?action=admins
   */
  static async getAdmins() {
    return ApiClient.get<SuperAdminDashboardData["admins"]>("/super-admin?action=admins");
  }

  /**
   * Update platform global parameters: POST /api/v1/super-admin
   */
  static async updateSettings(data: Partial<SuperAdminDashboardData["settings"]>) {
    return ApiClient.post<any>("/super-admin", {
      action: "UPDATE_SETTINGS",
      data,
    });
  }

  /**
   * Execute admin management action (ACTIVATE, DEACTIVATE, DELETE, RESET_PASSWORD, SUSPEND, etc.)
   */
  static async manageAdmin(
    targetUserId: string,
    action: "ACTIVATE" | "DEACTIVATE" | "DELETE" | "RESET_PASSWORD" | "SUSPEND" | "ADJUST_CREDITS" | string,
    options?: { creditsDelta?: number; reason?: string; newPassword?: string }
  ) {
    return ApiClient.post<any>("/super-admin", {
      action,
      targetUserId,
      reason: options?.reason || "Executed from Mobile Super Admin Portal",
      newPassword: options?.newPassword,
      creditsDelta: options?.creditsDelta,
    });
  }

  /**
   * Promote user to role: POST /api/v1/super-admin
   */
  static async promoteUser(userId: string, role: string, reason?: string) {
    return ApiClient.post<any>("/super-admin", {
      action: "PROMOTE_USER",
      data: {
        userId,
        role,
        reason: reason || "Role elevation via Mobile Super Admin Console",
      },
    });
  }
}
