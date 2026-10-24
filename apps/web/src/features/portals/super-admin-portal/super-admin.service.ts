// apps/web/src/features/portals/super-admin-portal/super-admin.service.ts
import { SuperAdminRepository } from "./super-admin.repository";
import {
  UpdatePlatformSettingsInput,
  ManageAdminInput,
  PromoteToAdminInput,
  SuperAdminFilterInput,
} from "./super-admin.schema";
import { Role } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { AuditLogger } from "@/shared/security/audit-logger";
import { prisma } from "@/shared/lib/db";
import bcrypt from "bcryptjs";

export interface SuperAdminContext {
  operatorId: string;
  operatorEmail?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class SuperAdminService {
  /**
   * Get Platform overview metrics and settings
   */
  static async getPlatformStats() {
    return SuperAdminRepository.getPlatformStats();
  }

  /**
   * Retrieve platform settings
   */
  static async getPlatformSettings() {
    return SuperAdminRepository.getPlatformSettings();
  }

  /**
   * Update platform settings with immutable audit logging
   */
  static async updatePlatformSettings(
    input: UpdatePlatformSettingsInput,
    context: SuperAdminContext
  ) {
    const previous = await SuperAdminRepository.getPlatformSettings();
    const updated = await SuperAdminRepository.updatePlatformSettings(input);

    await AuditLogger.record({
      userId: context.operatorId,
      action: "SUPER_ADMIN_UPDATE_PLATFORM_SETTINGS",
      entity: "PlatformSettings",
      entityId: updated.id,
      details: {
        previous: {
          platformName: previous.platformName,
          maintenanceMode: previous.maintenanceMode,
          registrationEnabled: previous.registrationEnabled,
          defaultPlan: previous.defaultPlan,
          platformFeePercent: previous.platformFeePercent,
        },
        updated: input,
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return updated;
  }

  /**
   * Get all admins and super admins
   */
  static async getAllAdmins() {
    return SuperAdminRepository.getAllAdmins();
  }

  /**
   * Manage an administrator or user (promote, demote, suspend, credits)
   * Enforces strict governance security rules:
   * 1. SUPER_ADMIN cannot be demoted or deleted
   * 2. SUPER_ADMIN cannot be suspended or deactivated
   * 3. Only verified SUPER_ADMIN can execute governance changes
   */
  static async manageAdmin(input: ManageAdminInput, context: SuperAdminContext) {
    const targetUser = await SuperAdminRepository.findUserById(input.targetUserId);
    if (!targetUser) {
      throw new AppError("Target user not found", 404);
    }

    // Security Rule 1 & 2: SUPER_ADMIN cannot be demoted, suspended, or deactivated
    if (targetUser.role === Role.SUPER_ADMIN) {
      if (input.action === "DEMOTE_TO_USER") {
        throw new AppError(
          "Security Rule Violation: SUPER_ADMIN role is immutable and cannot be demoted.",
          403
        );
      }
      if (input.action === "SUSPEND" || input.action === "DEACTIVATE") {
        throw new AppError(
          "Security Rule Violation: A SUPER_ADMIN account cannot be suspended or deactivated.",
          403
        );
      }
      if (input.action === "DELETE") {
        throw new AppError(
          "Security Rule Violation: A SUPER_ADMIN account cannot be deleted by anyone.",
          403
        );
      }
    }

    let result;

    switch (input.action) {
      case "PROMOTE_TO_ADMIN": {
        result = await SuperAdminRepository.manageAdmin(input.targetUserId, {
          role: Role.ADMIN,
          isActive: true,
          isBanned: false,
        });
        break;
      }
      case "PROMOTE_TO_SUPER_ADMIN": {
        result = await SuperAdminRepository.manageAdmin(input.targetUserId, {
          role: Role.SUPER_ADMIN,
          isActive: true,
          isBanned: false,
        });
        break;
      }
      case "DEMOTE_TO_USER": {
        result = await SuperAdminRepository.manageAdmin(input.targetUserId, {
          role: Role.CONSUMER,
        });
        break;
      }
      case "DEACTIVATE":
      case "SUSPEND": {
        result = await SuperAdminRepository.manageAdmin(input.targetUserId, {
          isBanned: true,
          isActive: false,
        });
        break;
      }
      case "ACTIVATE": {
        result = await SuperAdminRepository.manageAdmin(input.targetUserId, {
          isBanned: false,
          isActive: true,
        });
        break;
      }
      case "DELETE": {
        result = await prisma.user.delete({
          where: { id: input.targetUserId },
          select: { id: true, email: true, name: true, role: true },
        });
        break;
      }
      case "RESET_PASSWORD": {
        const newPwd = input.newPassword || "SuperAdminTempPass123!";
        const passwordHash = await bcrypt.hash(newPwd, 10);
        result = await prisma.user.update({
          where: { id: input.targetUserId },
          data: { passwordHash },
          select: { id: true, email: true, name: true, role: true },
        });
        break;
      }
      case "ADJUST_CREDITS": {
        if (!input.creditsDelta || input.creditsDelta === 0) {
          throw new AppError("Valid credits delta is required", 400);
        }
        result = await SuperAdminRepository.manageAdmin(input.targetUserId, {
          creditsDelta: input.creditsDelta,
        });
        break;
      }
      default:
        throw new AppError("Invalid admin management action", 400);
    }

    // Immutable audit trail recording
    await AuditLogger.record({
      userId: context.operatorId,
      action: `SUPER_ADMIN_${input.action}`,
      entity: "User",
      entityId: targetUser.id,
      details: {
        targetEmail: targetUser.email,
        previousRole: targetUser.role,
        action: input.action,
        reason: input.reason || "Manual super admin action",
        creditsDelta: input.creditsDelta,
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return result;
  }

  /**
   * Promote any user to specified role
   */
  static async promoteUser(input: PromoteToAdminInput, context: SuperAdminContext) {
    const target = await SuperAdminRepository.findUserById(input.userId);
    if (!target) {
      throw new AppError("User not found", 404);
    }

    // Protection rule
    if (target.role === Role.SUPER_ADMIN && input.role !== Role.SUPER_ADMIN) {
      throw new AppError(
        "Security Rule Violation: SUPER_ADMIN accounts cannot be demoted.",
        403
      );
    }

    const updated = await SuperAdminRepository.updateUserRole(
      input.userId,
      input.role as Role
    );

    await AuditLogger.record({
      userId: context.operatorId,
      action: `SUPER_ADMIN_CHANGE_ROLE_TO_${input.role}`,
      entity: "User",
      entityId: target.id,
      details: {
        targetEmail: target.email,
        previousRole: target.role,
        newRole: input.role,
        reason: input.reason,
      },
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return updated;
  }

  /**
   * Search users for promotion
   */
  static async searchUsers(filter: SuperAdminFilterInput) {
    return SuperAdminRepository.searchUsers(filter);
  }

  /**
   * Get audit logs for viewer
   */
  static async getAuditLogs(limit = 30) {
    return SuperAdminRepository.getRecentAuditLogs(limit);
  }
}
