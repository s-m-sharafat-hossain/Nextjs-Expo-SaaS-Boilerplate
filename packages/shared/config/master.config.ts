// packages/shared/config/master.config.ts
import {
  BrandConfig,
  CurrencyConfig,
  BillingConfig,
  DemoAccount,
  GatewayMetadata,
  MarketplaceNiche,
  PaymentGatewayType,
  PricingPlan,
  SupportedGateway,
  TabBarStyle,
} from "../types/index";

/**
 * ==============================================================================
 * GLOBAL MASTER CONFIGURATION (Single Source of Truth for Web & Mobile)
 * ==============================================================================
 * Modifying this file centrally updates branding, roles, design tokens,
 * currencies, payment methods, and platform parameters across apps/web & apps/mobile.
 */

export const masterConfig = {
  // 1. BRAND IDENTITY
  brand: {
    name: "MasterFlow SaaS",
    shortName: "MasterFlow",
    niche: "telemedicine-doctor" as MarketplaceNiche,
    description: "Enterprise Production-Ready SaaS & Marketplace Boilerplate with Three-Portal Architecture",
    url: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_APP_URL) || "http://localhost:3000",
    ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80",
    favicon: "/favicon.ico",
    logo: {
      light: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
      dark: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
      square: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&h=120&q=80",
    },
  } as BrandConfig,

  // 2. DYNAMIC ROLE TERMINOLOGY & BRANDING
  roleLabels: {
    admin: {
      key: "ADMIN" as const,
      singular: "Admin",
      plural: "Super Admins",
      badge: "Platform Administrator",
      badgeColor: "#6366f1", // Indigo
      portalTitle: "Platform Governance Portal",
      portalPath: "/admin",
      description: "Platform Governance & Compliance",
    },
    provider: {
      key: "PROVIDER" as const,
      singular: "Doctor", // Change to "Vendor" | "Owner" | "Instructor" | "Provider"
      plural: "Doctors",   // Change to "Vendors" | "Owners" | "Instructors" | "Providers"
      badge: "Verified Practitioner",
      badgeColor: "#0ea5e9", // Sky Blue
      portalTitle: "Doctor Practice Portal",
      portalPath: "/provider",
      description: "Consultation & Service Fulfillment",
      serviceUnitName: "Consultation / Service",
      earningsUnitName: "Consultation Fees",
    },
    consumer: {
      key: "CONSUMER" as const,
      singular: "Patient", // Change to "Customer" | "Renter" | "Student" | "Client"
      plural: "Patients",   // Change to "Customers" | "Renters" | "Students" | "Clients"
      badge: "Verified Client",
      badgeColor: "#10b981", // Emerald
      portalTitle: "Patient Health Portal",
      portalPath: "/consumer",
      description: "Service Discovery & Booking",
      bookingUnitName: "Appointment / Order",
    },
  },

  // 3. DESIGN TOKENS (Colors, Typography, Radii, Shadows)
  design: {
    // Theme modes
    theme: {
      defaultTheme: "light" as "light" | "dark" | "system",
      enableSystem: true,
      storageKey: "masterflow-theme-mode",
    },

    colors: {
      brand: {
        primary: {
          light: "#2563eb", // Blue-600
          dark: "#3b82f6",  // Blue-500
          hover: "#1d4ed8", // Blue-700
          subtle: "rgba(37, 99, 235, 0.08)",
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          light: "#7c3aed", // Violet-600
          dark: "#8b5cf6",  // Violet-500
          hover: "#6d28d9", // Violet-700
          subtle: "rgba(124, 58, 237, 0.08)",
        },
        accent: {
          light: "#06b6d4", // Cyan-500
          dark: "#22d3ee",  // Cyan-400
          hover: "#0891b2", // Cyan-600
        },
      },

      status: {
        success: {
          light: "#16a34a",
          dark: "#22c55e",
          subtle: "rgba(34, 197, 94, 0.12)",
        },
        warning: {
          light: "#d97706",
          dark: "#f59e0b",
          subtle: "rgba(245, 158, 11, 0.12)",
        },
        error: {
          light: "#dc2626",
          dark: "#ef4444",
          subtle: "rgba(239, 68, 68, 0.12)",
        },
        info: {
          light: "#0284c7",
          dark: "#38bdf8",
          subtle: "rgba(56, 189, 248, 0.12)",
        },
      },

      surface: {
        background: {
          light: "#f8fafc", // Slate-50
          dark: "#080c14",  // Deep rich dark
        },
        card: {
          light: "#ffffff",
          dark: "#111827",
        },
        popover: {
          light: "#ffffff",
          dark: "#1e293b",
        },
        border: {
          light: "#e2e8f0",
          dark: "#1f2937",
        },
        muted: {
          light: "#f1f5f9",
          dark: "#1e293b",
        },
      },

      text: {
        primary: {
          light: "#0f172a", // Slate-900
          dark: "#f8fafc",  // Slate-50
        },
        secondary: {
          light: "#475569", // Slate-600
          dark: "#94a3b8",  // Slate-400
        },
        muted: {
          light: "#94a3b8",
          dark: "#64748b",
        },
      },
    },

    radii: {
      none: 0,
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      "2xl": 24,
      full: 9999,
    },

    typography: {
      fontSans: "var(--font-inter), system-ui, -apple-system, sans-serif",
      fontHeading: "var(--font-inter), system-ui, -apple-system, sans-serif",
      fontMono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      mobile: {
        display: { fontSize: 32, lineHeight: 40, fontWeight: "800" as const },
        h1: { fontSize: 24, lineHeight: 32, fontWeight: "700" as const },
        h2: { fontSize: 20, lineHeight: 28, fontWeight: "700" as const },
        h3: { fontSize: 18, lineHeight: 24, fontWeight: "600" as const },
        h4: { fontSize: 16, lineHeight: 22, fontWeight: "600" as const },
        body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
        bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: "500" as const },
        caption: { fontSize: 13, lineHeight: 18, fontWeight: "400" as const },
        tiny: { fontSize: 11, lineHeight: 14, fontWeight: "500" as const },
      },
    },

    spacing: {
      0: "0px",
      1: "0.25rem",  // 4px
      2: "0.5rem",   // 8px
      3: "0.75rem",  // 12px
      4: "1rem",     // 16px
      5: "1.25rem",  // 20px
      6: "1.5rem",   // 24px
      8: "2rem",     // 32px
      10: "2.5rem",  // 40px
      12: "3rem",    // 48px
      16: "4rem",    // 64px
    },

    shadows: {
      subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
  },

  // 4. CURRENCY & BILLING SETTINGS
  currency: {
    code: "USD",
    symbol: "$",
    taxPercentage: 5,
  } as CurrencyConfig,

  commissionPercentage: 15,

  billing: {
    currency: {
      code: "USD",
      symbol: "$",
    },
    taxPercentage: 5,
    platformCommissionPercent: 15,
  } as BillingConfig,

  // 5. PAYMENT GATEWAYS CONFIGURATION
  payment: {
    defaultGateway: "STRIPE" as PaymentGatewayType,
    enabledGateways: [
      "STRIPE",
      "PAYPAL",
      "SSLCOMMERZ",
      "BKASH",
      "RAZORPAY",
      "PAYSTACK",
      "MANUAL_BANK",
    ] as PaymentGatewayType[],
    supportedGateways: [
      { id: "STRIPE", name: "Credit/Debit Card (Stripe)", icon: "credit-card", isDirect: true },
      { id: "PAYPAL", name: "PayPal Express", icon: "wallet", isDirect: true },
      { id: "BKASH", name: "bKash Mobile Wallet", icon: "smartphone", isDirect: false },
      { id: "SSLCOMMERZ", name: "SSLCommerz Multi-Bank", icon: "shield-check", isDirect: true },
      { id: "MANUAL_BANK", name: "Direct Bank Wire", icon: "building", isDirect: false },
    ] as SupportedGateway[],
    manualPaymentInstructions:
      "Send payment to Bank Account / bKash / USDT TRC20 Wallet and submit your Transaction ID (TrxID) for instant admin verification.",
  },

  // 6. API ENDPOINTS CONFIGURATION
  api: {
    baseUrl: (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) || "http://localhost:3000/api/v1",
    endpoints: {
      auth: {
        login: "/auth/login",
        register: "/auth/register",
        demo: "/auth/demo",
        twoFactor: "/auth/2fa",
      },
      admin: {
        stats: "/admin/stats",
        users: "/admin/users",
        kyc: "/admin/kyc",
        payouts: "/admin/payouts",
        transactions: "/admin/transactions",
      },
      provider: {
        stats: "/provider/stats",
        services: "/provider/services",
        bookings: "/provider/bookings",
        schedule: "/provider/schedule",
        payouts: "/provider/payouts",
      },
      consumer: {
        stats: "/consumer/stats",
        explore: "/consumer/explore",
        bookings: "/consumer/bookings",
        reviews: "/consumer/reviews",
      },
      billing: {
        checkout: "/billing/checkout",
        transactions: "/billing/transactions",
        manualTrx: "/billing/manual-trx",
      },
      chat: "/chat",
      ai: "/ai/generate",
      health: "/health",
    },
  },

  // 7. FEATURE FLAGS
  features: {
    aiEngineEnabled: true,
    n8nIntegrationEnabled: true,
    multiRolePortalEnabled: true,
    biometricsEnabled: true,
    manualBankPaymentsEnabled: true,
    pushNotificationsEnabled: true,
    darkLightToggleEnabled: true,
  },

  // 8. MOBILE-SPECIFIC SETTINGS
  mobile: {
    tabBarStyle: "standard" as TabBarStyle,
    animation: {
      springConfig: {
        damping: 18,
        stiffness: 180,
        mass: 0.8,
      },
      defaultDurationMs: 250,
    },
    pagination: {
      defaultLimit: 15,
      maxLimit: 50,
    },
    links: {
      privacyPolicy: "https://masterflow.io/privacy",
      termsOfService: "https://masterflow.io/terms",
      supportEmail: "support@masterflow.io",
    },
  },

  // 9. WEB-SPECIFIC SETTINGS
  web: {
    layout: {
      sidebar: {
        desktopWidth: "260px",
        tabletCollapsedWidth: "72px",
        mobileDrawerWidth: "280px",
      },
      topHeaderHeight: "64px",
      contentMaxWidth: "1400px",
    },
  },

  // 10. REWARDS, I18N, N8N, DEMO ACCOUNTS & PRICING PLANS
  i18n: {
    defaultLocale: "en",
    locales: ["en", "bn", "ar", "es"],
    isRTL: false,
  },

  rewards: {
    welcomeFreeCredits: 25,
    referralBonusCredits: 20,
    creditCostPerAiAction: 2,
  },

  n8n: {
    enabled: true,
    webhookUrl: (typeof process !== "undefined" && process.env?.N8N_WEBHOOK_URL) || "https://n8n.yourdomain.com/webhook/chat",
    secretToken: (typeof process !== "undefined" && process.env?.N8N_SECRET_TOKEN) || "default-secret-token",
    maxHistoryMessages: 12,
  },

  demoAccounts: [
    {
      role: "ADMIN" as const,
      email: "admin@demo.com",
      label: "Login as Super Admin",
      description: "Full platform governance, KYC approvals, and financial ledger",
      path: "/admin",
    },
    {
      role: "PROVIDER" as const,
      email: "provider@demo.com",
      label: "Login as Provider (Doctor/Vendor)",
      description: "Services, scheduling, calendar, and earnings wallet",
      path: "/provider",
    },
    {
      role: "CONSUMER" as const,
      email: "user@demo.com",
      label: "Login as Consumer (Patient/User)",
      description: "Browse marketplace, book appointments, and track orders",
      path: "/consumer",
    },
  ] as DemoAccount[],

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
        "Email Support",
      ],
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
        "Advanced Analytics & PDF Receipts",
      ],
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
        "Custom Gateway & Escrow Settlement",
      ],
    },
  ] as PricingPlan[],
};

export type MasterConfig = typeof masterConfig;

/**
 * ==============================================================================
 * BACKWARD COMPATIBLE & MODULAR EXPORTS
 * Ensures existing imports of siteConfig, designConfig, themeConfig, appConfig
 * continue to work smoothly when migrating to @shared/config.
 * ==============================================================================
 */

export const siteConfig = {
  name: masterConfig.brand.name,
  shortName: masterConfig.brand.shortName,
  niche: masterConfig.brand.niche,
  description: masterConfig.brand.description,
  url: masterConfig.brand.url,
  ogImage: masterConfig.brand.ogImage,
  roleLabels: masterConfig.roleLabels,
  i18n: masterConfig.i18n,
  currency: masterConfig.currency,
  billing: masterConfig.billing,
  payment: masterConfig.payment,
  rewards: masterConfig.rewards,
  n8n: masterConfig.n8n,
  demoAccounts: masterConfig.demoAccounts,
  plans: masterConfig.plans,
};
export type SiteConfig = typeof siteConfig;

export const designConfig = {
  theme: masterConfig.design.theme,
  colors: masterConfig.design.colors,
  typography: masterConfig.design.typography,
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    pill: "9999px",
  },
  shadows: masterConfig.design.shadows,
  layout: masterConfig.web.layout,
};
export type DesignConfig = typeof designConfig;

export const themeConfig = {
  colors: {
    primary: masterConfig.design.colors.brand.primary,
    light: {
      background: "#f8fafc",
      surface: "#ffffff",
      card: "#ffffff",
      cardSubtle: "#f1f5f9",
      border: "#e2e8f0",
      borderStrong: "#cbd5e1",
      textPrimary: "#0f172a",
      textSecondary: "#64748b",
      textMuted: "#94a3b8",
      inputBackground: "#f8fafc",
      headerBackground: "rgba(255, 255, 255, 0.95)",
      tabBarBackground: "#ffffff",
    },
    dark: {
      background: "#080c14",
      surface: "#0f172a",
      card: "#111827",
      cardSubtle: "#1e293b",
      border: "#1e293b",
      borderStrong: "#334155",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
      textMuted: "#64748b",
      inputBackground: "#0d1322",
      headerBackground: "rgba(11, 15, 25, 0.95)",
      tabBarBackground: "#0b0f19",
    },
    status: {
      success: "#10b981",
      successLight: "rgba(16, 185, 129, 0.15)",
      warning: "#f59e0b",
      warningLight: "rgba(245, 158, 11, 0.15)",
      danger: "#ef4444",
      dangerLight: "rgba(239, 68, 68, 0.15)",
      info: "#0ea5e9",
      infoLight: "rgba(14, 165, 233, 0.15)",
    },
  },
  radii: masterConfig.design.radii,
  typography: masterConfig.design.typography.mobile,
  tabBarStyle: masterConfig.mobile.tabBarStyle,
  animation: masterConfig.mobile.animation,
};
export type ThemeConfig = typeof themeConfig;

export const appConfig = {
  name: masterConfig.brand.name,
  shortName: masterConfig.brand.shortName,
  description: masterConfig.brand.description,
  defaultCurrency: masterConfig.currency.code,
  currencySymbol: masterConfig.currency.symbol,
  defaultLocale: masterConfig.i18n.defaultLocale,
  roleLabels: masterConfig.roleLabels,
  supportedGateways: masterConfig.payment.supportedGateways,
  pagination: masterConfig.mobile.pagination,
  links: masterConfig.mobile.links,
};
export type AppConfig = typeof appConfig;

export const paymentConfig = {
  activeGateways: [
    {
      id: "STRIPE" as PaymentGatewayType,
      name: "Credit / Debit Card (Stripe)",
      category: "card" as const,
      countries: ["US", "GB", "EU", "CA", "AU", "GLOBAL"],
      currencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
      isInstant: true,
      requiresTrxId: false,
    },
    {
      id: "PAYPAL" as PaymentGatewayType,
      name: "PayPal Express",
      category: "wallet" as const,
      countries: ["GLOBAL"],
      currencies: ["USD", "EUR", "GBP"],
      isInstant: true,
      requiresTrxId: false,
    },
    {
      id: "SSLCOMMERZ" as PaymentGatewayType,
      name: "SSLCommerz (All Bangladesh Cards & MFS)",
      category: "card" as const,
      countries: ["BD"],
      currencies: ["BDT"],
      isInstant: true,
      requiresTrxId: false,
    },
    {
      id: "BKASH" as PaymentGatewayType,
      name: "bKash Direct Wallet",
      category: "wallet" as const,
      countries: ["BD"],
      currencies: ["BDT"],
      isInstant: true,
      requiresTrxId: false,
    },
    {
      id: "RAZORPAY" as PaymentGatewayType,
      name: "Razorpay (UPI, Cards & NetBanking)",
      category: "card" as const,
      countries: ["IN"],
      currencies: ["INR"],
      isInstant: true,
      requiresTrxId: false,
    },
    {
      id: "PAYSTACK" as PaymentGatewayType,
      name: "Paystack (African Gateway)",
      category: "card" as const,
      countries: ["NG", "GH", "ZA", "KE"],
      currencies: ["NGN", "GHS", "ZAR", "USD"],
      isInstant: true,
      requiresTrxId: false,
    },
    {
      id: "MANUAL_BANK" as PaymentGatewayType,
      name: "Manual Bank / bKash Send Money / USDT Crypto",
      category: "bank" as const,
      countries: ["GLOBAL", "BD", "AE"],
      currencies: ["USD", "BDT", "EUR", "AED"],
      isInstant: false,
      requiresTrxId: true,
      instructions:
        "Please transfer funds to one of the following accounts and input your Transaction Reference ID (TrxID) below for manual admin approval within 1-2 hours:\n\n" +
        "1. Bank Wire (USD): Chase Bank NYC, Acc: 9876543210, Routing: 021000021\n" +
        "2. Bangladesh bKash Merchant / Personal: +8801700000000\n" +
        "3. USDT (TRC-20): TXYZ1234567890abcdefghijklmnopqrst",
    },
  ] as GatewayMetadata[],

  // Commission split calculation
  calculateSplit(totalAmount: number, commissionPercent: number = 15) {
    const platformFee = Math.round((totalAmount * (commissionPercent / 100)) * 100) / 100;
    const providerEarnings = Math.round((totalAmount - platformFee) * 100) / 100;
    return {
      totalAmount,
      platformFee,
      providerEarnings,
      commissionPercent,
    };
  },
};
export type PaymentConfig = typeof paymentConfig;

