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

  const manageAdmin = async (userId: string, action: string, options?: { creditsDelta?: number; newPassword?: string; reason?: string }) => {
    try {
      setIsSubmitting(true);
      await SuperAdminMobileService.manageAdmin(userId, action as any, options);
      setSuccessMessage(`Action ${action} executed successfully`);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activateAdmin = (userId: string) => manageAdmin(userId, "ACTIVATE");
  const deactivateAdmin = (userId: string) => manageAdmin(userId, "DEACTIVATE");
  const deleteAdmin = (userId: string) => manageAdmin(userId, "DELETE");
  const resetPassword = (userId: string, newPassword?: string) =>
    manageAdmin(userId, "RESET_PASSWORD", { newPassword });

  const promoteUser = async (userId: string, role: string, reason?: string) => {
    try {
      setIsSubmitting(true);
      await SuperAdminMobileService.promoteUser(userId, role, reason);
      setSuccessMessage(`User elevated to ${role}`);
      await loadData();
    } catch (err: any) {
      setError(err?.message || "Promotion failed");
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
    activateAdmin,
    deactivateAdmin,
    deleteAdmin,
    resetPassword,
    promoteUser,
  };
}
