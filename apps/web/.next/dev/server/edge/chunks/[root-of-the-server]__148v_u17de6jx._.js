(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__148v_u17de6jx._.js",
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
// src/middleware.ts
// Next.js Edge Middleware — route protection for auth + role-based access
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
// ─── Route Classification ───────────────────────────────────────────────────
/** Routes accessible without any session */ const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/register",
    "/forgot-password"
];
/** Routes requiring authentication but not a specific role */ const PROTECTED_ROUTES = [
    "/dashboard",
    "/profile",
    "/settings"
];
/** Routes requiring ADMIN role */ const ADMIN_ROUTES = [
    "/admin"
];
/** Routes requiring PROVIDER role */ const PROVIDER_ROUTES = [
    "/provider"
];
/** Routes requiring CONSUMER role */ const CONSUMER_ROUTES = [
    "/consumer"
];
// ─── Helpers ─────────────────────────────────────────────────────────────────
function isMatch(pathname, routes) {
    return routes.some((r)=>pathname === r || pathname.startsWith(r + "/"));
}
/**
 * Read the user's role from the session cookie payload.
 * The JWT/session token is expected to carry a `role` claim.
 * Works with NextAuth v4 (next-auth.session-token) and custom JWTs.
 *
 * NOTE: Full JWT verification happens server-side in route handlers.
 * Here we only do a lightweight base64 peek for redirects — the actual
 * authoritative role check must still run in each portal's server component.
 */ function getRoleFromCookie(req) {
    try {
        // Try reading an explicit role cookie set by the auth callback
        const roleCookie = req.cookies.get("user_role")?.value;
        if (roleCookie) return roleCookie.toUpperCase();
        // Fallback: peek at the JWT payload (base64url middle segment)
        const token = req.cookies.get("auth_session")?.value || req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value || req.cookies.get("boilerplate_session")?.value;
        if (!token) return null;
        const parts = token.split(".");
        if (parts.length !== 3) return null; // not a JWT — skip
        const payload = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(parts[1], "base64url").toString("utf-8"));
        return payload?.role?.toUpperCase() ?? null;
    } catch  {
        return null;
    }
}
function middleware(req) {
    const { pathname } = req.nextUrl;
    // Skip Next.js internal paths and API routes
    if (pathname.startsWith("/_next") || pathname.startsWith("/api/") || pathname.includes(".")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Read session cookie — replace with your actual session token name
    const sessionCookie = req.cookies.get("auth_session")?.value || req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value || req.cookies.get("boilerplate_session")?.value;
    const isLoggedIn = Boolean(sessionCookie);
    const userRole = isLoggedIn ? getRoleFromCookie(req) : null;
    // ── ADMIN routes: require auth + ADMIN role
    if (isMatch(pathname, ADMIN_ROUTES)) {
        if (!isLoggedIn) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?from=" + pathname, req.url));
        }
        if (userRole && userRole !== "ADMIN") {
            // Authenticated but wrong role — send to their own portal
            const portalMap = {
                PROVIDER: "/provider",
                CONSUMER: "/consumer"
            };
            const redirect = portalMap[userRole] ?? "/dashboard";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirect, req.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── PROVIDER routes: require auth + PROVIDER role
    if (isMatch(pathname, PROVIDER_ROUTES)) {
        if (!isLoggedIn) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?from=" + pathname, req.url));
        }
        if (userRole && userRole !== "PROVIDER") {
            const portalMap = {
                ADMIN: "/admin",
                CONSUMER: "/consumer"
            };
            const redirect = portalMap[userRole] ?? "/dashboard";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirect, req.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── CONSUMER routes: require auth + CONSUMER role
    if (isMatch(pathname, CONSUMER_ROUTES)) {
        if (!isLoggedIn) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?from=" + pathname, req.url));
        }
        if (userRole && userRole !== "CONSUMER") {
            const portalMap = {
                ADMIN: "/admin",
                PROVIDER: "/provider"
            };
            const redirect = portalMap[userRole] ?? "/dashboard";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirect, req.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── Protected routes: require auth only (role-agnostic)
    if (isMatch(pathname, PROTECTED_ROUTES)) {
        if (!isLoggedIn) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login?from=" + pathname, req.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // ── Auth routes: redirect logged-in users to their portal
    if (pathname === "/login" || pathname === "/register") {
        if (isLoggedIn) {
            const portalMap = {
                ADMIN: "/admin",
                PROVIDER: "/provider",
                CONSUMER: "/consumer"
            };
            const redirect = (userRole && portalMap[userRole]) ?? "/dashboard";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(redirect, req.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__148v_u17de6jx._.js.map