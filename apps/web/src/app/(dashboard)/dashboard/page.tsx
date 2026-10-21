// apps/web/src/app/(dashboard)/dashboard/page.tsx
"use client";

import Link from "next/link";
import { Shield, Stethoscope, User, ArrowRight, Sparkles, Zap } from "lucide-react";
import { siteConfig } from "@shared/config";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";

export default function DashboardPortalHubPage() {
  return (
    <StandardPageShell
      title="Three-Portal Master Architecture Hub"
      description="Choose your portal role or use the 1-Click switcher in the top bar to test the full client workflows."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Role Portal Hub" },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
        {/* Admin Portal Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">
              Platform Governance
            </span>
            <h2 className="text-lg font-bold mt-1 text-slate-900 dark:text-slate-100">
              {siteConfig.roleLabels.admin.portalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Super Admin controls: KYC approval queue, practitioner licensing verification, payout request audits, and platform financial ledger.
            </p>
          </div>

          <Link
            href="/admin"
            className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Launch Admin Portal</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Provider Portal Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Stethoscope size={24} />
            </div>
            <span className="text-xs uppercase font-bold text-emerald-500 tracking-wider">
              {siteConfig.roleLabels.provider.badge}
            </span>
            <h2 className="text-lg font-bold mt-1 text-slate-900 dark:text-slate-100">
              {siteConfig.roleLabels.provider.portalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Doctor & Vendor management: listing CRUD, working hours slot scheduler, video tele-health appointments, and commission earnings wallet.
            </p>
          </div>

          <Link
            href="/provider"
            className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Launch {siteConfig.roleLabels.provider.singular} Portal</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Consumer Portal Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <User size={24} />
            </div>
            <span className="text-xs uppercase font-bold text-blue-500 tracking-wider">
              End-User Experience
            </span>
            <h2 className="text-lg font-bold mt-1 text-slate-900 dark:text-slate-100">
              {siteConfig.roleLabels.consumer.portalTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Patient & Customer portal: specialist marketplace search, step-by-step visual booking tracker, AI clinical chat triage, and downloadable PDF receipts.
            </p>
          </div>

          <Link
            href="/consumer"
            className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <span>Launch {siteConfig.roleLabels.consumer.singular} Portal</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </StandardPageShell>
  );
}
