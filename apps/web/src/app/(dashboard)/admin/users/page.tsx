// apps/web/src/app/(dashboard)/admin/users/page.tsx
"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  Zap,
  MoreVertical,
  CheckCircle2,
  Mail,
  Calendar,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROVIDER" | "CONSUMER";
  plan: string;
  credits: number;
  isActive: boolean;
  isBanned: boolean;
  kycStatus: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const terms = useRoleTerminology("ADMIN");
  const [activeView, setActiveView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "PROVIDER" | "CONSUMER">("ALL");
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: "usr-001",
      name: "Super Admin",
      email: "admin@demo.com",
      role: "ADMIN",
      plan: "ENTERPRISE",
      credits: 9999,
      isActive: true,
      isBanned: false,
      kycStatus: "APPROVED",
      createdAt: "2026-01-01",
    },
    {
      id: "usr-002",
      name: "Dr. Sarah Mitchell, MD",
      email: "provider@demo.com",
      role: "PROVIDER",
      plan: "PRO",
      credits: 120,
      isActive: true,
      isBanned: false,
      kycStatus: "APPROVED",
      createdAt: "2026-03-12",
    },
    {
      id: "usr-003",
      name: "Alex Morgan",
      email: "consumer@demo.com",
      role: "CONSUMER",
      plan: "FREE",
      credits: 35,
      isActive: true,
      isBanned: false,
      kycStatus: "NOT_SUBMITTED",
      createdAt: "2026-05-18",
    },
    {
      id: "usr-004",
      name: "Marcus Vance",
      email: "marcus@spammer.org",
      role: "CONSUMER",
      plan: "FREE",
      credits: 0,
      isActive: false,
      isBanned: true,
      kycStatus: "REJECTED",
      createdAt: "2026-09-02",
    },
  ]);

  const kpiStats = [
    {
      label: "Total Registered Accounts",
      value: users.length.toString(),
      change: "+12.4%",
      isPositive: true,
      subtext: "Across all 3 portals",
    },
    {
      label: `Active ${siteConfig.roleLabels.provider.plural}`,
      value: users.filter((u) => u.role === "PROVIDER" && !u.isBanned).length.toString(),
      change: "+2 this week",
      isPositive: true,
      subtext: "Verified practitioners",
    },
    {
      label: `Total ${siteConfig.roleLabels.consumer.plural}`,
      value: users.filter((u) => u.role === "CONSUMER").length.toString(),
      change: "+18%",
      isPositive: true,
      subtext: "Active patients & clients",
    },
    {
      label: "Suspended Accounts",
      value: users.filter((u) => u.isBanned).length.toString(),
      change: "Policy violations",
      isPositive: false,
      subtext: "Restricted platform access",
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleToggleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) => (prev ? { ...prev, isBanned: !prev.isBanned } : null));
    }
    setFeedbackMsg(`Account restriction state updated.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleAddCredits = (userId: string, delta: number) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, credits: Math.max(0, u.credits + delta) } : u))
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) =>
        prev ? { ...prev, credits: Math.max(0, prev.credits + delta) } : null
      );
    }
    setFeedbackMsg(`Credits updated (+${delta}).`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <StandardPageShell
      title="User & Provider Directory"
      description="Super Admin central governance directory: view platform users, manage permissions, review KYC status, and grant credits."
      breadcrumbs={[
        { label: "Governance", href: "/admin" },
        { label: "Users & Providers" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["table", "grid"]}
      onExport={(fmt) => alert(`Exporting user directory in ${fmt.toUpperCase()}...`)}
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Account Details & Governance"
      drawerContent={
        selectedUser ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-lg">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedUser.name}
                </h4>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    {selectedUser.role}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    Plan: {selectedUser.plan}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Credits & Balance Management
              </h5>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">AI & Platform Credits</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {selectedUser.credits}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAddCredits(selectedUser.id, 50)}
                    className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                  >
                    <Zap size={12} /> +50 Credits
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddCredits(selectedUser.id, 200)}
                    className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    +200
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Security & Access Control
              </h5>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
                <div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                    Account Status
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {selectedUser.isBanned
                      ? "User is suspended and prevented from logging in"
                      : "User has full portal access"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBan(selectedUser.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    selectedUser.isBanned
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {selectedUser.isBanned ? (
                    <>
                      <UserCheck size={14} /> Unban Account
                    </>
                  ) : (
                    <>
                      <UserX size={14} /> Ban User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          {(["ALL", "ADMIN", "PROVIDER", "CONSUMER"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleFilter === role
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              {role === "ALL"
                ? "All Accounts"
                : role === "PROVIDER"
                ? siteConfig.roleLabels.provider.plural
                : role === "CONSUMER"
                ? siteConfig.roleLabels.consumer.plural
                : "Admins"}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Credits</th>
                <th className="py-3 px-4">KYC State</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => {
                    setSelectedUser(u);
                    setDrawerOpen(true);
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                          {u.name}
                        </span>
                        <span className="text-[11px] text-slate-500">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                          : u.role === "PROVIDER"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {u.plan}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {u.credits}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.kycStatus === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : u.kycStatus === "PENDING"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {u.kycStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.isBanned ? (
                      <span className="text-red-600 dark:text-red-400 font-semibold inline-flex items-center gap-1">
                        <UserX size={12} /> Suspended
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                        <UserCheck size={12} /> Active
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(u);
                        setDrawerOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors text-xs font-medium"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StandardPageShell>
  );
}
