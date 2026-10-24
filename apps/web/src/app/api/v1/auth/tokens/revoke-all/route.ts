// apps/web/src/app/api/v1/auth/tokens/revoke-all/route.ts
import { NextRequest } from "next/server";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { AuthRepository } from "@/features/auth/auth.repository";
import { ApiResponse } from "@/shared/utils/api-response";
import { AuditLogger } from "@/shared/security/audit-logger";

export async function POST(req: NextRequest) {
  try {
    const user = await AuthMiddleware.authenticate(req);

    // Revoke all sessions from database
    await AuthRepository.revokeAllUserSessions(user.id);
    await AuditLogger.logUserAction(user.id, "ALL_SESSIONS_REVOKED", "sessions", user.id);

    return ApiResponse.success({ revokedAll: true }, "All active sessions have been terminated.");
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to revoke sessions", error.statusCode || 500);
  }
}
