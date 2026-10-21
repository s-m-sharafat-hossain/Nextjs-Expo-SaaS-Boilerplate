# Project Architecture & Coding Standards (Feature-Based Modular MVC)

Always follow these strict rules when generating or modifying code in this repository:

1. **Architecture Pattern:** Feature-Based Extended MVC (`Model -> Service -> Controller -> Route/View`).
2. **Feature Encapsulation:** Every business domain and role portal lives inside `src/features/`:
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

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
