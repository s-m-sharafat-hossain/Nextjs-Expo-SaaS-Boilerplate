// apps/web/src/app/(dashboard)/layout.tsx
import { UnifiedDashboardLayout } from "@/shared/layouts/UnifiedDashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UnifiedDashboardLayout>{children}</UnifiedDashboardLayout>;
}
