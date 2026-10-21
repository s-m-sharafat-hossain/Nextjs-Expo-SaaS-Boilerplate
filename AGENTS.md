# Monorepo Architecture & Coding Standards (Feature-Based Modular MVC)

This repository is structured as a production monorepo containing:
- `apps/web`: Next.js 15+ Enterprise SaaS & Marketplace Boilerplate (App Router, Tailwind CSS, Prisma, Feature-Based Modular MVC)
- `apps/mobile`: Expo / React Native App (shares API routes and schemas with `apps/web`)

## Core Rules for `apps/web`
1. **Architecture Pattern:** Feature-Based Extended MVC (`Model -> Service -> Controller -> Route/View`).
2. **Feature Encapsulation:** Every business domain and role portal lives inside `apps/web/src/features/`:
   - `src/features/portals/admin-portal/` (Super Admin Governance)
   - `src/features/portals/provider-portal/` (Doctor / Vendor / Owner Partner)
   - `src/features/portals/consumer-portal/` (Patient / Customer / End-User)
   - Core Shared Modules: `auth/`, `workspaces/`, `billing/`, `credits/`, `ai-engine/`, `chat-n8n/`, `media/`, `reviews-disputes/`, `notifications-feedback/`
3. **Four Core Files per Feature:**
   - `<feature>.schema.ts` (Zod schemas, DTOs & validation)
   - `<feature>.repository.ts` (Prisma queries with Tenant & Role Isolation)
   - `<feature>.service.ts` (Business logic, commission calculations, external APIs)
   - `<feature>.action.ts` (Server Actions) & `<feature>.controller.ts` (REST handlers for `/api/v1/*` & mobile)
   - `<feature>.component.tsx` & `components/` (React Views)
4. **Unified Page Shell:** Always wrap dashboard views inside `StandardPageShell` from `@/shared/layouts/StandardPageShell`.
5. **Cross-Device Responsive Shell:** All dashboard routes render within `UnifiedDashboardLayout` featuring the 3-state navigation: Desktop (persistent), Tablet (collapsible mini), Mobile (off-canvas drawer).
6. **No Fat Controllers:** Never write Prisma queries or complex business logic directly inside `src/app/api/` routes or page components.
7. **Unified Response:** Always return `ApiResponse.success()` and `ApiResponse.error()` from `@/shared/utils/api-response`.
8. **Dynamic Role Terminology:** Never hardcode "Provider" or "Consumer". Use `useRoleTerminology()` from `@/shared/hooks/useRoleTerminology` or `siteConfig.roleLabels`.
9. **Central Design Tokens:** Never hardcode brand colors. Reference tokens from `@/shared/config/design.config`.
