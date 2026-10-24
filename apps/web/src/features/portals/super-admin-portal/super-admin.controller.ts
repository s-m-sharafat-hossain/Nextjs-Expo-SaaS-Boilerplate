// apps/web/src/features/portals/super-admin-portal/super-admin.controller.ts
import { NextRequest } from "next/server";
import { auth } from "@/shared/lib/auth";
import { Role } from "@prisma/client";
import { SuperAdminService, SuperAdminContext } from "./super-admin.service";
import {
  updatePlatformSettingsSchema,
  manageAdminSchema,
  promoteToAdminSchema,
  superAdminFilterSchema,
} from "./super-admin.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { handleApiError, AppError } from "@/shared/utils/error-handler";

export class SuperAdminController {
  private static async getVerifiedSuperAdminContext(req: NextRequest): Promise<SuperAdminContext> {
    const session = await auth();

    if (!session || !session.user) {
      throw new AppError("Authentication required", 401);
    }

    if (session.user.role !== Role.SUPER_ADMIN) {
      throw new AppError("Security Violation: Super Admin privileges required.", 403);
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    return {
      operatorId: session.user.id,
      operatorEmail: session.user.email,
      ipAddress,
      userAgent,
    };
  }

  /**
   * GET /api/v1/super-admin
   * Fetch aggregate governance dashboard data or specific dataset (?action=stats|settings|admins)
   */
  static async getDashboard(req: NextRequest) {
    try {
      await this.getVerifiedSuperAdminContext(req);
      const { searchParams } = new URL(req.url);
      const action = searchParams.get("action");

      if (action === "stats") {
        const stats = await SuperAdminService.getPlatformStats();
        return ApiResponse.success(stats, "Platform stats retrieved");
      }

      if (action === "settings") {
        const settings = await SuperAdminService.getPlatformSettings();
        return ApiResponse.success(settings, "Platform settings retrieved");
      }

      if (action === "admins") {
        const admins = await SuperAdminService.getAllAdmins();
        return ApiResponse.success(admins, "Admins directory retrieved");
      }

      const [stats, settings, admins, recentLogs] = await Promise.all([
        SuperAdminService.getPlatformStats(),
        SuperAdminService.getPlatformSettings(),
        SuperAdminService.getAllAdmins(),
        SuperAdminService.getAuditLogs(30),
      ]);

      return ApiResponse.success({
        stats,
        settings,
        admins,
        recentLogs,
      });
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * POST /api/v1/super-admin
   * Main action dispatcher for Super Admin actions
   */
  static async handleAction(req: NextRequest) {
    try {
      const context = await this.getVerifiedSuperAdminContext(req);
      const body = await req.json();

      const action = body.action;

      // Handle direct actions from mobile (e.g. { action: "ACTIVATE", targetUserId: "..." })
      if (
        [
          "ACTIVATE",
          "DEACTIVATE",
          "DELETE",
          "RESET_PASSWORD",
          "SUSPEND",
          "ADJUST_CREDITS",
          "PROMOTE_TO_ADMIN",
          "PROMOTE_TO_SUPER_ADMIN",
          "DEMOTE_TO_USER",
        ].includes(action)
      ) {
        const payload = body.data || body;
        const validated = manageAdminSchema.parse({
          targetUserId: payload.targetUserId,
          action,
          reason: payload.reason,
          newPassword: payload.newPassword,
          creditsDelta: payload.creditsDelta,
        });
        const result = await SuperAdminService.manageAdmin(validated, context);
        return ApiResponse.success(result, `Action ${validated.action} executed successfully`);
      }

      switch (action) {
        case "UPDATE_SETTINGS": {
          const validated = updatePlatformSettingsSchema.parse(body.data || body);
          const updated = await SuperAdminService.updatePlatformSettings(validated, context);
          return ApiResponse.success(updated, "Platform settings updated successfully");
        }

        case "MANAGE_ADMIN": {
          const validated = manageAdminSchema.parse(body.data || body);
          const result = await SuperAdminService.manageAdmin(validated, context);
          return ApiResponse.success(result, `Action ${validated.action} executed successfully`);
        }

        case "PROMOTE_USER": {
          const validated = promoteToAdminSchema.parse(body.data || body);
          const result = await SuperAdminService.promoteUser(validated, context);
          return ApiResponse.success(result, `User role changed to ${validated.role} successfully`);
        }

        default:
          throw new AppError(`Unknown or unsupported super admin action: ${action}`, 400);
      }
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * GET /api/v1/super-admin/users
   * Search users to promote or inspect
   */
  static async searchUsers(req: NextRequest) {
    try {
      await this.getVerifiedSuperAdminContext(req);
      const { searchParams } = new URL(req.url);

      const filter = superAdminFilterSchema.parse({
        search: searchParams.get("search") || undefined,
        role: searchParams.get("role") || undefined,
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 20,
      });

      const users = await SuperAdminService.searchUsers(filter);
      return ApiResponse.success(users);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * GET /api/v1/super-admin/logs
   * Fetch audit logs
   */
  static async getAuditLogs(req: NextRequest) {
    try {
      await this.getVerifiedSuperAdminContext(req);
      const { searchParams } = new URL(req.url);
      const limit = Number(searchParams.get("limit") || 50);

      const logs = await SuperAdminService.getAuditLogs(limit);
      return ApiResponse.success(logs);
    } catch (error) {
      return handleApiError(error);
    }
  }
}
