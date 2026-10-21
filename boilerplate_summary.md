# Boilerplate Complete Summary
> Read-only audit — no changes made. Last verified: 2026-10-21

---

## 1. Monorepo Root Structure

```
Nextjs-Expo-SaaS-Boilerplate/
├── apps/
│   ├── web/          → Next.js 16 Enterprise SaaS Web App
│   └── mobile/       → Expo SDK 52 React Native App
├── packages/
│   └── shared/       → @shared/config — Global Master Config Package
├── package.json      → Workspaces: ["apps/*", "packages/*"]
├── tsconfig.json     → Root TypeScript config with @shared/config paths
├── AGENTS.md         → Architecture rules and coding standards
├── DESIGN_GUIDE.md   → Design system reference
└── ENV_VARS.md       → Environment variable documentation
```

**Package Manager:** npm (workspaces mode)
**Node version:** v24+
**TypeScript:** v5 strict mode

---

## 2. `apps/web` — Next.js 16 Web Application

### Tech Stack
| Layer | Package |
|---|---|
| Framework | Next.js 16.4.2 (App Router) |
| Auth | NextAuth v5 (beta.32) — Google, GitHub, Credentials |
| Database ORM | Prisma v6.19.3 — PostgreSQL |
| Styling | Tailwind CSS v4.3.3 |
| UI Icons | Lucide React v1.60.0 |
| Payments | Stripe v23 |
| Email | Resend + @react-email/components |
| AI | Custom AI service (OpenAI-compatible) |
| Chat | n8n webhook integration |
| Validation | Zod v4 |
| Testing | Vitest v5 + Testing Library |
| 2FA | otplib (TOTP) |
| Theme | next-themes |

### App Router Directory Map
```
src/app/
├── page.tsx                    → Public Landing Page (main marketing page)
├── layout.tsx                  → Root HTML layout
├── globals.css                 → Global styles
├── favicon.ico
├── (auth)/                     → Auth group (no sidebar)
│   ├── login/                  → Login page
│   ├── register/               → Registration page
│   └── signup/                 → Signup page
├── (dashboard)/                → Dashboard group (with UnifiedDashboardLayout)
│   ├── admin/                  → Admin Portal pages
│   │   ├── page.tsx            → Admin overview/stats dashboard
│   │   ├── kyc/                → KYC approval management
│   │   ├── users/              → User management
│   │   ├── transactions/       → Financial ledger
│   │   └── payouts/            → Payout processing
│   ├── provider/               → Provider Portal pages
│   │   ├── page.tsx            → Provider dashboard
│   │   ├── services/           → Service listings management
│   │   ├── bookings/           → Bookings calendar
│   │   ├── schedule/           → Availability management
│   │   └── payouts/            → Earnings & payout requests
│   ├── consumer/               → Consumer Portal pages
│   │   ├── page.tsx            → Consumer dashboard
│   │   ├── explore/            → Marketplace browse
│   │   ├── bookings/           → Booking history
│   │   ├── chat/               → Chat feature
│   │   └── credits/            → Credits wallet
│   └── dashboard/              → Common dashboard route
├── api/
│   ├── auth/                   → NextAuth handlers
│   ├── docs/                   → OpenAPI/Swagger docs
│   ├── widget/                 → Embeddable chat widget
│   └── v1/                     → 33 REST API endpoints (see below)
└── docs/                       → Internal documentation pages
```

### REST API Endpoints (`/api/v1/*`)
| Group | Endpoints |
|---|---|
| **Auth** | `/auth/login`, `/auth/register`, `/auth/demo`, `/auth/2fa` |
| **Admin** | `/admin/stats`, `/admin/users`, `/admin/kyc`, `/admin/transactions`, `/admin/payouts` |
| **Provider** | `/provider/stats`, `/provider/services`, `/provider/bookings`, `/provider/schedule`, `/provider/payouts` |
| **Consumer** | `/consumer/stats`, `/consumer/explore`, `/consumer/bookings`, `/consumer/reviews` |
| **Billing** | `/billing/checkout`, `/billing/transactions`, `/billing/manual-trx` |
| **Chat** | `/chat`, `/chat/[sessionId]` |
| **AI** | `/ai/generate` |
| **Platform** | `/credits`, `/disputes`, `/feedback`, `/health`, `/media`, `/notifications`, `/reviews`, `/workspaces`, `/webhooks/stripe` |

**Total: 33 route handlers**

---

## 3. Feature-Based MVC Architecture (`src/features/`)

Every feature follows the strict 5-file MVC pattern:

```
feature-name/
├── feature.schema.ts       → Zod schemas & DTOs
├── feature.repository.ts   → Prisma queries (tenant & role isolation)
├── feature.service.ts      → Business logic & external API calls
├── feature.action.ts       → Next.js Server Actions
└── feature.controller.ts   → REST handler delegation
```

### Feature Modules (10 modules)

| Module | Location | Description |
|---|---|---|
| **auth** | `features/auth/` | NextAuth sign-in/up, credential hashing, token management |
| **admin-portal** | `features/portals/admin-portal/` | KYC review, user banning, payout approval, platform stats |
| **provider-portal** | `features/portals/provider-portal/` | Services, schedule, bookings, earnings, KYC submission |
| **consumer-portal** | `features/portals/consumer-portal/` | Explore, book, review, credits, dispute creation |
| **billing** | `features/billing/` | Stripe checkout, manual bank payment, transaction ledger |
| **ai-engine** | `features/ai-engine/` | AI generation, credit deduction, usage tracking |
| **chat-n8n** | `features/chat-n8n/` | n8n webhook chat, session persistence, chat UI components |
| **workspaces** | `features/workspaces/` | Multi-tenant workspace creation, member management |
| **credits** | `features/credits/` | Credit balance, deduction, top-up, usage logs |
| **media** | `features/media/` | File upload handling, media metadata |
| **reviews-disputes** | `features/reviews-disputes/` | Review submission, dispute initiation & resolution |
| **notifications-feedback** | `features/notifications-feedback/` | In-app notifications, user feedback capture |

---

## 4. Shared Infrastructure (`src/shared/`)

### Layouts (4 layout shells)
| File | Purpose |
|---|---|
| `UnifiedDashboardLayout.tsx` (25 KB) | 3-state responsive shell: Desktop (260px sidebar) → Tablet (72px mini) → Mobile (280px drawer) |
| `StandardPageShell.tsx` (18 KB) | Page wrapper with header, breadcrumb, and action slots |
| `CenteredAuthLayout.tsx` | Auth pages — centered card layout |
| `PublicLandingLayout.tsx` | Marketing landing page layout |

### Shared Components (8 components)
`ChatWidget`, `CommandPalette`, `CookieConsent`, `FeedbackModal`, `OnboardingTour`, `ServiceWorkerRegister`, `Sidebar`, `ThemeToggle`

### Hooks
`useRoleTerminology.ts` — Dynamic role label lookup (`Admin | Provider | Consumer`)

### Library (`src/shared/lib/`)
| File | Purpose |
|---|---|
| `auth.ts` | NextAuth v5 setup — Google, GitHub providers; session callbacks; role seeding |
| `db.ts` | Prisma client singleton |
| `prisma.ts` | Re-export helper |
| `stripe.ts` | Stripe client singleton |
| `email.ts` | Resend email client |
| `rate-limit.ts` | API rate limiting |
| `security.ts` | CSRF + security headers |
| `upload.ts` | File upload utilities |
| `analytics.ts` | Usage analytics tracking |
| `audit.ts` | Audit log helpers |
| `jobs.ts` | Background job utilities |
| `logger.ts` | Structured logger |
| `auth.helpers.ts` | Password hashing & verification (bcrypt) |
| `utils.ts` | Shared utilities |

### Utilities (`src/shared/utils/`)
`api-response.ts` · `credit-guard.ts` · `error-handler.ts` · `metadata.ts` · `tenant-guard.ts`

### Design System (`src/shared/design/`)
`colors.ts` · `spacing.ts` · `typography.ts` · `theme-provider.tsx` · `index.ts`
UI primitives: `button.tsx` · `card.tsx` · `input.tsx` · `badge.tsx`

### Config (`src/shared/config/`)
`env.ts` · `i18n.ts` · `openapi.ts`

---

## 5. Database Schema (`apps/web/prisma/schema.prisma`)

**Database:** PostgreSQL (via Supabase/Neon)
**Total Models: 27**

| Category | Models |
|---|---|
| **Core Auth** | `User`, `Account`, `Session`, `VerificationToken` |
| **Workspaces** | `Workspace`, `WorkspaceMember` |
| **Provider Ops** | `ListingService`, `AvailabilitySlot`, `BookingOrder`, `PayoutRequest` |
| **Financial** | `Wallet`, `Subscription`, `PaymentTransaction`, `Coupon` |
| **Reviews & Trust** | `Review`, `DisputeRefund` |
| **Platform** | `KycDocument`, `AiGeneration`, `ChatSession`, `Message`, `UsageLog` |
| **Media & Comms** | `MediaFile`, `SupportTicket`, `Notification`, `Feedback` |
| **Security** | `ApiKey`, `AuditLog` |

**Key Enums:** `Role` (ADMIN/PROVIDER/CONSUMER), `KycStatus`, `BookingStatus`, `PayoutStatus`, `PaymentStatus`, `DisputeStatus`, `PlanType`, `SubscriptionStatus`

**Seeder:** `prisma/seed.ts` — creates demo admin, provider, and consumer accounts

---

## 6. Middleware & Security

`src/middleware.ts` — Next.js Edge Middleware
- Public routes: `/`, `/login`, `/register`, `/forgot-password`
- Protected routes (auth required): `/dashboard`, `/profile`, `/settings`
- Admin routes: `/admin`
- Reads: `auth_session`, `next-auth.session-token`, `__Secure-next-auth.session-token` cookies

---

## 7. `apps/mobile` — Expo React Native Application

### Tech Stack
| Layer | Package |
|---|---|
| Framework | Expo SDK 52 + Expo Router v4 |
| Language | TypeScript (strict) |
| Styling | NativeWind v4 (Tailwind CSS) |
| State | Zustand v5 |
| API Client | TanStack Query v5 + custom Axios client |
| Auth Store | Zustand + Expo SecureStore (JWT) |
| Icons | Lucide React Native |
| Gestures | react-native-gesture-handler + reanimated |

### Mobile App Router
```
src/app/
├── _layout.tsx                → Root layout (TanStack Query provider, auth guard)
├── (auth)/                    → Auth screens (login, register)
├── (tabs)/                    → Bottom Tab Navigation
│   ├── _layout.tsx            → Tab bar config (5 tabs)
│   ├── index.tsx              → Home/Dashboard tab
│   ├── explore.tsx            → Marketplace explore screen
│   ├── bookings.tsx           → Bookings list screen
│   ├── wallet.tsx             → Wallet & credits screen
│   └── profile.tsx            → User profile screen
├── ai/                        → AI generation screen
├── chat/                      → Chat screen
└── support/                   → Support ticket screen
```

### Mobile Feature Modules (6 modules)
`auth` · `billing` · `ai-engine` · `chat-n8n` · `portals` (admin, provider, consumer) · `support-feedback`

### Mobile Shared Infrastructure
| Directory | Contents |
|---|---|
| `shared/layouts/` | `ResponsiveSidebarDrawer.tsx` (15 KB), `StandardMobileScreenShell.tsx` (12 KB) |
| `shared/stores/` | `auth.store.ts` (Zustand — JWT, user role), `theme.store.ts` (dark/light mode) |
| `shared/lib/` | `api-client.ts` (Axios + JWT refresh), `query-client.ts`, `secure-store.ts` (Expo SecureStore) |
| `shared/config/` | `env.ts` (API base URL config) |

---

## 8. `packages/shared` — Global Master Config Package

**Package name:** `@shared/config`

```
packages/shared/
├── package.json           → name: "@shared/config", version: "1.0.0"
├── index.ts               → Main entry: exports all configs + types
├── config/
│   └── master.config.ts   → 643-line single source of truth
└── types/
    └── index.ts           → TypeScript interfaces & type unions
```

### What master.config.ts Contains
1. **Brand Identity** — name, shortName, niche, description, logo (light/dark/square), favicon, ogImage
2. **Role Labels** — admin, provider (`Doctor`), consumer (`Patient`) with badges, colors, portal paths
3. **Design Tokens** — primary/secondary/accent palettes, status colors, surface tokens, light & dark mode
4. **Color Scale** — Full 50–900 brand palette
5. **Typography** — Font families + mobile type scale (display → h1–h4 → body → caption → tiny)
6. **Spacing Scale** — 0–16 systematic scale
7. **Border Radii** — none (0) → xs (4px) → sm (8px) → md (12px) → lg (16px) → full (9999px)
8. **Shadows** — subtle, card, dropdown, modal
9. **Theme Settings** — defaultTheme, enableSystem, storageKey
10. **Currency & Billing** — USD, $, 5% tax, 15% platform commission
11. **Payment Gateways** — Stripe, PayPal, SSLCommerz, bKash, Razorpay, Paystack, Manual Bank + `calculateSplit()`
12. **API Endpoints** — All portal & feature endpoints
13. **Feature Flags** — AI, n8n, biometrics, push notifications, dark mode
14. **Mobile Settings** — Tab bar style, spring animations, pagination
15. **Web Settings** — Sidebar widths (260px desktop, 72px tablet, 280px mobile drawer), 64px header
16. **i18n** — en/bn/ar/es locale list, RTL flag
17. **Demo Accounts** — 3 demo logins (admin/provider/consumer)
18. **Pricing Plans** — Starter ($29), Professional ($79), Enterprise ($199)

### Backward-Compatible Named Exports
`siteConfig` · `designConfig` · `paymentConfig` · `themeConfig` · `appConfig`

---

## 9. Public Assets (`apps/web/public/`)
`manifest.json` (PWA) · `sw.js` (Service Worker) · `icon-192.png` · `icon-512.png` · `widget.js`

---

## 10. Testing

| Test File | Coverage |
|---|---|
| `src/test/utils.test.ts` | 8 utility function tests |
| `src/test/auth.test.ts` | 4 auth helper tests (hashPassword, verifyPassword) |
| `src/features/portals/admin-portal/__tests__/` | 5 admin schema tests |
| `src/features/portals/provider-portal/__tests__/` | 4 provider schema tests |
| `src/features/portals/consumer-portal/__tests__/` | 4 consumer schema tests |
| `src/features/chat-n8n/__tests__/` | 3 chat schema tests |

**Total: 6 test files, 28 tests — all passing**

---

## 11. Build & Deployment Verification

| Check | Command | Status |
|---|---|---|
| TypeScript (root) | `npx tsc --noEmit` | ✅ 0 errors |
| Web build | `npm --workspace=apps/web run build` | ✅ 59 routes compiled |
| Tests | `npm run test` | ✅ 28/28 passed |
| Web import | `import from '@shared/config'` in apps/web | ✅ Resolves |
| Mobile import | `import from '@shared/config'` in apps/mobile | ✅ Resolves |
| npm install | workspace linking | ✅ Code 0 |

---

## 12. Environment Variables Required

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon/Supabase) |
| `DIRECT_URL` | Direct DB connection (for migrations) |
| `NEXTAUTH_SECRET` | Auth session signing secret |
| `NEXTAUTH_URL` | App canonical URL |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth (optional) |
| `GITHUB_CLIENT_ID/SECRET` | GitHub OAuth (optional) |
| `STRIPE_SECRET_KEY` | Stripe payments |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `N8N_WEBHOOK_URL` | n8n chat webhook |
| `N8N_SECRET_TOKEN` | n8n auth token |

---

## 13. Key Root Config Files

| File | Purpose |
|---|---|
| `tsconfig.json` | Root TypeScript — includes `@shared/config` path alias |
| `eslint.config.mjs` | ESLint configuration |
| `vitest.config.ts` | Vitest test runner config with `@shared/config` resolve alias |
| `tailwind.config.ts` | Tailwind CSS config |
| `postcss.config.js` | PostCSS config |
| `setup-mvc.mjs` | CLI scaffold helper for new feature generation |
| `scripts/` | Additional build/scaffold scripts |
