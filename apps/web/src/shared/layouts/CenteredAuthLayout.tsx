// apps/web/src/shared/layouts/CenteredAuthLayout.tsx
"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, Sun, Moon, Shield, Stethoscope, User, Zap } from "lucide-react";
import { siteConfig } from "@shared/config";
import { useTheme } from "@/shared/design/theme-provider";

export function CenteredAuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden antialiased">
      {/* Background subtle radial gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar Actions */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center mb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Sparkles size={20} />
            </div>
          </Link>
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Auth Form Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#111827] py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl">
          {children}

          {/* 1-Click Demo Accounts Quick Switcher Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Zap size={13} className="text-amber-500" />
                1-Click Portfolio Demo Login
              </span>
            </div>

            <div className="space-y-2">
              <Link
                href="/admin"
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-xs font-medium text-rose-800 dark:text-rose-300 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Shield size={14} className="text-rose-500" />
                  Super Admin Portal
                </span>
                <span className="text-[10px] text-rose-500">Instant Demo →</span>
              </Link>

              <Link
                href="/provider"
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-xs font-medium text-emerald-800 dark:text-emerald-300 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <Stethoscope size={14} className="text-emerald-500" />
                  {siteConfig.roleLabels.provider.singular} (Provider) Portal
                </span>
                <span className="text-[10px] text-emerald-500">Instant Demo →</span>
              </Link>

              <Link
                href="/consumer"
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs font-medium text-blue-800 dark:text-blue-300 transition-colors"
              >
                <span className="flex items-center gap-2 font-semibold">
                  <User size={14} className="text-blue-500" />
                  {siteConfig.roleLabels.consumer.singular} (Consumer) Portal
                </span>
                <span className="text-[10px] text-blue-500">Instant Demo →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
