// apps/web/src/app/(dashboard)/admin/payouts/page.tsx
"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  Shield,
  Eye,
  AlertCircle,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface PayoutRequestItem {
  id: string;
  providerName: string;
  email: string;
  amount: number;
  netAmount: number;
  currency: string;
  payoutMethod: string;
  accountDetails: any;
  status: "PENDING" | "PAID" | "REJECTED";
  createdAt: string;
  rejectionReason?: string;
}

export default function AdminPayoutsPage() {
  const terms = useRoleTerminology("ADMIN");
  const [activeView, setActiveView] = useState<"table" | "grid">("table");
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequestItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [payouts, setPayouts] = useState<PayoutRequestItem[]>([
    {
      id: "pay-101",
      providerName: "Dr. Sarah Mitchell, MD",
      email: "provider@demo.com",
      amount: 450.0,
      netAmount: 450.0,
      currency: "USD",
      payoutMethod: "BANK_TRANSFER",
      accountDetails: {
        bankName: "JPMorgan Chase",
        accountNumber: "•••• 4829",
        routingNumber: "021000021",
      },
      status: "PENDING",
      createdAt: "2026-10-21 08:30",
    },
    {
      id: "pay-102",
      providerName: "Dr. David Chen, MD",
      email: "david.chen@clinic.org",
      amount: 820.0,
      netAmount: 820.0,
      currency: "USD",
      payoutMethod: "STRIPE_CONNECT",
      accountDetails: {
        stripeAccountId: "acct_1NxABCDEF12345",
      },
      status: "PENDING",
      createdAt: "2026-10-20 18:00",
    },
    {
      id: "pay-103",
      providerName: "Dr. Elena Rostova, PhD",
      email: "elena.r@neurocare.com",
      amount: 1200.0,
      netAmount: 1200.0,
      currency: "USD",
      payoutMethod: "PAYPAL",
      accountDetails: {
        paypalEmail: "elena.r@neurocare.com",
      },
      status: "PAID",
      createdAt: "2026-10-15 11:20",
    },
  ]);

  const kpiStats = [
    {
      label: "Pending Dispatches",
      value: payouts.filter((p) => p.status === "PENDING").length.toString(),
      change: "$1,270.00 total",
      isPositive: false,
      subtext: "Awaiting bank / gateway batch",
    },
    {
      label: "Dispatched (Settled)",
      value: "$1,200.00",
      change: "100% on-time",
      isPositive: true,
      subtext: "Funds released to providers",
    },
    {
      label: "Average Settlement SLA",
      value: "24 hrs",
      change: "-6 hrs",
      isPositive: true,
      subtext: "Automated batch processing",
    },
    {
      label: "Failed Transfers",
      value: "0",
      change: "0.0%",
      isPositive: true,
      subtext: "Clean ledger audit",
    },
  ];

  const handleMarkPaid = (id: string) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "PAID" as const } : p))
    );
    setDrawerOpen(false);
    setFeedbackMsg(`Payout request #${id} marked as PAID.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === selectedPayout?.id
          ? { ...p, status: "REJECTED" as const, rejectionReason }
          : p
      )
    );
    setRejectionModalOpen(false);
    setDrawerOpen(false);
    setFeedbackMsg(`Payout request #${selectedPayout?.id} rejected and balance refunded.`);
    setRejectionReason("");
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <StandardPageShell
      title="Payout Approvals & Escrow Ledger"
      description={`Review and release verified earnings to ${terms.providerUnitName.toLowerCase()} bank accounts and local payment channels.`}
      breadcrumbs={[
        { label: "Governance", href: "/admin" },
        { label: "Payout Approvals" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["table", "grid"]}
      onExport={(fmt) => alert(`Exporting payout ledger in ${fmt.toUpperCase()}...`)}
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Payout Request Inspection"
      drawerContent={
        selectedPayout ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {selectedPayout.providerName}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedPayout.email}</p>
                </div>
                <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${selectedPayout.amount.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Payout Method</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedPayout.payoutMethod}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Requested Date</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {selectedPayout.createdAt}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                Destination Account Details
              </span>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto">
                {JSON.stringify(selectedPayout.accountDetails, null, 2)}
              </pre>
            </div>

            {selectedPayout.status === "PENDING" && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleMarkPaid(selectedPayout.id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <CheckCircle2 size={16} /> Mark Dispatched & Paid
                </button>
                <button
                  type="button"
                  onClick={() => setRejectionModalOpen(true)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <XCircle size={16} /> Reject & Refund
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

      {/* Payouts Table */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Requested At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {payouts.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    setSelectedPayout(p);
                    setDrawerOpen(true);
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {p.providerName}
                    </span>
                    <span className="text-[11px] text-slate-500">{p.email}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {p.payoutMethod}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{p.createdAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        p.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : p.status === "REJECTED"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPayout(p);
                        setDrawerOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors text-xs font-medium"
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

      {/* Rejection Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Reject Payout Request
            </h3>
            <p className="text-xs text-slate-500">
              Rejected payout amounts are automatically credited back to the provider's wallet balance.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Invalid routing number, closed account, or identity discrepancy."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold"
              >
                Reject & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </StandardPageShell>
  );
}
