import React from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { AdminPortalScreen } from "@/features/portals/admin-portal/admin.screen";
import { SuperAdminPortalScreen } from "@/features/portals/super-admin-portal/super-admin.screen";
import { ProviderPortalScreen } from "@/features/portals/provider-portal/provider.screen";
import { ConsumerPortalScreen } from "@/features/portals/consumer-portal/consumer.screen";

export default function HomeScreen() {
  const { activeRole } = useAuthStore();

  if (activeRole === "SUPER_ADMIN") {
    return <SuperAdminPortalScreen />;
  }

  if (activeRole === "ADMIN") {
    return <AdminPortalScreen />;
  }

  if (activeRole === "PROVIDER") {
    return <ProviderPortalScreen />;
  }

  return <ConsumerPortalScreen />;
}
