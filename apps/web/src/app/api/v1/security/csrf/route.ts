// apps/web/src/app/api/v1/security/csrf/route.ts
import { NextResponse } from "next/server";
import { CsrfProtection } from "@/shared/security/csrf";
import { ApiResponse } from "@/shared/utils/api-response";

export async function GET() {
  const { token } = CsrfProtection.generateToken();

  const response = ApiResponse.success(
    { csrfToken: token },
    "CSRF token generated successfully"
  );

  return CsrfProtection.attachCsrfCookie(response, token, {
    sameSite: "strict",
    httpOnly: true,
  });
}
