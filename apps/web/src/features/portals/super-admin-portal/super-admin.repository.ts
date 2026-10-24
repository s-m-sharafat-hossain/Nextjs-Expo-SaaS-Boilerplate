// apps/web/src/features/portals/super-admin-portal/super-admin.repository.ts
import { prisma } from "@/shared/lib/db";
import { Role, PlanType, Prisma } from "@prisma/client";
import { UpdatePlatformSettingsInput, SuperAdminFilterInput } from "./super-admin.schema";

export class SuperAdminRepository {
  /**
   * Fetch current platform settings, creating a default singleton row if missing.
   */
  static async getPlatformSettings() {
    let settings = await prisma.platformSettings.findFirst();

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          platformName: "MasterFlow SaaS",
          maintenanceMode: false,
          maintenanceMessage: "We are undergoing scheduled platform maintenance. Please check back shortly.",
          registrationEnabled: true,
          defaultPlan: PlanType.FREE,
          maxFreeCredits: 25,
          platformFeePercent: 5.0,
          minPayoutAmount: 50.0,
          kycRequired: false,
          termsRequired: true,
        },
      });
    }

    return settings;
  }

  /**
   * Update platform settings
   */
  static async updatePlatformSettings(data: UpdatePlatformSettingsInput) {
    const existing = await this.getPlatformSettings();

    return prisma.platformSettings.update({
      where: { id: existing.id },
      data: {
        ...(data.platformName !== undefined && { platformName: data.platformName }),
        ...(data.maintenanceMode !== undefined && { maintenanceMode: data.maintenanceMode }),
        ...(data.maintenanceMessage !== undefined && { maintenanceMessage: data.maintenanceMessage }),
        ...(data.registrationEnabled !== undefined && { registrationEnabled: data.registrationEnabled }),
        ...(data.defaultPlan !== undefined && { defaultPlan: data.defaultPlan as PlanType }),
        ...(data.maxFreeCredits !== undefined && { maxFreeCredits: data.maxFreeCredits }),
        ...(data.platformFeePercent !== undefined && { platformFeePercent: data.platformFeePercent }),
        ...(data.minPayoutAmount !== undefined && { minPayoutAmount: data.minPayoutAmount }),
        ...(data.kycRequired !== undefined && { kycRequired: data.kycRequired }),
        ...(data.termsRequired !== undefined && { termsRequired: data.termsRequired }),
      },
    });
  }

  /**
   * Get all admin-level users (SUPER_ADMIN and ADMIN)
   */
  static async getAllAdmins() {
    return prisma.user.findMany({
      where: {
        role: { in: [Role.SUPER_ADMIN, Role.ADMIN] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        credits: true,
        isActive: true,
        isBanned: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            managedWorkspaces: true,
            auditLogs: true,
          },
        },
      },
      orderBy: [
        { role: "asc" }, // SUPER_ADMIN first
        { createdAt: "desc" },
      ],
    });
  }

  /**
   * Update user role
   */
  static async updateUserRole(userId: string, newRole: Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isBanned: true,
      },
    });
  }

  /**
   * Manage user/admin state (ban, activate, adjust credits)
   */
  static async manageAdmin(
    targetUserId: string,
    updates: {
      isBanned?: boolean;
      isActive?: boolean;
      creditsDelta?: number;
      role?: Role;
    }
  ) {
    const data: Prisma.UserUpdateInput = {};

    if (updates.isBanned !== undefined) {
      data.isBanned = updates.isBanned;
      if (updates.isBanned) {
        data.isActive = false;
      }
    }

    if (updates.isActive !== undefined) {
      data.isActive = updates.isActive;
    }

    if (updates.role !== undefined) {
      data.role = updates.role;
    }

    if (updates.creditsDelta !== undefined) {
      data.credits = { increment: updates.creditsDelta };
    }

    return prisma.user.update({
      where: { id: targetUserId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        credits: true,
        isActive: true,
        isBanned: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Find user by ID or Email
   */
  static async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Paginated directory search for user promotion
   */
  static async searchUsers(filter: SuperAdminFilterInput) {
    const where: Prisma.UserWhereInput = {};

    if (filter.role) {
      where.role = filter.role as Role;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (filter.page - 1) * filter.limit,
        take: filter.limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          credits: true,
          isActive: true,
          isBanned: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      items,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    };
  }

  /**
   * Aggregate platform-wide governance metrics
   */
  static async getPlatformStats() {
    const [
      totalUsers,
      superAdminsCount,
      adminsCount,
      providersCount,
      consumersCount,
      totalWorkspaces,
      paymentsSummary,
      activeSessionsCount,
      totalAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.SUPER_ADMIN } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.user.count({ where: { role: Role.PROVIDER } }),
      prisma.user.count({ where: { role: Role.CONSUMER } }),
      prisma.workspace.count(),
      prisma.paymentTransaction.aggregate({
        _sum: { finalAmount: true },
        _count: { _all: true },
      }),
      prisma.session.count({
        where: { expires: { gt: new Date() } },
      }),
      prisma.auditLog.count(),
    ]);

    const grossVolume = paymentsSummary._sum?.finalAmount || 0;
    const settings = await this.getPlatformSettings();
    const estimatedPlatformFees = (grossVolume * settings.platformFeePercent) / 100;

    return {
      totalUsers,
      superAdminsCount,
      adminsCount,
      providersCount,
      consumersCount,
      totalWorkspaces,
      activeSessionsCount,
      totalAuditLogs,
      grossVolume,
      estimatedPlatformFees,
      completedTransactionsCount: paymentsSummary._count?._all || 0,
      maintenanceMode: settings.maintenanceMode,
      registrationEnabled: settings.registrationEnabled,
    };
  }

  /**
   * Fetch recent audit trail entries
   */
  static async getRecentAuditLogs(limit = 25) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }
}
