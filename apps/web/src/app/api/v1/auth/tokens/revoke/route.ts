// apps/web/src/app/api/v1/auth/tokens/revoke/route.ts
import { NextRequest } from "next/server";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { ApiKeyMiddleware } from "@/shared/middlewares/api-key.middleware";
import { ApiResponse } from "@/shared/utils/api-response";
import { AuditLogger } from "@/shared/security/audit-logger";

export async function POST(req: NextRequest) {
  try {
    const user = await AuthMiddleware.authenticate(req);
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return ApiResponse.error("Token is required to revoke", 400);
    }

    ApiKeyMiddleware.revokeToken(token);
    await AuditLogger.logUserAction(user.id, "TOKEN_REVOKED", "tokens", undefined, { tokenPrefix: token.slice(0, 8) });

    return ApiResponse.success({ revoked: true }, "Token revoked successfully");
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to revoke token", error.statusCode || 500);
  }
}
