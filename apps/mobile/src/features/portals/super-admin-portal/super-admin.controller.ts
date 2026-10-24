// apps/mobile/src/features/portals/super-admin-portal/super-admin.controller.ts
import { useState, useEffect, useCallback } from "react";
import { SuperAdminMobileService, SuperAdminDashboardData } from "./super-admin.service";

export type SuperAdminTab = "metrics" | "settings" | "admins" | "audit";

export function useSuperAdminController() {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>("metrics");
  const [data, setData] = useState<SuperAdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await SuperAdminMobileService.getDashboard();
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load super admin data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleMaintenanceMode = async () => {
    if (!data?.settings) return;
    try {
      setIsSubmitting(true);
      const nextVal = !data.settings.maintenanceMode;
      await SuperAdminMobileService.updateSettings({ maintenanceMode: nextVal });
      setSuccessMessage(`Maintenance mode ${nextVal ? "ENABLED" : "DISABLED"}`);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to toggle maintenance mode");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRegistration = async () => {
    if (!data?.settings) return;
    try {
      setIsSubmitting(true);
      const nextVal = !data.settings.registrationEnabled;
      await SuperAdminMobileService.updateSettings({ registrationEnabled: nextVal });
      setSuccessMessage(`Registration ${nextVal ? "OPENED" : "LOCKED"}`);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Failed to toggle registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const manageAdmin = async (userId: string, action: string, creditsDelta?: number) => {
    try {
      setIsSubmitting(true);
      await SuperAdminMobileService.manageAdmin(userId, action, creditsDelta);
      setSuccessMessage(`Action ${action} executed`);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    data,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    loadData,
    toggleMaintenanceMode,
    toggleRegistration,
    manageAdmin,
  };
}
