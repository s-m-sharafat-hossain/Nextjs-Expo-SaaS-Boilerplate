// apps/web/src/shared/middlewares/api-key.middleware.ts
import { NextRequest } from "next/server";
import { AppError } from "@/shared/utils/error-handler";
import { prisma } from "@/shared/lib/db";

export const API_KEY_SCOPES = {
  READ: "read",
  WRITE: "write",
  ADMIN: "admin",
  BILLING: "billing",
} as const;

export type ApiKeyScope = (typeof API_KEY_SCOPES)[keyof typeof API_KEY_SCOPES];

// In-memory blacklist for revoked JWT and OAuth tokens
const revokedTokenBlacklist = new Set<string>();

export class ApiKeyMiddleware {
  /**
   * Authenticate using API key from Authorization header with 90-day rotation check
   */
  static async authenticate(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY", 401);
    }

    const rawKey = authHeader.slice(7).trim();

    // Check if token is blacklisted
    if (revokedTokenBlacklist.has(rawKey)) {
      throw new AppError("Token has been revoked", 401);
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: rawKey },
      include: { user: true },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      throw new AppError("Invalid or deactivated API key", 401);
    }

    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      throw new AppError("API key has expired. Please generate a new key or rotate credentials.", 401);
    }

    // 90-Day Rotation Policy Check:
    // API keys older than 90 days are flagged for mandatory rotation
    const ageInDays = (Date.now() - apiKeyRecord.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const rotationRequired = ageInDays >= 90;

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      userId: apiKeyRecord.user.id,
      email: apiKeyRecord.user.email,
      role: apiKeyRecord.user.role,
      scopes: apiKeyRecord.scopes,
      apiKeyId: apiKeyRecord.id,
      rotationRequired,
    };
  }

  /**
   * Scope-based access control guard
   */
  static requireScope(currentScopes: string[], requiredScope: ApiKeyScope | string) {
    if (!currentScopes.includes(requiredScope) && !currentScopes.includes(API_KEY_SCOPES.ADMIN)) {
      throw new AppError(`Forbidden: API key requires '${requiredScope}' scope`, 403);
    }
  }

  /**
   * Revoke / Blacklist an active token
   */
  static revokeToken(token: string) {
    revokedTokenBlacklist.add(token);
  }

  /**
   * Check if token is in the revocation blacklist
   */
  static isTokenRevoked(token: string): boolean {
    return revokedTokenBlacklist.has(token);
  }

  /**
   * Deactivate an API key in the database
   */
  static async deactivateApiKey(apiKeyId: string) {
    return prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: false },
    });
  }
}
