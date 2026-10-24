// apps/web/src/shared/middlewares/security-headers.ts
import { NextRequest, NextResponse } from "next/server";
import { CspManager } from "@/shared/security/csp";

export const STATIC_SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * Applies all enterprise security headers and dynamic CSP nonce to requests / responses
 */
export function applySecurityHeaders(
  req: NextRequest,
  response?: NextResponse
): { response: NextResponse; nonce: string } {
  const nonce = CspManager.generateNonce();
  const { headerName, headerValue } = CspManager.buildCspHeader(nonce);

  // If response not provided, create pass-through
  const res = response || NextResponse.next();

  // 1. Static security headers
  for (const [key, value] of Object.entries(STATIC_SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }

  // 2. Dynamic Content Security Policy
  res.headers.set(headerName, headerValue);

  // 3. Forward nonce in response header for downstream Layout consumption
  res.headers.set("x-nonce", nonce);

  return { response: res, nonce };
}
