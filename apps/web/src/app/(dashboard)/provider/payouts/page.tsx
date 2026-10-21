// apps/web/src/app/(dashboard)/provider/payouts/page.tsx
"use client";

import { useState } from "react";
import {
  CreditCard,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  DollarSign,
  Shield,
  AlertCircle,
  Building,
  Smartphone,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface PayoutHistoryItem {
  id: string;
  amount: number;
  netAmount: number;
  currency: string;
  payoutMethod: string;
  destination: string;
  status: "PENDING" | "PAID" | "REJECTED";
  createdAt: string;
}

export default function ProviderPayoutsPage() {
  const terms = useRoleTerminology("PROVIDER");
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState("300");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [accountDetails, setAccountDetails] = useState("Chase Bank •••• 4829, Routing: 021000021");

  const [wallet, setWallet] = useState({
    balance: 1420.5,
    pendingBalance: 240.0,
    totalEarned: 8940.0,
    totalWithdrawn: 7279.5,
  });

  const [history, setHistory] = useState<PayoutHistoryItem[]>([
    {
      id: "pay-001",
      amount: 450.0,
      netAmount: 450.0,
      currency: "USD",
      payoutMethod: "BANK_TRANSFER",
      destination: "Chase Bank •••• 4829",
      status: "PENDING",
      createdAt: "2026-10-21 08:30",
    },
    {
      id: "pay-002",
      amount: 800.0,
      netAmount: 800.0,
      currency: "USD",
      payoutMethod: "BANK_TRANSFER",
      destination: "Chase Bank •••• 4829",
      status: "PAID",
      createdAt: "2026-10-01 14:00",
    },
    {
      id: "pay-003",
      amount: 650.0,
      netAmount: 650.0,
      currency: "USD",
      payoutMethod: "PAYPAL",
      destination: "provider@demo.com",
      status: "PAID",
      createdAt: "2026-09-15 10:15",
    },
  ]);

  const kpiStats = [
    {
      label: "Available for Payout",
      value: `$${wallet.balance.toFixed(2)}`,
      change: "Ready to transfer",
      isPositive: true,
      subtext: "Fulfilled consultation earnings",
    },
    {
      label: "In Escrow (Pending)",
      value: `$${wallet.pendingBalance.toFixed(2)}`,
      change: "2 bookings active",
      isPositive: true,
      subtext: "Auto-released on completion",
    },
    {
      label: "Total Lifetime Earned",
      value: `$${wallet.totalEarned.toFixed(2)}`,
      change: "+24.5% YoY",
      isPositive: true,
      subtext: "After 15% platform split",
    },
    {
      label: "Total Dispatched",
      value: `$${wallet.totalWithdrawn.toFixed(2)}`,
      change: "100% settled",
      isPositive: true,
      subtext: "Transferred to bank / PayPal",
    },
  ];

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount) || 0;
    if (withdrawAmount > wallet.balance) {
      alert("Withdrawal amount cannot exceed available wallet balance.");
      return;
    }

    const newPayout: PayoutHistoryItem = {
      id: `pay-${Date.now().toString().slice(-4)}`,
      amount: withdrawAmount,
      netAmount: withdrawAmount,
      currency: "USD",
      payoutMethod: method,
      destination: accountDetails,
      status: "PENDING",
      createdAt: "Just now",
    };

    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - withdrawAmount,
    }));
    setHistory((prev) => [newPayout, ...prev]);
    setModalOpen(false);
    setFeedbackMsg(
      `Payout request of $${withdrawAmount.toFixed(2)} submitted. Administrator will review within 24 hours.`
    );
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <StandardPageShell
      title={`${terms.earningsUnitName} Wallet & Payout Requests`}
      description={`Monitor your cleared earnings, view escrow funds held for upcoming consultations, and request fast disbursements to your bank or digital wallet.`}
      breadcrumbs={[
        { label: "Practice", href: "/provider" },
        { label: "Earnings Wallet" },
      ]}
      kpiStats={kpiStats}
      actions={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
        >
          <ArrowUpRight size={14} /> Request Payout
        </button>
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Payout History Ledger */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="text-blue-600" size={18} />
            Payout & Withdrawal History
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Payout ID</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Requested At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-medium">{item.id}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${item.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                    {item.payoutMethod}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.destination}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.createdAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : item.status === "REJECTED"
                          ? "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Payout Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRequestPayout}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CreditCard className="text-emerald-600" size={18} />
                Request Earnings Payout
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                  Current Available Balance:
                </span>
                <span className="font-bold font-mono text-emerald-900 dark:text-emerald-200">
                  ${wallet.balance.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Withdrawal Amount ($ USD)
                </label>
                <input
                  type="number"
                  step="10"
                  min="10"
                  max={wallet.balance}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Disbursement Channel
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BANK_TRANSFER">Bank Wire / ACH Transfer</option>
                  <option value="STRIPE_CONNECT">Stripe Connect Instant Payout</option>
                  <option value="PAYPAL">PayPal International</option>
                  <option value="BKASH">bKash Merchant / Personal (BD)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Account Details / Routing / Wallet ID
                </label>
                <textarea
                  rows={2}
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="e.g. Bank Name, IBAN / Account #, Routing #"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Submit Withdrawal
              </button>
            </div>
          </form>
        </div>
      )}
    </StandardPageShell>
  );
}
