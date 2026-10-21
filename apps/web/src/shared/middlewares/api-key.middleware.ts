// apps/web/src/shared/middlewares/api-key.middleware.ts
import { NextRequest } from "next/server";
import { AppError } from "@/shared/utils/error-handler";
import { prisma } from "@/shared/lib/db";

export class ApiKeyMiddleware {
  /**
   * Authenticate using API key from Authorization header
   */
  static async authenticate(req: NextRequest) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Missing or invalid Authorization header. Use: Bearer YOUR_API_KEY", 401);
    }

    const rawKey = authHeader.slice(7);

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: rawKey },
      include: { user: true },
    });

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      throw new AppError("Invalid or expired API key", 401);
    }

    if (apiKeyRecord.expiresAt && apiKeyRecord.expiresAt < new Date()) {
      throw new AppError("API key has expired", 401);
    }

    // Update last used
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
    };
  }

  /**
   * Check if API key has required scope
   */
  static requireScope(currentScopes: string[], requiredScope: string) {
    if (!currentScopes.includes(requiredScope) && !currentScopes.includes("admin")) {
      throw new AppError(`Forbidden: API key requires '${requiredScope}' scope`, 403);
    }
  }
}
