// src/proxy.ts
// Next.js 16 Edge Proxy — route protection for auth, role-based access, rate limiting & security headers
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders } from "@/shared/middlewares/security-headers";
import { RateLimiter } from "@/shared/security/rate-limiter";
import { CsrfProtection } from "@/shared/security/csrf";

// ─── Route Classification ───────────────────────────────────────────────────

/** Routes accessible without any session */
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"];

/** Routes requiring authentication but not a specific role */
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings"];

/** Routes requiring ADMIN role */
const ADMIN_ROUTES = ["/admin"];

/** Routes requiring PROVIDER role */
const PROVIDER_ROUTES = ["/provider"];

/** Routes requiring CONSUMER role */
const CONSUMER_ROUTES = ["/consumer"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isMatch(pathname: string, routes: string[]): boolean {
  return routes.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function getRoleFromCookie(req: NextRequest): string | null {
  try {
    const roleCookie = req.cookies.get("user_role")?.value;
    if (roleCookie) return roleCookie.toUpperCase();

    const token =
      req.cookies.get("auth_session")?.value ||
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value ||
      req.cookies.get("boilerplate_session")?.value;

    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    return (payload?.role as string)?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

// ─── Proxy ───────────────────────────────────────────────────────────────────

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip static assets
  if (
    pathname.startsWith("/_next") ||
    (pathname.includes(".") && !pathname.endsWith(".json"))
  ) {
    return NextResponse.next();
  }

  // 2. Security validation for API routes (/api/v1/*)
  if (pathname.startsWith("/api/v1")) {
    // 2a. Rate Limiting Check
    const rateLimitResult = await RateLimiter.check({
      req,
      userRole: req.headers.get("x-user-role"),
      userId: req.headers.get("x-user-id"),
      userPlan: req.headers.get("x-user-plan") || "FREE",
    });

    if (!rateLimitResult.success) {
      return RateLimiter.rateLimitExceededResponse(rateLimitResult);
    }

    // 2b. CSRF Validation for mutating requests
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method.toUpperCase())) {
      const csrfCheck = CsrfProtection.validateRequest(req);
      if (!csrfCheck.valid) {
        return CsrfProtection.forbiddenResponse(csrfCheck.reason);
      }
    }

    const res = NextResponse.next();
    RateLimiter.attachHeaders(res, rateLimitResult);
    const { response } = applySecurityHeaders(req, res);
    return response;
  }

  // 3. Auth & Role Routing
  const sessionCookie =
    req.cookies.get("auth_session")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("boilerplate_session")?.value;

  const isLoggedIn = Boolean(sessionCookie);
  const userRole = isLoggedIn ? getRoleFromCookie(req) : null;

  // ── ADMIN routes
  if (isMatch(pathname, ADMIN_ROUTES)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
    if (userRole && userRole !== "ADMIN") {
      const portalMap: Record<string, string> = {
        PROVIDER: "/provider",
        CONSUMER: "/consumer",
      };
      const redirect = portalMap[userRole] ?? "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }
  }

  // ── PROVIDER routes
  if (isMatch(pathname, PROVIDER_ROUTES)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
    if (userRole && userRole !== "PROVIDER") {
      const portalMap: Record<string, string> = {
        ADMIN: "/admin",
        CONSUMER: "/consumer",
      };
      const redirect = portalMap[userRole] ?? "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }
  }

  // ── CONSUMER routes
  if (isMatch(pathname, CONSUMER_ROUTES)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
    if (userRole && userRole !== "CONSUMER") {
      const portalMap: Record<string, string> = {
        ADMIN: "/admin",
        PROVIDER: "/provider",
      };
      const redirect = portalMap[userRole] ?? "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }
  }

  // ── Protected routes
  if (isMatch(pathname, PROTECTED_ROUTES)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
  }

  // ── Auth routes
  if (pathname === "/login" || pathname === "/register") {
    if (isLoggedIn) {
      const portalMap: Record<string, string> = {
        ADMIN: "/admin",
        PROVIDER: "/provider",
        CONSUMER: "/consumer",
      };
      const redirect = (userRole && portalMap[userRole]) ?? "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }
  }

  // 4. Apply dynamic enterprise security headers & CSP nonce to HTML pages
  const defaultRes = NextResponse.next();
  const { response } = applySecurityHeaders(req, defaultRes);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
