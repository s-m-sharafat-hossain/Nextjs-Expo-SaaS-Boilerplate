// apps/web/src/features/portals/super-admin-portal/super-admin-dashboard.component.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Settings,
  Users,
  AlertTriangle,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  DollarSign,
  Activity,
  Layers,
  ArrowUpRight,
  UserPlus,
  Coins,
  FileText,
  UserX,
  UserCheck,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";

interface PlatformStats {
  totalUsers: number;
  superAdminsCount: number;
  adminsCount: number;
  providersCount: number;
  consumersCount: number;
  totalWorkspaces: number;
  activeSessionsCount: number;
  totalAuditLogs: number;
  grossVolume: number;
  estimatedPlatformFees: number;
  completedTransactionsCount: number;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
}

interface PlatformSettingsData {
  id: string;
  platformName: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  registrationEnabled: boolean;
  defaultPlan: string;
  maxFreeCredits: number;
  platformFeePercent: number;
  minPayoutAmount: number;
  kycRequired: boolean;
  termsRequired: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN";
  plan: string;
  credits: number;
  isActive: boolean;
  isBanned: boolean;
  image: string | null;
  createdAt: string;
  _count?: {
    managedWorkspaces: number;
    auditLogs: number;
  };
}

interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function SuperAdminDashboardComponent() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [settings, setSettings] = useState<PlatformSettingsData | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "admins" | "promote" | "audit">("overview");

  // User search & promote state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [promoteRole, setPromoteRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [promoteReason, setPromoteReason] = useState("");

  // Feedback notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/super-admin");
      const json = await res.json();
      if (json.success && json.data) {
        setStats(json.data.stats);
        setSettings(json.data.settings);
        setAdmins(json.data.admins);
        setAuditLogs(json.data.recentLogs);
      } else {
        setNotification({ type: "error", message: json.error?.message || "Failed to load super admin data" });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Network error loading dashboard" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_SETTINGS",
          data: {
            platformName: settings.platformName,
            maintenanceMode: settings.maintenanceMode,
            maintenanceMessage: settings.maintenanceMessage,
            registrationEnabled: settings.registrationEnabled,
            defaultPlan: settings.defaultPlan,
            maxFreeCredits: Number(settings.maxFreeCredits),
            platformFeePercent: Number(settings.platformFeePercent),
            minPayoutAmount: Number(settings.minPayoutAmount),
            kycRequired: settings.kycRequired,
            termsRequired: settings.termsRequired,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNotification({ type: "success", message: "Platform settings updated and logged successfully" });
        fetchDashboardData();
      } else {
        setNotification({ type: "error", message: json.error?.message || "Failed to update settings" });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminAction = async (targetUserId: string, action: string, creditsDelta?: number) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "MANAGE_ADMIN",
          data: {
            targetUserId,
            action,
            creditsDelta,
            reason: `Executed by Super Admin via Governance Console (${action})`,
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNotification({ type: "success", message: `Action ${action} executed successfully` });
        fetchDashboardData();
      } else {
        setNotification({ type: "error", message: json.error?.message || "Action failed" });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      setSearchLoading(true);
      const res = await fetch(`/api/v1/super-admin/users?search=${encodeURIComponent(searchQuery)}&limit=10`);
      const json = await res.json();
      if (json.success) {
        setSearchResults(json.data.items || []);
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Error searching users" });
    } finally {
      setSearchLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    if (!selectedUser) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "PROMOTE_USER",
          data: {
            userId: selectedUser.id,
            role: promoteRole,
            reason: promoteReason || "Promoted via Super Admin Governance Panel",
          },
        }),
      });

      const json = await res.json();
      if (json.success) {
        setNotification({
          type: "success",
          message: `User ${selectedUser.email} successfully promoted to ${promoteRole}`,
        });
        setSelectedUser(null);
        setSearchQuery("");
        setSearchResults([]);
        fetchDashboardData();
      } else {
        setNotification({ type: "error", message: json.error?.message || "Promotion failed" });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const kpiStats = [
    {
      label: "Platform Gross Volume",
      value: stats ? `$${stats.grossVolume.toLocaleString()}` : "$0",
      change: `${stats?.completedTransactionsCount || 0} orders`,
      isPositive: true,
      subtext: `Est. fee income: $${(stats?.estimatedPlatformFees || 0).toLocaleString()}`,
    },
    {
      label: "Super Admins / Admins",
      value: `${stats?.superAdminsCount || 0} / ${stats?.adminsCount || 0}`,
      change: "Governance",
      isPositive: true,
      subtext: "Elevated privilege accounts",
    },
    {
      label: "Total Registered Users",
      value: stats ? stats.totalUsers.toLocaleString() : "0",
      change: `${stats?.providersCount || 0} P / ${stats?.consumersCount || 0} C`,
      isPositive: true,
      subtext: "Across providers and consumers",
    },
    {
      label: "Platform State",
      value: settings?.maintenanceMode ? "MAINTENANCE" : "OPERATIONAL",
      change: settings?.registrationEnabled ? "Registrations Open" : "Registrations Locked",
      isPositive: !settings?.maintenanceMode,
      subtext: settings?.maintenanceMode ? "Platform locked to public" : "All services healthy",
    },
  ];

  return (
    <StandardPageShell
      title="Super Admin Master Governance"
      description="Apex administrative control: platform-wide settings, rate-limit overrides, admin role management, and immutable audit logs."
      breadcrumbs={[
        { label: "Super Admin", href: "/super-admin" },
        { label: "Platform Governance" },
      ]}
      kpiStats={kpiStats}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <ShieldAlert size={14} />
            Apex Privilege
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Banner Alert for Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs font-medium ${
              notification.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Maintenance Mode Warning Ribbon if Active */}
        {settings?.maintenanceMode && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold uppercase tracking-wider">Maintenance Mode is Active:</span> All non-Super Admin users are restricted from dashboard actions. Message: &quot;{settings.maintenanceMessage}&quot;
            </div>
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {[
            { id: "overview", label: "Overview & Controls", icon: Activity },
            { id: "settings", label: "Platform Settings", icon: Settings },
            { id: "admins", label: "Admin Directory", icon: Users },
            { id: "promote", label: "Promote Users", icon: UserPlus },
            { id: "audit", label: "Audit Logs", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & RAPID CONTROLS */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rapid Maintenance Mode Toggle */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Maintenance Mode
                    </h3>
                    <p className="text-[11px] text-slate-500">Emergency platform lockout</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    settings?.maintenanceMode
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                  }`}
                >
                  {settings?.maintenanceMode ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                When enabled, all normal consumers and providers are locked out with a maintenance landing page. Super Admins bypass this automatically.
              </p>
              <button
                onClick={() => {
                  if (settings) {
                    setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode });
                  }
                  setActiveTab("settings");
                }}
                className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                Configure Maintenance Settings
              </button>
            </div>

            {/* Registration Switcher */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      User Registration
                    </h3>
                    <p className="text-[11px] text-slate-500">Sign-up availability</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    settings?.registrationEnabled
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                  }`}
                >
                  {settings?.registrationEnabled ? "OPEN" : "LOCKED"}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Controls whether new visitors can create accounts or if onboarding is invite-only/closed for testing.
              </p>
              <button
                onClick={() => {
                  if (settings) {
                    setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled });
                  }
                  setActiveTab("settings");
                }}
                className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                Toggle Registration Mode
              </button>
            </div>

            {/* Quick Super Admin Rules Card */}
            <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Apex Security Guarantees
                </h3>
              </div>
              <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 list-disc list-inside">
                <li>SUPER_ADMIN accounts cannot be deleted or demoted.</li>
                <li>Unlimited rate limiting bypass on all API routes.</li>
                <li>Maintenance mode bypass automatic on all routes.</li>
                <li>Immutable audit trail logs every administrative write.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: PLATFORM SETTINGS */}
        {activeTab === "settings" && settings && (
          <form onSubmit={handleUpdateSettings} className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Platform-Wide Global Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Changes made here take effect globally across the web app, mobile app, and API layer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Default Plan for New Users
                </label>
                <select
                  value={settings.defaultPlan}
                  onChange={(e) => setSettings({ ...settings, defaultPlan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value="FREE">FREE</option>
                  <option value="STARTER">STARTER</option>
                  <option value="PRO">PRO</option>
                  <option value="AGENCY">AGENCY</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Free Credits on Signup
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.maxFreeCredits}
                  onChange={(e) => setSettings({ ...settings, maxFreeCredits: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Platform Fee / Commission (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.platformFeePercent}
                  onChange={(e) => setSettings({ ...settings, platformFeePercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minimum Payout Threshold ($)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={settings.minPayoutAmount}
                  onChange={(e) => setSettings({ ...settings, minPayoutAmount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Maintenance Message
                </label>
                <input
                  type="text"
                  value={settings.maintenanceMessage || ""}
                  onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  placeholder="We are undergoing scheduled platform maintenance..."
                />
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Maintenance Mode</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Registration Enabled</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.kycRequired}
                  onChange={(e) => setSettings({ ...settings, kycRequired: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">KYC Required for Listings</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.termsRequired}
                  onChange={(e) => setSettings({ ...settings, termsRequired: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-slate-800 dark:text-slate-200">Mandatory Terms Acceptance</span>
              </label>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-2"
              >
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <SaveIcon />}
                Save Platform Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ADMIN USER DIRECTORY */}
        {activeTab === "admins" && (
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Elevated Governance Accounts ({admins.length})
                </h2>
                <p className="text-xs text-slate-500">
                  All users holding SUPER_ADMIN or ADMIN privileges. SUPER_ADMIN roles are permanently protected.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Administrator</th>
                    <th className="px-5 py-3">Role</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Credits</th>
                    <th className="px-5 py-3">Workspaces</th>
                    <th className="px-5 py-3 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{admin.name}</div>
                        <div className="text-[11px] text-slate-400">{admin.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            admin.role === "SUPER_ADMIN"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {admin.isBanned ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-700 dark:text-slate-300 font-mono">
                        {admin.credits}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {admin._count?.managedWorkspaces || 0}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {admin.role === "SUPER_ADMIN" ? (
                          <span className="text-[11px] text-slate-400 italic">Protected (Apex)</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleAdminAction(admin.id, "ADJUST_CREDITS", 100)}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                              title="Add 100 Credits"
                            >
                              +100 Cr
                            </button>
                            {admin.isBanned ? (
                              <button
                                onClick={() => handleAdminAction(admin.id, "ACTIVATE")}
                                className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold"
                              >
                                Activate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAdminAction(admin.id, "SUSPEND")}
                                className="px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 text-[11px] font-semibold"
                              >
                                Suspend
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm(`Demote ${admin.email} from Admin to regular User?`)) {
                                  handleAdminAction(admin.id, "DEMOTE_TO_USER");
                                }
                              }}
                              className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-semibold"
                            >
                              Demote
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PROMOTE USERS */}
        {activeTab === "promote" && (
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Promote Existing User to Administrative Tier
              </h2>
              <p className="text-xs text-slate-500">
                Search for any registered user by email or name to elevate their permissions to ADMIN or SUPER_ADMIN.
              </p>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search user by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="button"
                onClick={handleSearchUsers}
                disabled={searchLoading}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                {searchLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-2.5">User</th>
                      <th className="px-4 py-2.5">Current Role</th>
                      <th className="px-4 py-2.5">Plan</th>
                      <th className="px-4 py-2.5 text-right">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((u) => (
                      <tr
                        key={u.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          selectedUser?.id === u.id ? "bg-purple-50 dark:bg-purple-950/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{u.plan}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold"
                          >
                            {selectedUser?.id === u.id ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Promotion Form */}
            {selectedUser && (
              <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-4 text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Target Account: {selectedUser.name} ({selectedUser.email})
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Role Assignment
                    </label>
                    <select
                      value={promoteRole}
                      onChange={(e) => setPromoteRole(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Apex)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Governance Justification (Audit Logged)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Promoted for security operations oversight"
                      value={promoteReason}
                      onChange={(e) => setPromoteReason(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePromoteUser}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
                  >
                    {isSubmitting ? "Processing..." : `Confirm Elevation to ${promoteRole}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: IMMUTABLE AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Platform Security & Governance Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Append-only, immutable activity log recording all security events, role elevations, and platform toggles.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Entity</th>
                    <th className="px-4 py-3">Actor / Operator</th>
                    <th className="px-4 py-3">IP & Origin</th>
                    <th className="px-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-purple-600 dark:text-purple-400">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {log.entity} {log.entityId ? `(#${log.entityId.slice(0, 8)})` : ""}
                      </td>
                      <td className="px-4 py-3">
                        {log.user ? (
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {log.user.name}
                            </span>
                            <div className="text-[10px] text-slate-400">{log.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">System</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {log.ipAddress || "Internal"}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate text-[11px] text-slate-600 dark:text-slate-400">
                        {log.details ? JSON.stringify(log.details) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </StandardPageShell>
  );
}

function SaveIcon() {
  return (
    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}
