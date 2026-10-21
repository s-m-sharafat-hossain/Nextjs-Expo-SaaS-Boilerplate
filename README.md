# Master Boilerplate #1 — SaaS & AI Web Starter

A production-grade, enterprise SaaS boilerplate built with **Stack 1**:
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **ORM:** Prisma ORM
- **Database:** PostgreSQL (Optimized for **Supabase** or **Neon Serverless**)

Designed strictly with **Feature-Based Extended MVC** architecture and zero vendor lock-in.

---

## ⚡ Quick Start for Deployment

### 1. Database Setup (Choose Neon or Supabase - 100% Free)

#### Option A: Neon Serverless Postgres (Recommended - 60-Second Setup)
1. Go to [Neon.tech](https://neon.tech) and sign up for a free account (no credit card required).
2. Create a new project (e.g., `masterflow-db`).
3. Under **Dashboard > Connection Details**, copy:
   - **Pooled connection string** (ends with `-pooler...`) -> set as `DATABASE_URL`
   - **Direct connection string** -> set as `DIRECT_URL`

#### Option B: Supabase PostgreSQL
1. Go to [Supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings > Database > Connection Strings**:
   - Select **Transaction Pooler (port 6543)** -> set as `DATABASE_URL` (append `?pgbouncer=true`)
   - Select **Session / Direct (port 5432)** -> set as `DIRECT_URL`

---

### 2. Environment Variables Configuration
Copy the template into `apps/web/.env`:
```bash
cp apps/web/.env.example apps/web/.env
```
Fill in the required variables:
```env
# Required for Database:
DATABASE_URL="postgresql://[user]:[password]@[host]-pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://[user]:[password]@[host].neon.tech/neondb?sslmode=require"

# Required for Authentication (generate using: openssl rand -base64 32):
NEXTAUTH_SECRET="your-secure-32-character-secret-key-here"
AUTH_SECRET="your-secure-32-character-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Application URL:
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

### 3. Database Migration & Seed Demo Data
Push your Prisma schema to your cloud database and populate demo portal accounts:
```bash
# Push schema tables to database
npm run db:push

# Seed demo accounts, workspaces, services & bookings
npm run db:seed
```

**Pre-seeded Demo Accounts for Testing:**
- 👑 **Super Admin:** `admin@masterflow.io` / `Password123!`
- 🩺 **Provider (Doctor):** `dr.mitchell@masterflow.io` / `Password123!`
- 👤 **Consumer (Patient):** `alex.johnson@masterflow.io` / `Password123!`

---

### 4. Deploy to Vercel (1-Click Free Hosting)
1. Push your repository to GitHub.
2. Sign in to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set the **Root Directory** to `apps/web`.
5. Under **Environment Variables**, add:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel production domain: `https://your-project.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel production domain: `https://your-project.vercel.app`)
6. Click **Deploy**. Your enterprise SaaS & marketplace will be live in ~60 seconds!

---

## 🚀 Key Highlights & Architecture

- **Architecture:** Feature-Based Extended MVC (`Model -> Service -> Controller -> Route/View`).
- **Database Layer (`apps/web/src/shared/lib/db.ts`):**
  - Common Singleton Prisma Client with connection pooling for Serverless Postgres.
  - Built-in `testDatabaseConnection()` helper.
  - Live Database & API health check endpoint at `/api/v1/health`.
  - Supabase & Neon dual connection support (`DATABASE_URL` for pooler, `DIRECT_URL` for migrations).
- **Strict Separation of Concerns (Feature-Based Modular MVC):**
  - `apps/web/src/features/<feature>/<feature>.schema.ts` — Zod DTOs & runtime schemas.
  - `apps/web/src/features/<feature>/<feature>.repository.ts` — Prisma queries with Tenant & Role Isolation.
  - `apps/web/src/features/<feature>/<feature>.service.ts` — Core business logic, computations & adapters.
  - `apps/web/src/features/<feature>/<feature>.action.ts` — Next.js Server Actions.
  - `apps/web/src/features/<feature>/<feature>.controller.ts` — Thin REST controllers with `asyncHandler` & `ApiResponse`.
- **Plug-and-Play Multi-Payment Gateways:**
  - 🇺🇸 **Stripe** (Cards & Global Subscriptions)
  - 🌍 **PayPal** (Worldwide)
  - 🇧🇩 **SSLCommerz** (Local Bangladesh cards, Netbanking, MFS)
  - 🇧🇩 **bKash** (Direct Merchant API)
  - 🏛️ **Manual Bank Transfer** (Offline/Wire transfers with invoice tracking)
- **AI Workspace & Credit System:**
  - Token/Credit deduction with atomic database transactions.
  - Pluggable OpenAI integration with portfolio demo fallback.
- **Dynamic Rebranding:**
  - Change app name, roles, default currency, tax percentage, and theme colors from a single file: `packages/shared/config/master.config.ts` (Single Source of Truth for web & mobile).
- **1-Command Feature Generator:**
  - Scaffold a complete 5-file Feature-Based MVC module + API route in 1 second:
    ```bash
    node scripts/make-mvc.mjs product
    # or: npm run make:feature product
    ```
- **Authentication & Security:**
  - Email/Password authentication with bcrypt hashing
  - OAuth providers (Google, GitHub) via NextAuth.js
  - Password reset flow with email verification
  - Email verification system
  - Two-Factor Authentication (TOTP) with otplib
  - API Key management for programmatic access
  - Rate limiting (Upstash Redis + in-memory fallback)
  - XSS sanitization and CSRF protection
- **Testing & CI/CD:**
  - Vitest testing infrastructure with sample tests
  - GitHub Actions CI/CD pipeline (lint, test, build, deploy)
  - ESLint with Next.js config
- **API Documentation:**
  - OpenAPI/Swagger specification at `/api/docs`
  - Interactive API documentation page at `/docs`
- **PWA Support:**
  - Progressive Web App with manifest.json
  - Service worker for offline support
  - Installable on mobile devices

---

## 🗄️ PostgreSQL Setup (Supabase / Neon)

### Option A: Supabase (Recommended for Production)
1. Go to [Supabase](https://supabase.com) and create a project.
2. In **Project Settings** $\rightarrow$ **Database** $\rightarrow$ **Connection Pooling**:
   - Copy the **Transaction Pooler** string (port `6543`) into `DATABASE_URL`.
   - Copy the **Session/Direct** connection string (port `5432`) into `DIRECT_URL`.
3. Paste into your `.env`:
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ```

### Option B: Neon Serverless Postgres
1. Go to [Neon.tech](https://neon.tech) and create a project.
2. In your Neon dashboard:
   - Check **Pooled connection** and paste into `DATABASE_URL`.
   - Check **Direct connection** and paste into `DIRECT_URL`.
3. Paste into your `.env`:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/neondb?sslmode=require"
   DIRECT_URL="postgresql://[user]:[password]@[endpoint].[region].aws.neon.tech/neondb?sslmode=require"
   ```

---

## 📂 Project Structure

```
├── apps/
│   ├── web/                         # Next.js 15+ Enterprise SaaS (App Router)
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # PostgreSQL schema with directUrl support
│   │   │   └── seed.ts              # Initial seed data (Admin, Provider, Consumer)
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (auth)/login/    # 1-Click Role Switcher Demo Login UI
│   │       │   ├── (dashboard)/
│   │       │   │   ├── dashboard/   # Shared Dashboard
│   │       │   │   ├── admin/       # Super Admin Governance Portal
│   │       │   │   ├── provider/    # Doctor / Vendor / Owner Partner Portal
│   │       │   │   └── consumer/    # Patient / Customer / End-User Portal
│   │       │   ├── api/v1/          # Thin API routes (calling controllers only)
│   │       │   │   ├── ai/
│   │       │   │   ├── auth/        # Login, register, password reset, 2FA
│   │       │   │   ├── analytics/   # Revenue metrics & event tracking
│   │       │   │   ├── api-keys/    # API key management
│   │       │   │   ├── billing/checkout/
│   │       │   │   ├── bookings/
│   │       │   │   ├── chat/        # n8n AI Agent integration
│   │       │   │   ├── cron/        # Background job scheduler
│   │       │   │   ├── feedback/    # User feedback system
│   │       │   │   ├── health/      # Live DB & latency healthcheck
│   │       │   │   ├── profile/     # User profile management
│   │       │   │   ├── referral/    # Referral system
│   │       │   │   ├── subscription/# Stripe subscription management
│   │       │   │   ├── tickets/     # Support tickets
│   │       │   │   └── webhooks/    # Stripe webhooks
│   │       │   ├── layout.tsx
│   │       │   └── page.tsx         # Modern Hero Landing Page
│   │       ├── features/            # Feature-Based Modular MVC
│   │       │   ├── auth/            # schema, repository, service, action, controller
│   │       │   ├── billing/         # schema, repository, service, action, controller
│   │       │   ├── credits/         # schema, repository, service, action, controller
│   │       │   ├── workspaces/      # schema, repository, service, action, controller
│   │       │   ├── ai-engine/       # schema, repository, service, action, controller
│   │       │   ├── chat-n8n/        # schema, repository, service, action, controller
│   │       │   ├── media/           # schema, repository, service, action, controller
│   │       │   ├── reviews-disputes/# schema, repository, service, action, controller
│   │       │   ├── notifications-feedback/
│   │       │   └── portals/
│   │       │       ├── admin-portal/
│   │       │       ├── provider-portal/
│   │       │       └── consumer-portal/
│   │       └── shared/
│   │           ├── components/      # Reusable UI components
│   │           ├── config/          # env.ts, openapi.ts, i18n.ts
│   │           ├── design/          # colors, typography, theme-provider, ui/
│   │           ├── hooks/           # useRoleTerminology, etc.
│   │           ├── layouts/         # UnifiedDashboardLayout, StandardPageShell
│   │           ├── lib/             # auth.ts, db.ts, email.ts, stripe.ts, ...
│   │           ├── middlewares/     # auth.middleware.ts, api-key.middleware.ts
│   │           ├── styles/          # design-variables.css
│   │           └── utils/           # api-response.ts, error-handler.ts, ...
│   └── mobile/                      # Expo / React Native App
│       └── src/
├── packages/
│   └── shared/
│       ├── config/
│       │   └── master.config.ts     # ⭐ Single Source of Truth (brand, roles, design, billing)
│       └── types/                   # Shared TypeScript types
├── scripts/
│   ├── make-mvc.mjs                 # 1-command Feature-Based MVC generator
│   └── make-feature.mjs             # Alias for make-mvc.mjs
├── .env.example
├── .github/workflows/               # CI/CD pipeline
├── vitest.config.ts                 # Vitest configuration
├── AGENTS.md                        # AI Agent coding guidelines
└── setup-mvc.mjs                    # Full monorepo directory scaffolder
```

---

## ⚡ Quick Start & Database Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database in `.env`
Ensure your PostgreSQL `DATABASE_URL` and `DIRECT_URL` are set in `.env`.

### 3. Push Schema to Database
```bash
npm run db:push
```

### 4. Seed Initial Demo Data
```bash
npm run db:seed
```

### 5. Inspect Database via GUI
```bash
npm run db:studio
```

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the landing page or [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health) to verify database health.

---

## 🛠️ Generating New Features (1-Command Automation)

To add a new feature (e.g. `car`, `hospital`, `appointment`), run:
```bash
node scripts/make-mvc.mjs car
# or equivalently:
npm run make:feature car
```
This automatically generates a complete **Feature-Based Modular MVC** scaffold:
1. `apps/web/src/features/car/car.schema.ts`       — Zod DTOs & validation
2. `apps/web/src/features/car/car.repository.ts`   — Prisma queries + Tenant Isolation
3. `apps/web/src/features/car/car.service.ts`      — Business logic
4. `apps/web/src/features/car/car.action.ts`       — Next.js Server Action
5. `apps/web/src/features/car/car.controller.ts`   — REST handler
6. `apps/web/src/features/car/car.component.tsx`   — React View (StandardPageShell)
7. `apps/web/src/app/api/v1/cars/route.ts`         — API route handler

---

## 🛡️ Unified Response Format

All API routes return responses in a standardized format:
```json
{
  "success": true,
  "message": "Database and API services healthy",
  "data": { ... }
}
```

---

## 🔐 Authentication Features

### OAuth Providers (Google, GitHub)
- Integrated with NextAuth.js v5 (beta)
- Automatic user creation on first OAuth login
- Supports Google and GitHub providers
- Configure in `.env`:
  ```env
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  GITHUB_CLIENT_ID=your_github_client_id
  GITHUB_CLIENT_SECRET=your_github_client_secret
  NEXTAUTH_SECRET=your_nextauth_secret
  ```

### Password Reset Flow
- **Forgot Password:** `POST /api/v1/auth/password-reset/forgot`
- **Reset Password:** `POST /api/v1/auth/password-reset/reset`
- Secure token-based reset with 1-hour expiration
- Email integration via Resend

### Email Verification
- **Send Verification:** `POST /api/v1/auth/email-verification/send`
- **Verify Email:** `POST /api/v1/auth/email-verification/verify`
- 24-hour token expiration
- Automatic email verification for OAuth users

### Two-Factor Authentication (TOTP)
- **Setup 2FA:** `POST /api/v1/auth/two-factor/setup`
- **Enable 2FA:** `POST /api/v1/auth/two-factor/enable`
- **Verify Token:** `POST /api/v1/auth/two-factor/verify`
- **Disable 2FA:** `POST /api/v1/auth/two-factor/disable`
- Uses otplib for TOTP generation
- QR code for authenticator apps

### API Key Management
- **List Keys:** `GET /api/v1/api-keys`
- **Create Key:** `POST /api/v1/api-keys`
- **Update Key:** `PATCH /api/v1/api-keys/[id]`
- **Delete Key:** `DELETE /api/v1/api-keys/[id]`
- Scopes: `read`, `write`, `admin`
- SHA-256 hashed keys
- Automatic expiration support

---

## 🧪 Testing

### Run Tests
```bash
npm test              # Run all tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Test Structure
- `src/test/utils.test.ts` - Security utilities tests
- `src/test/auth.test.ts` - Authentication helpers tests
- Vitest configuration in `vitest.config.ts`
- Setup file in `src/test/setup.ts`

---

## 🚀 CI/CD Pipeline

### GitHub Actions
The project includes a comprehensive CI/CD pipeline in `.github/workflows/ci.yml`:

1. **Lint:** Runs ESLint on all code
2. **Test:** Executes Vitest test suite
3. **Build:** Builds the Next.js application
4. **Deploy:** Deploys to Vercel (on main branch)

### Required Secrets
Configure these in your GitHub repository settings:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection
- `NEXT_PUBLIC_APP_URL` - Application URL
- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

---

## 📚 API Documentation

### OpenAPI Specification
- Access at `/api/docs` (JSON)
- Interactive documentation at `/docs`
- Includes all authentication, analytics, and health endpoints
- Schema definitions for User, ApiResponse, Error

---

## 📱 PWA Support

### Installation
The app is installable as a Progressive Web App:
- Manifest at `/manifest.json`
- Service worker at `/sw.js`
- Automatic registration in production
- Offline support for cached pages

### Configuration
Customize PWA settings in `public/manifest.json`:
- App name and short name
- Theme colors
- Icons (add `icon-192.png` and `icon-512.png` to public/)
