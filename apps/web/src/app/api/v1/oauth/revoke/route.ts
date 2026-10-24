// apps/web/src/app/api/v1/oauth/revoke/route.ts
import { NextRequest } from "next/server";
import { AuthRepository } from "@/features/auth/auth.repository";
import { ApiResponse } from "@/shared/utils/api-response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token || body.token_hint;

    if (!token) {
      return ApiResponse.error("Token parameter is required for revocation", 400);
    }

    await AuthRepository.revokeOAuthToken(token);
    return ApiResponse.success({ revoked: true }, "OAuth token revoked successfully");
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to revoke OAuth token", 500);
  }
}
