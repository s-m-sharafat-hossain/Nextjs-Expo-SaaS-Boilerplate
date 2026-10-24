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
  static async getDashboard() {
    return ApiClient.get<SuperAdminDashboardData>("/super-admin");
  }

  static async updateSettings(data: Partial<SuperAdminDashboardData["settings"]>) {
    return ApiClient.post<any>("/super-admin", {
      action: "UPDATE_SETTINGS",
      data,
    });
  }

  static async manageAdmin(targetUserId: string, action: string, creditsDelta?: number) {
    return ApiClient.post<any>("/super-admin", {
      action: "MANAGE_ADMIN",
      data: {
        targetUserId,
        action,
        creditsDelta,
        reason: "Executed from Mobile Super Admin Portal",
      },
    });
  }
}
