module.exports = [
(()=>{"use strict";return[
"[project]/apps/web/src/app/api/v1/health/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
// src/app/api/v1/health/route.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/utils/api-response.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$site$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/shared/config/site.config.ts [app-route] (ecmascript)");
;
;
;
async function GET(req) {
    const dbStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["testDatabaseConnection"])();
    const healthData = {
        app: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$site$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteConfig"].name,
        environment: ("TURBOPACK compile-time value", "development") || "development",
        timestamp: new Date().toISOString(),
        database: {
            provider: "PostgreSQL (Supabase / Neon)",
            status: dbStatus.connected ? "HEALTHY" : "DISCONNECTED (Demo Mode)",
            latency: `${dbStatus.latencyMs}ms`,
            error: dbStatus.error || null
        },
        paymentGateways: {
            default: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$site$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteConfig"].payment.defaultGateway,
            enabled: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$config$2f$site$2e$config$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["siteConfig"].payment.enabledGateways
        }
    };
    if (!dbStatus.connected) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(healthData, "Application is running in Portfolio Instant Demo mode (PostgreSQL offline or pending configuration)");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$shared$2f$utils$2f$api$2d$response$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiResponse"].success(healthData, "Database and API services healthy");
}
}),
"[project]/apps/web/src/shared/config/site.config.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// apps/web/src/shared/config/site.config.ts
__turbopack_context__.s([
    "siteConfig",
    ()=>siteConfig
]);
const siteConfig = {
    name: "MasterFlow SaaS",
    shortName: "MasterFlow",
    niche: "telemedicine-doctor",
    description: "Enterprise Production-Ready SaaS & Marketplace Boilerplate with Three-Portal Architecture",
    url: ("TURBOPACK compile-time value", "http://localhost:3000") ?? "http://localhost:3000",
    ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80",
    // ─────────────────────────────────────────────────────────────
    // DYNAMIC ROLE TERMINOLOGY (Rename entire platform via config!)
    // ─────────────────────────────────────────────────────────────
    roleLabels: {
        // Platform Super Admin
        admin: {
            singular: "Admin",
            plural: "Super Admins",
            portalTitle: "Platform Governance Portal",
            portalPath: "/admin"
        },
        // Supply-side / Partner / Provider
        provider: {
            singular: "Doctor",
            plural: "Doctors",
            badge: "Verified Practitioner",
            portalTitle: "Doctor Practice Portal",
            portalPath: "/provider",
            serviceUnitName: "Consultation / Service",
            earningsUnitName: "Consultation Fees"
        },
        // Demand-side / Customer / Consumer
        consumer: {
            singular: "Patient",
            plural: "Patients",
            portalTitle: "Patient Health Portal",
            portalPath: "/consumer",
            bookingUnitName: "Appointment / Order"
        }
    },
    // Language & RTL support for Arabic / International clients
    i18n: {
        defaultLocale: "en",
        locales: [
            "en",
            "bn",
            "ar",
            "es"
        ],
        isRTL: false
    },
    // Currency, Tax & Commission Configuration
    currency: {
        code: "USD",
        symbol: "$",
        taxPercentage: 5
    },
    billing: {
        currency: {
            code: "USD",
            symbol: "$"
        },
        taxPercentage: 5,
        platformCommissionPercent: 15
    },
    // Multi-Country Payment Gateways
    payment: {
        defaultGateway: "STRIPE",
        enabledGateways: [
            "STRIPE",
            "PAYPAL",
            "SSLCOMMERZ",
            "BKASH",
            "RAZORPAY",
            "PAYSTACK",
            "MANUAL_BANK"
        ],
        manualPaymentInstructions: "Send payment to Bank Account / bKash / USDT TRC20 Wallet and submit your Transaction ID (TrxID) for instant admin verification."
    },
    // Referral & Credit Rewards
    rewards: {
        welcomeFreeCredits: 25,
        referralBonusCredits: 20,
        creditCostPerAiAction: 2
    },
    // n8n Workflow & AI Chatbot Integration
    n8n: {
        enabled: true,
        webhookUrl: process.env.N8N_WEBHOOK_URL ?? "https://n8n.yourdomain.com/webhook/chat",
        secretToken: process.env.N8N_SECRET_TOKEN ?? "default-secret-token",
        maxHistoryMessages: 12
    },
    // 1-Click Portfolio Demo Role Switcher Accounts
    demoAccounts: [
        {
            role: "ADMIN",
            email: "admin@demo.com",
            label: "Login as Super Admin",
            description: "Full platform governance, KYC approvals, and financial ledger",
            path: "/admin"
        },
        {
            role: "PROVIDER",
            email: "provider@demo.com",
            label: "Login as Provider (Doctor/Vendor)",
            description: "Services, scheduling, calendar, and earnings wallet",
            path: "/provider"
        },
        {
            role: "CONSUMER",
            email: "user@demo.com",
            label: "Login as Consumer (Patient/User)",
            description: "Browse marketplace, book appointments, and track orders",
            path: "/consumer"
        }
    ],
    // Pricing & Subscription Tiers
    plans: [
        {
            id: "starter",
            name: "Starter Tier",
            price: 29,
            credits: 100,
            period: "monthly",
            popular: false,
            features: [
                "100 AI Automation Credits",
                "Up to 2 Workspaces",
                "Standard Multi-Gateway Checkout",
                "Email Support"
            ]
        },
        {
            id: "pro",
            name: "Professional Tier",
            price: 79,
            credits: 500,
            period: "monthly",
            popular: true,
            features: [
                "500 AI Automation Credits",
                "Unlimited Workspaces & Team Seats",
                "Provider Commission Split Engine",
                "Priority 24/7 Support",
                "Advanced Analytics & PDF Receipts"
            ]
        },
        {
            id: "enterprise",
            name: "Enterprise Tier",
            price: 199,
            credits: 2500,
            period: "monthly",
            popular: false,
            features: [
                "2,500 AI Automation Credits",
                "Full n8n Dedicated Webhook Tunnel",
                "Custom White-Label Domain & Branding",
                "Dedicated VIP Account Manager",
                "Custom Gateway & Escrow Settlement"
            ]
        }
    ]
};
}),
"[project]/apps/web/src/shared/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db,
    "prisma",
    ()=>prisma,
    "testDatabaseConnection",
    ()=>testDatabaseConnection
]);
// src/shared/lib/db.ts
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = db;
}
const prisma = db;
async function testDatabaseConnection() {
    const start = performance.now();
    try {
        await db.$queryRaw`SELECT 1`;
        const latencyMs = Math.round(performance.now() - start);
        return {
            connected: true,
            latencyMs
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown database error";
        return {
            connected: false,
            latencyMs: 0,
            error: message
        };
    }
}
}),
"[project]/apps/web/src/shared/utils/api-response.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiResponse",
    ()=>ApiResponse
]);
// src/shared/utils/api-response.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
class ApiResponse {
    static success(data, message = "Success", statusCode = 200, meta) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            statusCode,
            message,
            data,
            ...meta ? {
                meta
            } : {}
        }, {
            status: statusCode
        });
    }
    static error(message = "Internal Server Error", statusCode = 500, errors) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            statusCode,
            message,
            ...errors !== undefined && errors !== null ? {
                errors
            } : {}
        }, {
            status: statusCode
        });
    }
}
}),
]})(),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1em0_5c81p5fa._.js.map