// src/shared/lib/audit.ts
import { db } from "./db";
import { Prisma } from "@prisma/client";

export interface CreateAuditLogParams {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Record a sensitive action to the AuditLog database table asynchronously
   */
  static async log(params: CreateAuditLogParams) {
    try {
      return await db.auditLog.create({
        data: {
          action: params.action,
          entity: params.entity,
          entityId: params.entityId,
          details: params.details ?? Prisma.JsonNull,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          userId: params.userId,
        },
      });
    } catch (err) {
      // Never let audit log failure break primary business logic
      console.error("[AuditLog] Failed to record audit log:", err);
      return null;
    }
  }
}
