// apps/web/src/app/(dashboard)/super-admin/page.tsx
import { SuperAdminDashboardComponent } from "@/features/portals/super-admin-portal/super-admin-dashboard.component";

export const metadata = {
  title: "Super Admin Platform Governance | MasterFlow SaaS",
  description: "Apex administrative control and platform configuration console",
};

export default function SuperAdminPage() {
  return <SuperAdminDashboardComponent />;
}
