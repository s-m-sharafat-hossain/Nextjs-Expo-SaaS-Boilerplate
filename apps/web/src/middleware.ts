// src/middleware.ts
// Next.js Edge Middleware — route protection for auth + role-based access
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

/**
 * Read the user's role from the session cookie payload.
 * The JWT/session token is expected to carry a `role` claim.
 * Works with NextAuth v4 (next-auth.session-token) and custom JWTs.
 *
 * NOTE: Full JWT verification happens server-side in route handlers.
 * Here we only do a lightweight base64 peek for redirects — the actual
 * authoritative role check must still run in each portal's server component.
 */
function getRoleFromCookie(req: NextRequest): string | null {
  try {
    // Try reading an explicit role cookie set by the auth callback
    const roleCookie = req.cookies.get("user_role")?.value;
    if (roleCookie) return roleCookie.toUpperCase();

    // Fallback: peek at the JWT payload (base64url middle segment)
    const token =
      req.cookies.get("auth_session")?.value ||
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value ||
      req.cookies.get("boilerplate_session")?.value;

    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null; // not a JWT — skip

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    return (payload?.role as string)?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next.js internal paths and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read session cookie — replace with your actual session token name
  const sessionCookie =
    req.cookies.get("auth_session")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("boilerplate_session")?.value;

  const isLoggedIn = Boolean(sessionCookie);
  const userRole = isLoggedIn ? getRoleFromCookie(req) : null;

  // ── ADMIN routes: require auth + ADMIN role
  if (isMatch(pathname, ADMIN_ROUTES)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
    if (userRole && userRole !== "ADMIN") {
      // Authenticated but wrong role — send to their own portal
      const portalMap: Record<string, string> = {
        PROVIDER: "/provider",
        CONSUMER: "/consumer",
      };
      const redirect = portalMap[userRole] ?? "/dashboard";
      return NextResponse.redirect(new URL(redirect, req.url));
    }
    return NextResponse.next();
  }

  // ── PROVIDER routes: require auth + PROVIDER role
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
    return NextResponse.next();
  }

  // ── CONSUMER routes: require auth + CONSUMER role
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
    return NextResponse.next();
  }

  // ── Protected routes: require auth only (role-agnostic)
  if (isMatch(pathname, PROTECTED_ROUTES)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
    return NextResponse.next();
  }

  // ── Auth routes: redirect logged-in users to their portal
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
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
