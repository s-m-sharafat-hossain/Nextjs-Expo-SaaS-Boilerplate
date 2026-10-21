// apps/web/src/shared/layouts/PublicLandingLayout.tsx
"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Sun, Moon, Shield, Stethoscope, User, Zap } from "lucide-react";
import { siteConfig } from "@shared/config";
import { useTheme } from "@/shared/design/theme-provider";

export function PublicLandingLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* 1-Click Role Switcher Demo Top Banner */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="bg-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live Portfolio Demo
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Explore 3 Dedicated Role Portals:
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-rose-400 font-medium transition-colors"
          >
            🛡️ Admin Portal
          </Link>
          <Link
            href="/provider"
            className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium transition-colors"
          >
            🩺 {siteConfig.roleLabels.provider.singular} Portal
          </Link>
          <Link
            href="/consumer"
            className="px-2.5 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium transition-colors"
          >
            👤 {siteConfig.roleLabels.consumer.singular} Portal
          </Link>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link href="/consumer/explore" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Marketplace
            </Link>
            <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Pricing Plans
            </Link>
            <Link href="/docs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              API Docs
            </Link>
            <Link href="/changelog" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Changelog
            </Link>
          </nav>

          {/* CTA & Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/30"
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080c14] py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              MF
            </div>
            <p className="text-xs text-slate-500">
              © 2026 {siteConfig.name}. Production-grade Modular SaaS & Marketplace Boilerplate.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
            <Link href="/docs" className="hover:underline">OpenAPI Swagger</Link>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
