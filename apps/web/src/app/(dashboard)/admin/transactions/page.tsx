// apps/web/src/app/(dashboard)/admin/transactions/page.tsx
"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Zap,
  Filter,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";

interface TrxItem {
  id: string;
  invoiceNumber: string;
  customerName: string;
  email: string;
  amount: number;
  currency: string;
  gateway: string;
  manualTrxId?: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const [activeView, setActiveView] = useState<"table" | "grid">("table");
  const [selectedTrx, setSelectedTrx] = useState<TrxItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<TrxItem[]>([
    {
      id: "trx-501",
      invoiceNumber: "INV-2026-8812",
      customerName: "Alex Morgan",
      email: "consumer@demo.com",
      amount: 49.0,
      currency: "USD",
      gateway: "BKASH",
      manualTrxId: "BK99281903",
      status: "PENDING",
      createdAt: "2026-10-21 10:15",
    },
    {
      id: "trx-502",
      invoiceNumber: "INV-2026-8810",
      customerName: "Tariqul Islam",
      email: "tariqul@demo.com",
      amount: 150.0,
      currency: "USD",
      gateway: "CRYPTO",
      manualTrxId: "0x4f82c819a0094192b0c",
      status: "PENDING",
      createdAt: "2026-10-21 09:30",
    },
    {
      id: "trx-503",
      invoiceNumber: "INV-2026-8799",
      customerName: "Sophia Wang",
      email: "sophia.w@tech.co",
      amount: 120.0,
      currency: "USD",
      gateway: "STRIPE",
      status: "COMPLETED",
      createdAt: "2026-10-20 15:40",
    },
  ]);

  const kpiStats = [
    {
      label: "Pending Manual TrxIDs",
      value: transactions.filter((t) => t.status === "PENDING").length.toString(),
      change: "bKash / Crypto queue",
      isPositive: false,
      subtext: "Requires ledger verification",
    },
    {
      label: "Settled Volume Today",
      value: "$120.00",
      change: "+15.2%",
      isPositive: true,
      subtext: "Auto-verified via Stripe",
    },
    {
      label: "Total Transactions",
      value: transactions.length.toString(),
      change: "+4.1%",
      isPositive: true,
      subtext: "Gross invoices generated",
    },
    {
      label: "Chargeback Ratio",
      value: "0.0%",
      change: "Safe zone",
      isPositive: true,
      subtext: "Protected with 3DS & Escrow",
    },
  ];

  const handleVerify = (id: string, status: "COMPLETED" | "FAILED") => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    setDrawerOpen(false);
    setFeedbackMsg(`Transaction #${id} marked as ${status}.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <StandardPageShell
      title="Payments & Manual TrxID Verification"
      description="Inspect multi-country payment gateway receipts, verify manual mobile money transaction numbers (bKash/Nagad/Crypto), and audit invoices."
      breadcrumbs={[
        { label: "Governance", href: "/admin" },
        { label: "TrxID & Payments" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["table", "grid"]}
      onExport={(fmt) => alert(`Exporting transactions in ${fmt.toUpperCase()}...`)}
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Transaction Verification"
      drawerContent={
        selectedTrx ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {selectedTrx.customerName}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedTrx.email}</p>
                </div>
                <span className="text-lg font-bold font-mono text-blue-600 dark:text-blue-400">
                  ${selectedTrx.amount.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Invoice Number</span>
                  <span className="font-mono font-medium">{selectedTrx.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Gateway</span>
                  <span className="font-semibold">{selectedTrx.gateway}</span>
                </div>
              </div>
              {selectedTrx.manualTrxId && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-xs">Reported TrxID / Hash</span>
                  <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 select-all">
                    {selectedTrx.manualTrxId}
                  </span>
                </div>
              )}
            </div>

            {selectedTrx.status === "PENDING" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleVerify(selectedTrx.id, "COMPLETED")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 size={16} /> Confirm Trx & Credit
                </button>
                <button
                  type="button"
                  onClick={() => handleVerify(selectedTrx.id, "FAILED")}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <XCircle size={16} /> Mark Invalid Trx
                </button>
              </div>
            )}
          </div>
        ) : null
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">TrxID / Hash</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {transactions.map((trx) => (
                <tr
                  key={trx.id}
                  onClick={() => {
                    setSelectedTrx(trx);
                    setDrawerOpen(true);
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-slate-100">
                    {trx.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {trx.customerName}
                    </span>
                    <span className="text-[11px] text-slate-500">{trx.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${trx.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {trx.gateway}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {trx.manualTrxId || "—"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        trx.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : trx.status === "FAILED"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrx(trx);
                        setDrawerOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors text-xs font-medium"
                    >
                      Verify
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
