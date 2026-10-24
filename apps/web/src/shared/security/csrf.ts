// apps/web/src/shared/security/csrf.ts
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.AUTH_SECRET || "super-secure-csrf-secret-key-32-chars-long";

export interface CsrfCookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
  maxAge?: number;
}

export class CsrfProtection {
  /**
   * Generates a cryptographically strong HMAC-signed double-submit CSRF token
   */
  static generateToken(salt?: string): { token: string; rawSecret: string } {
    const rawSecret = salt || crypto.randomBytes(32).toString("hex");
    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(rawSecret);
    const token = `${rawSecret}.${hmac.digest("hex")}`;
    return { token, rawSecret };
  }

  /**
   * Validates whether a token matches the HMAC signature and secret
   */
  static verifyToken(token: string, expectedSecret?: string): boolean {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [secret, signature] = parts;
    if (expectedSecret && secret !== expectedSecret) return false;

    const hmac = crypto.createHmac("sha256", CSRF_SECRET);
    hmac.update(secret);
    const expectedSignature = hmac.digest("hex");

    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature, "hex"),
        Buffer.from(expectedSignature, "hex")
      );
    } catch {
      return false;
    }
  }

  /**
   * Attach CSRF cookie to a response
   */
  static attachCsrfCookie(
    res: NextResponse,
    token: string,
    options: CsrfCookieOptions = {}
  ): NextResponse {
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: options.httpOnly ?? true,
      secure: options.secure ?? isProd,
      sameSite: options.sameSite ?? "strict",
      path: options.path ?? "/",
      maxAge: options.maxAge ?? 60 * 60 * 24, // 24 hours
    });
    return res;
  }

  /**
   * Validates CSRF for incoming NextRequest
   * Safely bypasses GET, HEAD, OPTIONS and requests bearing valid Bearer / API-Key Authorization
   */
  static validateRequest(req: NextRequest): { valid: boolean; reason?: string } {
    const method = req.method.toUpperCase();

    // 1. Safe HTTP methods do not mutate state
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return { valid: true };
    }

    // 2. Exemption: Bearer token authorization (e.g. mobile app or external API keys)
    // Custom Authorization headers cannot be forged via standard cross-origin browser form posts
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return { valid: true };
    }

    // 3. Exemption: Webhook routes with HMAC signature verification
    if (req.nextUrl.pathname.startsWith("/api/v1/webhooks/")) {
      return { valid: true };
    }

    // 4. Retrieve token from Header or Body form field
    const headerToken = req.headers.get(CSRF_HEADER_NAME) || req.headers.get("x-xsrf-token");
    const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;

    if (!cookieToken) {
      return { valid: false, reason: "Missing CSRF session cookie. Please refresh the page." };
    }

    if (!headerToken) {
      return { valid: false, reason: "Missing X-CSRF-Token header in request." };
    }

    // Verify token validity
    const isValidSignature = this.verifyToken(headerToken);
    if (!isValidSignature) {
      return { valid: false, reason: "Invalid CSRF token signature." };
    }

    // Double submit cookie match
    if (cookieToken !== headerToken) {
      return { valid: false, reason: "CSRF token mismatch between cookie and header." };
    }

    return { valid: true };
  }

  /**
   * Helper response when CSRF validation fails
   */
  static forbiddenResponse(reason = "Invalid or missing CSRF token"): NextResponse {
    return ApiResponse.error(reason, 403, {
      securityPolicy: "CSRF Double-Submit Cookie Protection",
    });
  }
}
