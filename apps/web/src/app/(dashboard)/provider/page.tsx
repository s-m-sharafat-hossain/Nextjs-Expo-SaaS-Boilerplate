// apps/web/src/app/(dashboard)/provider/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Clock,
  Star,
  Plus,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { siteConfig } from "@shared/config";

export default function ProviderDashboardPage() {
  const [activeView, setActiveView] = useState<"table" | "grid">("table");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const kpiStats = [
    {
      label: "Available Wallet Balance",
      value: "$1,420.50",
      change: "+$240",
      isPositive: true,
      subtext: "Ready for direct withdrawal",
    },
    {
      label: "Escrow (Pending Completion)",
      value: "$240.00",
      change: "2 bookings",
      isPositive: true,
      subtext: "Auto-released upon fulfillment",
    },
    {
      label: "Upcoming Appointments",
      value: "6",
      change: "+2 this week",
      isPositive: true,
      subtext: "Next at 02:00 PM today",
    },
    {
      label: "Average Patient Rating",
      value: "4.92 ★",
      change: "28 reviews",
      isPositive: true,
      subtext: "Top 5% verified practitioner",
    },
  ];

  const upcomingBookings = [
    {
      id: "ORD-2026-0001",
      consumerName: "Alex Morgan",
      serviceName: "Comprehensive Health & Specialist Review",
      scheduledAt: "Today, 02:00 PM",
      duration: "45 mins",
      amount: "$120.00",
      netEarned: "$102.00",
      status: "CONFIRMED",
      meetUrl: "https://meet.masterflow.io/room-sarah-alex-001",
    },
    {
      id: "ORD-2026-0002",
      consumerName: "Elena Rostova",
      serviceName: "Rapid Clinical Second Opinion & Diagnostics",
      scheduledAt: "Tomorrow, 10:30 AM",
      duration: "30 mins",
      amount: "$80.00",
      netEarned: "$68.00",
      status: "PENDING",
      meetUrl: "https://meet.masterflow.io/room-sarah-elena-002",
    },
  ];

  return (
    <StandardPageShell
      title={siteConfig.roleLabels.provider.portalTitle}
      description={`Welcome back, Dr. Mitchell. Track your clinical schedule, manage consultation services, and request payouts.`}
      breadcrumbs={[
        { label: "Practice", href: "/provider" },
        { label: "Overview" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "grid")}
      allowedViews={["table", "grid"]}
      actions={
        <div className="flex items-center gap-2">
          <Link
            href="/provider/services"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            <Plus size={14} /> Add {siteConfig.roleLabels.provider.serviceUnitName}
          </Link>
          <Link
            href="/provider/payouts"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <CreditCard size={14} /> Request Payout
          </Link>
        </div>
      }
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Appointment Consultation Details"
      drawerContent={
        selectedBooking && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference</span>
                <span className="font-mono font-semibold">{selectedBooking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient</span>
                <span className="font-semibold">{selectedBooking.consumerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Time</span>
                <span className="font-semibold text-blue-600">{selectedBooking.scheduledAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider Earnings (85% Net)</span>
                <span className="font-bold text-emerald-600">{selectedBooking.netEarned}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                Virtual Consultation Room
              </h4>
              <p className="text-slate-400">
                Encrypted end-to-end WebRTC video room ready for tele-consultation.
              </p>
              <a
                href={selectedBooking.meetUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                <Video size={16} /> Enter Video Room
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  alert("Appointment marked completed! Escrow funds released to your wallet.");
                  setDrawerOpen(false);
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
              >
                Complete & Release Escrow
              </button>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* Appointments Table */}
        <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Active Appointments & Order Fulfillment
              </h2>
              <p className="text-xs text-slate-500">
                Manage upcoming tele-consultations, join video rooms, and fulfill client orders.
              </p>
            </div>
            <Link
              href="/provider/bookings"
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View calendar
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3">Patient & Service</th>
                  <th className="px-5 py-3">Schedule</th>
                  <th className="px-5 py-3">Net Earning</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                      <div>{booking.consumerName}</div>
                      <div className="text-[11px] text-slate-400">{booking.serviceName}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      <div>{booking.scheduledAt}</div>
                      <div className="text-[11px] text-slate-400">{booking.duration}</div>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {booking.netEarned}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          booking.status === "CONFIRMED"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setDrawerOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                      >
                        Manage
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
