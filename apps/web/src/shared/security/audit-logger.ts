// apps/web/src/shared/security/audit-logger.ts
import { prisma } from "@/shared/lib/db";
import { Prisma } from "@prisma/client";

export interface LogActionParams {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Prisma.InputJsonValue;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AuditLogFilter {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export class AuditLogger {
  /**
   * Append-only immutable log recorder
   */
  static async record(params: LogActionParams) {
    try {
      return await prisma.auditLog.create({
        data: {
          action: params.action,
          entity: params.entity,
          entityId: params.entityId ?? null,
          details: params.details ?? Prisma.JsonNull,
          ipAddress: params.ipAddress ?? null,
          userAgent: params.userAgent ?? null,
          userId: params.userId ?? null,
        },
      });
    } catch (err) {
      console.error("[AuditLogger] Failed to write audit log:", err);
      return null;
    }
  }

  /**
   * Log user action (login, logout, create, update, delete)
   */
  static async logUserAction(
    userId: string,
    action: string,
    entity: string,
    entityId?: string,
    details?: Prisma.InputJsonValue,
    ipAddress?: string,
    userAgent?: string
  ) {
    return this.record({
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log privileged administrative governance action
   */
  static async logAdminAction(
    adminId: string,
    action: string,
    entity: string,
    entityId?: string,
    details?: Prisma.InputJsonValue,
    ipAddress?: string,
    userAgent?: string
  ) {
    return this.record({
      userId: adminId,
      action: `ADMIN_${action}`,
      entity,
      entityId,
      details,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log data read / export / access (auditing who viewed sensitive data)
   */
  static async logDataAccess(
    userId: string | null,
    entity: string,
    entityId: string,
    accessType = "READ",
    ipAddress?: string
  ) {
    return this.record({
      userId,
      action: `DATA_ACCESS_${accessType}`,
      entity,
      entityId,
      details: { accessType, timestamp: new Date().toISOString() },
      ipAddress,
    });
  }

  /**
   * Log failed authentication attempts (IP, timestamp, user agent)
   */
  static async logFailedAuth(
    identifier: string,
    ipAddress: string,
    userAgent?: string,
    reason?: string
  ) {
    return this.record({
      userId: null,
      action: "AUTH_FAILED",
      entity: "auth",
      details: { identifier, reason, timestamp: new Date().toISOString() },
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log suspicious activities and triggers real-time alerting
   */
  static async logSuspiciousActivity(
    activityType: string,
    identifier: string,
    details: string | Record<string, any>,
    ipAddress?: string
  ) {
    const alertData = {
      activityType,
      identifier,
      details,
      timestamp: new Date().toISOString(),
      severity: "HIGH",
    };

    console.warn(`🚨 [SECURITY ALERT: ${activityType}]`, alertData);

    return this.record({
      userId: null,
      action: `SUSPICIOUS_${activityType}`,
      entity: "security",
      details: alertData,
      ipAddress,
    });
  }

  /**
   * Retrieve filtered, paginated audit logs with search
   */
  static async getLogs(filter: AuditLogFilter = {}) {
    const {
      page = 1,
      limit = 20,
      action,
      entity,
      userId,
      search,
      startDate,
      endDate,
    } = filter;

    const where: Prisma.AuditLogWhereInput = {};

    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (userId) where.userId = userId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { action: { contains: search, mode: "insensitive" } },
        { entity: { contains: search, mode: "insensitive" } },
        { ipAddress: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
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
      }),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Export audit trail to CSV format
   */
  static async exportLogsCsv(filter: AuditLogFilter = {}): Promise<string> {
    const { logs } = await this.getLogs({ ...filter, limit: 10000 });

    const header = ["ID", "Timestamp", "User Email", "Role", "Action", "Entity", "Entity ID", "IP Address"];
    const rows = logs.map((log) => [
      log.id,
      log.createdAt.toISOString(),
      log.user?.email || "Anonymous / System",
      log.user?.role || "SYSTEM",
      log.action,
      log.entity,
      log.entityId || "",
      log.ipAddress || "",
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    return csvContent;
  }

  /**
   * Automated Log Retention Policy Execution:
   * - 90 days default for standard user actions
   * - 1 year (365 days) for privileged admin actions
   */
  static async enforceRetentionPolicy(
    defaultRetentionDays = 90,
    adminRetentionDays = 365
  ) {
    const defaultCutoff = new Date(Date.now() - defaultRetentionDays * 24 * 60 * 60 * 1000);
    const adminCutoff = new Date(Date.now() - adminRetentionDays * 24 * 60 * 60 * 1000);

    // Prune standard user logs older than 90 days (excluding ADMIN actions)
    const standardDeleted = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: defaultCutoff },
        action: { not: { startsWith: "ADMIN_" } },
      },
    });

    // Prune admin governance logs older than 365 days
    const adminDeleted = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: adminCutoff },
        action: { startsWith: "ADMIN_" },
      },
    });

    return {
      standardLogsPruned: standardDeleted.count,
      adminLogsPruned: adminDeleted.count,
    };
  }
}
