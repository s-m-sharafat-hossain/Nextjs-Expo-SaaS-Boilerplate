// apps/web/src/app/(dashboard)/consumer/credits/page.tsx
"use client";

import { useState } from "react";
import {
  Zap,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Clock,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  isPopular?: boolean;
  features: string[];
}

export default function ConsumerCreditsPage() {
  const terms = useRoleTerminology("CONSUMER");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [currentCredits, setCurrentCredits] = useState(35);

  const packs: CreditPack[] = [
    {
      id: "pack-starter",
      name: "Starter Pack",
      credits: 100,
      price: 10.0,
      features: [
        "100 AI Symptom Triage Runs",
        "Clinical Summary Generations",
        "Lifetime credit validity",
      ],
    },
    {
      id: "pack-pro",
      name: "Pro Care Pack",
      credits: 500,
      price: 39.0,
      isPopular: true,
      features: [
        "500 AI Diagnostic Queries",
        "Full Lab Panel AI Interpretation",
        "Priority LLM latency",
        "Saved Medical Chat Records",
      ],
    },
    {
      id: "pack-unlimited",
      name: "Family Health Tier",
      credits: 2000,
      price: 129.0,
      features: [
        "2,000 AI Diagnostic Credits",
        "Up to 5 Family Member Profiles",
        "Direct export to clinical EHR",
        "Dedicated Support Desk",
      ],
    },
  ];

  const usageHistory = [
    {
      id: "usg-1",
      action: "Symptom Triage & Intake Summary",
      credits: -5,
      date: "2026-10-21 11:20",
    },
    {
      id: "usg-2",
      action: "Lab Report Biomarker Explanation",
      credits: -10,
      date: "2026-10-20 16:45",
    },
    {
      id: "usg-3",
      action: "Free Welcome Signup Bonus",
      credits: +50,
      date: "2026-10-18 09:00",
    },
  ];

  const kpiStats = [
    {
      label: "Current Credit Balance",
      value: `${currentCredits} credits`,
      change: "+25 bonus active",
      isPositive: true,
      subtext: "Never expires",
    },
    {
      label: "Diagnostic Runs Remaining",
      value: `${Math.floor(currentCredits / 5)} triage queries`,
      change: "5 credits / query",
      isPositive: true,
      subtext: "Clinical AI triage assistant",
    },
    {
      label: "AI Queries Run",
      value: "12",
      change: "100% accurate",
      isPositive: true,
      subtext: "Medical evidence citations",
    },
    {
      label: "Cost Per Analysis",
      value: "$0.10",
      change: "95% cheaper than copay",
      isPositive: true,
      subtext: "Transparent consumption",
    },
  ];

  const handlePurchase = (pack: CreditPack) => {
    setCurrentCredits((prev) => prev + pack.credits);
    setFeedbackMsg(`Successfully purchased ${pack.name} (+${pack.credits} credits).`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <StandardPageShell
      title="AI Clinical Diagnostic Credits & Top-Up"
      description="Power your AI health triage conversations, biomarker explanations, and clinical summaries with flexible, non-expiring pay-as-you-go credits."
      breadcrumbs={[
        { label: "Care", href: "/consumer" },
        { label: "Credits" },
      ]}
      kpiStats={kpiStats}
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* Credit Packs Pricing Grid */}
      <div className="mb-8">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Sparkles className="text-blue-600" size={18} />
          Choose an AI Diagnostic Credit Pack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packs.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                p.isPopular
                  ? "bg-white dark:bg-[#111827] border-blue-600 dark:border-blue-500 shadow-lg ring-1 ring-blue-600"
                  : "bg-white dark:bg-[#111827] border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-400"
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full shadow-xs">
                  Most Popular
                </div>
              )}

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                  {p.name}
                </h4>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="font-mono font-bold text-2xl text-slate-900 dark:text-slate-100">
                    ${p.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500">/ one-time</span>
                </div>

                <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/60 text-center mb-4">
                  <span className="text-blue-700 dark:text-blue-300 font-bold font-mono text-sm">
                    {p.credits} AI Credits
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 mb-6">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handlePurchase(p)}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                  p.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100"
                }`}
              >
                <CreditCard size={14} /> Buy {p.credits} Credits
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Usage History */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="text-blue-600" size={16} />
            Recent Credit Activity & Consumption
          </h4>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {usageHistory.map((item) => (
            <div key={item.id} className="p-3.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-medium text-slate-900 dark:text-slate-100 block">
                  {item.action}
                </span>
                <span className="text-[11px] text-slate-400">{item.date}</span>
              </div>
              <span
                className={`font-mono font-bold text-xs ${
                  item.credits > 0 ? "text-emerald-600" : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {item.credits > 0 ? `+${item.credits}` : item.credits} credits
              </span>
            </div>
          ))}
        </div>
      </div>
    </StandardPageShell>
  );
}
