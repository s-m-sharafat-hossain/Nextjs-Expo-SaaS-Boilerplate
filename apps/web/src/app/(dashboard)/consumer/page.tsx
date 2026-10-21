// apps/web/src/app/(dashboard)/consumer/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  MessageSquare,
  FileText,
  Star,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  Download,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";

export default function ConsumerDashboardPage() {
  const [activeView, setActiveView] = useState<"table" | "grid">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const kpiStats = [
    {
      label: "Upcoming Appointments",
      value: "1",
      change: "In 2 hours",
      isPositive: true,
      subtext: "Dr. Sarah Mitchell, MD",
    },
    {
      label: "AI Diagnostic Credits",
      value: "35",
      change: "+25 bonus",
      isPositive: true,
      subtext: "Free trial triage credits",
    },
    {
      label: "Completed Consultations",
      value: "3",
      change: "100% fulfilled",
      isPositive: true,
      subtext: "Records and prescriptions saved",
    },
    {
      label: "Pending Invoices",
      value: "$0.00",
      change: "All settled",
      isPositive: true,
      subtext: "Multi-gateway verified receipts",
    },
  ];

  return (
    <StandardPageShell
      title={siteConfig.roleLabels.consumer.portalTitle}
      description={`Welcome back, Alex. Manage your tele-health appointments, connect with verified doctors, and review clinical summaries.`}
      breadcrumbs={[
        { label: "Patient Care", href: "/consumer" },
        { label: "Overview" },
      ]}
      kpiStats={kpiStats}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/consumer/explore"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Search size={14} /> Find {siteConfig.roleLabels.provider.singular}
          </Link>
          <Link
            href="/consumer/chat"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            <MessageSquare size={14} /> AI Symptom Triage
          </Link>
        </div>
      }
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Leave a 5-Star Review"
      drawerContent={
        <div className="space-y-4 text-xs">
          <p className="text-slate-500">
            Share feedback about your consultation with Dr. Sarah Mitchell to assist other patients.
          </p>

          <div>
            <label className="font-semibold block mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-500 hover:scale-110 transition-transform font-bold"
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Written Feedback</label>
            <textarea
              rows={4}
              placeholder="How was the practitioner's care and clinical advice?"
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              alert("Thank you! Review published.");
              setDrawerOpen(false);
            }}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Submit Verified Review
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Active Consultation Stepper Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white shadow-xl shadow-blue-500/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
                Confirmed Next Appointment
              </span>
              <h2 className="text-xl font-bold mt-2">Comprehensive Health & Specialist Review</h2>
              <p className="text-xs text-white/80 mt-1">
                With Dr. Sarah Mitchell, MD • Today at 02:00 PM EST (45 minutes)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://meet.masterflow.io/room-sarah-alex-001"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Video size={16} className="text-blue-600" />
                Join Video Consultation
              </a>
            </div>
          </div>

          {/* Real-time Visual Tracking Stepper */}
          <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <p className="font-semibold">1. Booked & Paid</p>
                <p className="text-[10px] text-white/70">Via Stripe Credit Card</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <p className="font-semibold">2. Doctor Confirmed</p>
                <p className="text-[10px] text-white/70">Slot reserved</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs animate-pulse">
                3
              </div>
              <div>
                <p className="font-semibold text-amber-200">3. In Progress / Video</p>
                <p className="text-[10px] text-white/70">Starts in 2 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3 opacity-60">
              <div className="w-7 h-7 rounded-full bg-white/30 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <p className="font-semibold">4. Completed & Prescription</p>
                <p className="text-[10px] text-white/70">Receipt & summary ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Past Appointments & PDF Receipts */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Past Appointments & Records
            </h3>
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Star size={13} /> Leave a Doctor Review
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Initial Tele-Health Consultation (Order ORD-2026-0001)
                </p>
                <p className="text-slate-400">Dr. Sarah Mitchell, MD • 2 days ago • Paid $120.00</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert("Downloading PDF Invoice & Clinical Summary...")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-medium text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Download size={13} /> PDF Receipt
                </button>
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-medium"
                >
                  <Star size={13} /> 5-Star Rated
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
