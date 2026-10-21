// apps/web/src/shared/layouts/UnifiedDashboardLayout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Shield,
  Stethoscope,
  User,
  LayoutDashboard,
  Calendar,
  CreditCard,
  FileCheck,
  Star,
  Settings,
  HelpCircle,
  MessageSquare,
  Zap,
  Building2,
  CheckCircle2,
  LogOut,
  AlertCircle,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@shared/config";
import { useTheme } from "@/shared/design/theme-provider";
import { useRoleTerminology, RoleType } from "@/shared/hooks/useRoleTerminology";
import { CommandPalette } from "@/shared/components/CommandPalette";

interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

export function UnifiedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Mobile off-canvas drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  // Manual tablet mini-sidebar collapse override
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Command palette state
  const [commandOpen, setCommandOpen] = useState(false);
  // Notification popover state
  const [notificationOpen, setNotificationOpen] = useState(false);
  // Workspace dropdown state
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Determine active portal from URL pathname
  let currentRole: RoleType = "ADMIN";
  if (pathname.startsWith("/provider")) {
    currentRole = "PROVIDER";
  } else if (pathname.startsWith("/consumer")) {
    currentRole = "CONSUMER";
  }

  const terms = useRoleTerminology(currentRole);

  // Define Navigation links per portal
  const adminNav: NavItem[] = [
    { title: "Platform Overview", href: "/admin", icon: LayoutDashboard },
    { title: "Users & Providers", href: "/admin/users", icon: User },
    { title: "KYC Approvals", href: "/admin/kyc", icon: FileCheck, badge: "Pending" },
    { title: "Payout Approvals", href: "/admin/payouts", icon: CreditCard },
    { title: "TrxID & Payments", href: "/admin/transactions", icon: Zap },
    { title: "Disputes & Refunds", href: "/admin/disputes", icon: AlertCircle },
    { title: "System Settings", href: "/admin/settings", icon: Settings },
    { title: "Security & Audit", href: "/admin/audit", icon: Shield },
  ];

  const providerNav: NavItem[] = [
    { title: "Practice Overview", href: "/provider", icon: LayoutDashboard },
    { title: `${terms.serviceUnitName}s`, href: "/provider/services", icon: Layers },
    { title: "Appointments & Orders", href: "/provider/bookings", icon: Calendar, badge: "Live" },
    { title: "Slot Scheduler", href: "/provider/schedule", icon: Calendar },
    { title: `${terms.earningsUnitName} Wallet`, href: "/provider/payouts", icon: CreditCard },
    { title: "KYC Verification", href: "/provider/kyc", icon: FileCheck },
    { title: "Patient Reviews", href: "/provider/reviews", icon: Star },
    { title: "Practice Settings", href: "/provider/settings", icon: Settings },
  ];

  const consumerNav: NavItem[] = [
    { title: "Health Overview", href: "/consumer", icon: LayoutDashboard },
    { title: "Find & Book Doctor", href: "/consumer/explore", icon: Search },
    { title: "My Appointments", href: "/consumer/bookings", icon: Calendar, badge: "3" },
    { title: "AI Assistant Chat", href: "/consumer/chat", icon: MessageSquare, badge: "AI" },
    { title: "Wallet & Credits", href: "/consumer/credits", icon: Zap },
    { title: "Invoices & Receipts", href: "/consumer/billing", icon: CreditCard },
    { title: "Support & Tickets", href: "/consumer/support", icon: HelpCircle },
    { title: "Profile & Records", href: "/consumer/settings", icon: Settings },
  ];

  const currentNav =
    currentRole === "ADMIN"
      ? adminNav
      : currentRole === "PROVIDER"
      ? providerNav
      : consumerNav;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* TOP NOTIFICATION / DEMO ROLE SWITCHER BAR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <span className="font-semibold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-[10px]">
            ⚡ 1-Click Demo Switcher
          </span>
          <span className="text-white/80 hidden sm:inline">Active Portal:</span>
          <div className="flex items-center gap-1.5">
            <Link
              href="/admin"
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                currentRole === "ADMIN"
                  ? "bg-white text-blue-900 shadow-sm font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              🛡️ Super Admin
            </Link>
            <Link
              href="/provider"
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                currentRole === "PROVIDER"
                  ? "bg-white text-emerald-900 shadow-sm font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              🩺 {terms.providerLabel} Portal
            </Link>
            <Link
              href="/consumer"
              className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                currentRole === "CONSUMER"
                  ? "bg-white text-purple-900 shadow-sm font-bold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              👤 {terms.consumerLabel} Portal
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-white/90 text-xs">
          <span>Enterprise Modular MVC Architecture</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>v1.0.0</span>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* ───────────────────────────────────────────────────────────── */}
        {/* 1. DESKTOP & TABLET SIDEBAR */}
        {/* ───────────────────────────────────────────────────────────── */}
        <aside
          className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#111827] transition-all duration-300 z-20 shrink-0 ${
            isCollapsed ? "w-[72px]" : "w-[260px]"
          }`}
        >
          {/* Logo & Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800/80">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm text-white font-bold">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm truncate text-slate-900 dark:text-slate-100">
                    {siteConfig.shortName}
                  </span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium truncate">
                    {terms.currentRoleTitle}
                  </span>
                </div>
              )}
            </Link>

            {/* Tablet Mini-collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Current Workspace Switcher */}
          {!isCollapsed ? (
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/60">
              <button
                onClick={() => setWorkspaceOpen(!workspaceOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-semibold text-xs">
                    <Building2 size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                      Apex Global Health
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">Production Workspace</p>
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
              </button>
            </div>
          ) : (
            <div className="py-3 flex justify-center border-b border-slate-100 dark:border-slate-800/60">
              <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-xs">
                <Building2 size={16} />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-2">
                Navigation
              </p>
            )}

            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  item.href !== "/provider" &&
                  item.href !== "/consumer" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon size={18} className="shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">{item.title}</span>}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer User Profile & Credits */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800/80">
            {!isCollapsed ? (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {currentRole === "ADMIN" ? "AD" : currentRole === "PROVIDER" ? "DR" : "PT"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                    {currentRole === "ADMIN"
                      ? "Super Admin"
                      : currentRole === "PROVIDER"
                      ? "Dr. Sarah Mitchell"
                      : "Alex Morgan"}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate flex items-center gap-1">
                    <CheckCircle2 size={11} /> {terms.currentRoleTitle}
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  title="Logout / Exit Portal"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentRole[0]}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. MOBILE OFF-CANVAS DRAWER WITH BACKDROP BLUR */}
        {/* ───────────────────────────────────────────────────────────── */}
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileDrawerOpen(false)}
            />

            {/* Drawer Panel */}
            <div className="relative w-[280px] max-w-[85vw] bg-white dark:bg-[#111827] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 border-r border-slate-200 dark:border-slate-800">
              <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm">{siteConfig.shortName}</h2>
                    <p className="text-[11px] text-blue-600 font-medium">{terms.currentRoleTitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 font-medium hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  <span>Exit to Public Homepage</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. MAIN DASHBOARD CONTENT AREA & TOPBAR */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOPBAR */}
          <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md sticky top-0 z-10 px-4 sm:px-6 flex items-center justify-between gap-4">
            {/* Left: Mobile Hamburger & Search Trigger */}
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>

              {/* Cmd+K Search Bar Trigger */}
              <button
                onClick={() => setCommandOpen(true)}
                className="w-full max-w-sm flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-400 text-xs transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">Quick jump or search...</span>
                </div>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Actions, Theme Toggle, Notification Bell, User Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Role Indicator Badge */}
              <span
                className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  currentRole === "ADMIN"
                    ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                    : currentRole === "PROVIDER"
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                    : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {terms.currentRoleTitle} Portal
              </span>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
                  title="Notifications"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                </button>

                {/* Notification Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-semibold">
                      <span>Notifications</span>
                      <span className="text-[10px] text-blue-600 cursor-pointer">Mark all read</span>
                    </div>
                    <div className="py-2 space-y-2">
                      <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/30">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          Welcome to MasterFlow! 🎉
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          Your workspace is active and ready for cross-device operations.
                        </p>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          KYC Verification Ready
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          2 provider compliance records are awaiting admin approval.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentRole[0]}
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Global Cmd+K Command Palette Modal */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
