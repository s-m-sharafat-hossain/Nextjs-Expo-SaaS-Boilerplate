# Super Admin Master Governance & Setup Guide

## 1. Overview
The **SUPER_ADMIN** role represents the highest level of administrative authority ("Apex Privilege") in the MasterFlow SaaS & Marketplace ecosystem. It provides root platform governance, platform settings controls, emergency switches (maintenance mode, registration lock), elevated admin account management, and an immutable audit trail across both `apps/web` and `apps/mobile`.

---

## 2. Default Seed Credentials
The database seed script (`apps/web/prisma/seed.ts`) automatically initializes the default Super Admin:

- **Email:** `superadmin@masterflow.io`
- **Password:** `SuperAdmin123!`
- **Role:** `SUPER_ADMIN`
- **Plan:** `AGENCY`
- **Credits:** `999,999`
- **Portal URL (Web):** `/super-admin`
- **Mobile Access:** Automatically routes to `SuperAdminPortalScreen` upon login.

---

## 3. Strict Security Rules Enforced in Code Logic
1. **Immutable Super Admin Accounts:**
   - A `SUPER_ADMIN` user cannot be deleted by anyone (including other admins or via public APIs).
   - A `SUPER_ADMIN` user cannot be demoted to any lower role (`ADMIN`, `PROVIDER`, `CONSUMER`).
   - A `SUPER_ADMIN` user cannot be banned, suspended, or deactivated.
2. **Elevated Privilege Isolation:**
   - Only a authenticated `SUPER_ADMIN` can promote users to `ADMIN` or create additional `SUPER_ADMIN` accounts.
   - Regular `ADMIN` accounts are strictly restricted from accessing `/super-admin` routes or `/api/v1/super-admin/*` endpoints.
3. **Immutable Audit Trail:**
   - All actions executed by a `SUPER_ADMIN` are immutably logged into `prisma.auditLog` with action tags (`SUPER_ADMIN_UPDATE_PLATFORM_SETTINGS`, `SUPER_ADMIN_PROMOTE_USER`, etc.), actor ID, IP address, user agent, and before/after details.
4. **Unlimited Rate Limiting Bypass:**
   - `SUPER_ADMIN` requests automatically bypass Redis/in-memory rate limiters across all API routes (`/api/v1/*`), returning a pseudo-infinite limit (999,999 req/min).
5. **Maintenance Mode Bypass:**
   - When platform maintenance mode is toggled `ON`, regular consumers and providers receive a maintenance notice and cannot access protected operations. `SUPER_ADMIN` accounts bypass maintenance mode unconditionally.
6. **Platform Parameters Authority:**
   - Only `SUPER_ADMIN` can edit `PlatformSettings`: platform name, fee commission %, minimum payout threshold, default signup plan, free credits, and mandatory KYC requirements.

---

## 4. Architecture & File Structure
```
apps/web/src/features/portals/super-admin-portal/
├── super-admin.schema.ts              # Zod validation schemas & TypeScript types
├── super-admin.repository.ts          # Database queries & platform metrics aggregation
├── super-admin.service.ts             # Governance business logic & audit recording
├── super-admin.controller.ts          # REST endpoint handlers with role validation
└── super-admin-dashboard.component.tsx# Next.js interactive governance dashboard

apps/web/src/app/(dashboard)/super-admin/
└── page.tsx                          # Dashboard route wrapped in StandardPageShell

apps/web/src/app/api/v1/super-admin/
├── route.ts                          # GET (dashboard data) & POST (action dispatcher)
└── users/route.ts                    # GET (paginated user search for promotions)

apps/mobile/src/features/portals/super-admin-portal/
├── super-admin.service.ts            # Mobile API integration client
├── super-admin.controller.ts         # React Native hook with state & actions
└── super-admin.screen.tsx            # Native mobile governance screen
```

---

## 5. API Endpoints

### `GET /api/v1/super-admin`
Retrieves aggregated governance statistics, active platform settings, all administrators, and recent audit trail entries.
- **Header:** Session cookie or Bearer auth token required.
- **Authorization:** `role === "SUPER_ADMIN"`.

### `POST /api/v1/super-admin`
Dispatches administrative actions.
- **Payload Examples:**
  - **Update Platform Settings:**
    ```json
    {
      "action": "UPDATE_SETTINGS",
      "data": {
        "platformName": "MasterFlow SaaS",
        "maintenanceMode": true,
        "maintenanceMessage": "Scheduled upgrade in progress",
        "platformFeePercent": 7.5,
        "minPayoutAmount": 100.0
      }
    }
    ```
  - **Manage Admin User:**
    ```json
    {
      "action": "MANAGE_ADMIN",
      "data": {
        "targetUserId": "user_cuid",
        "action": "SUSPEND"
      }
    }
    ```
  - **Promote User:**
    ```json
    {
      "action": "PROMOTE_USER",
      "data": {
        "userId": "user_cuid",
        "role": "ADMIN",
        "reason": "Security operations lead promotion"
      }
    }
    ```

### `GET /api/v1/super-admin/users?search=<query>&page=1&limit=20`
Searches users across the database for administrative review and promotion.

---

## 6. Database Synchronization & Seeding Commands
```bash
# Push schema updates to PostgreSQL (Neon)
npm run db:push

# Seed default Super Admin user and initial PlatformSettings
npm run db:seed
```
