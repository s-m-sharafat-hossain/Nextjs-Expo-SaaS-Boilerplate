// apps/web/src/app/(dashboard)/admin/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileCheck,
  TrendingUp,
  Download,
  Filter,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState<"table" | "grid">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedKyc, setSelectedKyc] = useState<any>(null);

  const kpiStats = [
    {
      label: "Platform Revenue (Gross)",
      value: "$42,850",
      change: "+18.2%",
      isPositive: true,
      subtext: "15% platform commission cut",
    },
    {
      label: `Active ${siteConfig.roleLabels.provider.plural}`,
      value: "148",
      change: "+12",
      isPositive: true,
      subtext: "12 awaiting KYC review",
    },
    {
      label: `Total ${siteConfig.roleLabels.consumer.plural}`,
      value: "2,420",
      change: "+24.5%",
      isPositive: true,
      subtext: "Registered active accounts",
    },
    {
      label: "Escrow & Payout Queue",
      value: "$3,640",
      change: "4 pending",
      isPositive: false,
      subtext: "Manual TrxID & bank requests",
    },
  ];

  const pendingKycs = [
    {
      id: "kyc-001",
      providerName: "Dr. Sarah Mitchell, MD",
      email: "provider@demo.com",
      licenseNumber: "MED-NY-849201",
      documentType: "Medical License & Board Cert",
      submittedAt: "2026-10-20",
      status: "PENDING",
    },
    {
      id: "kyc-002",
      providerName: "Dr. David Chen, MD",
      email: "david.chen@clinic.org",
      licenseNumber: "MED-CA-192834",
      documentType: "State Board License",
      submittedAt: "2026-10-19",
      status: "PENDING",
    },
  ];

  return (
    <StandardPageShell
      title={siteConfig.roleLabels.admin.portalTitle}
      description="Super Admin platform control center: manage verified practitioners, approve KYC credentials, and oversee escrow payments."
      breadcrumbs={[
        { label: "Governance", href: "/admin" },
        { label: "Overview" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["table", "grid"]}
      onExport={(fmt) => alert(`Exporting administrative records in ${fmt.toUpperCase()} format...`)}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/kyc"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <FileCheck size={14} /> Review KYC Queue
          </Link>
        </div>
      }
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="KYC Credential Verification"
      drawerContent={
        selectedKyc && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Practitioner Name</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedKyc.providerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">License Number</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedKyc.licenseNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Document Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedKyc.documentType}
                </span>
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center">
              <p className="text-slate-400">Previewing Verified Practitioner Medical Credential</p>
              <div className="mt-3 inline-block px-3 py-1 rounded bg-blue-50 text-blue-600 font-mono text-[11px]">
                medical-license-front-ny-849201.pdf
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => {
                  alert("KYC Approved successfully!");
                  setDrawerOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 size={15} /> Approve Credential
              </button>
              <button
                onClick={() => {
                  alert("KYC Rejected.");
                  setDrawerOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle size={15} /> Reject Credential
              </button>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* Pending KYC Approval Table */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pending {siteConfig.roleLabels.provider.singular} Verification Queue
              </h2>
              <p className="text-xs text-slate-500">
                Identity and compliance verification required before enabling public listings.
              </p>
            </div>
            <Link
              href="/admin/kyc"
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View all ({pendingKycs.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Practitioner</th>
                  <th className="px-5 py-3">License & Credential</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pendingKycs.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                      <div>{item.providerName}</div>
                      <div className="text-[11px] text-slate-400">{item.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <div>{item.documentType}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.licenseNumber}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{item.submittedAt}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedKyc(item);
                          setDrawerOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
