// apps/web/src/app/(dashboard)/provider/bookings/page.tsx
"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle2,
  XCircle,
  Play,
  Check,
  ChevronRight,
  Filter,
  DollarSign,
  Phone,
  Mail,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

type BookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface BookingItem {
  id: string;
  orderNumber: string;
  consumerName: string;
  email: string;
  serviceTitle: string;
  scheduledAt: string;
  durationMin: number;
  amount: number;
  providerEarning: number;
  status: BookingStatus;
  notes?: string;
}

export default function ProviderBookingsPage() {
  const terms = useRoleTerminology("PROVIDER");
  const [activeView, setActiveView] = useState<"table" | "kanban" | "calendar">("kanban");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingItem[]>([
    {
      id: "ord-001",
      orderNumber: "ORD-2026-0001",
      consumerName: "Alex Morgan",
      email: "consumer@demo.com",
      serviceTitle: "Comprehensive Initial Medical Consultation",
      scheduledAt: "2026-10-21 14:00",
      durationMin: 45,
      amount: 120.0,
      providerEarning: 102.0,
      status: "CONFIRMED",
      notes: "Experiencing recurring headaches for 2 weeks.",
    },
    {
      id: "ord-002",
      orderNumber: "ORD-2026-0002",
      consumerName: "Liam Johnson",
      email: "liam.j@acme.corp",
      serviceTitle: "Follow-Up Prescription Check",
      scheduledAt: "2026-10-21 16:30",
      durationMin: 30,
      amount: 75.0,
      providerEarning: 63.75,
      status: "IN_PROGRESS",
    },
    {
      id: "ord-003",
      orderNumber: "ORD-2026-0003",
      consumerName: "Emma Watson",
      email: "emma.w@studio.com",
      serviceTitle: "Comprehensive Initial Consultation",
      scheduledAt: "2026-10-22 10:00",
      durationMin: 45,
      amount: 120.0,
      providerEarning: 102.0,
      status: "PENDING",
      notes: "Looking to review annual bloodwork panel.",
    },
    {
      id: "ord-004",
      orderNumber: "ORD-2026-0004",
      consumerName: "Noah Davis",
      email: "noah.d@health.org",
      serviceTitle: "Urgent Care & Triage Assessment",
      scheduledAt: "2026-10-20 11:00",
      durationMin: 30,
      amount: 160.0,
      providerEarning: 136.0,
      status: "COMPLETED",
    },
  ]);

  const kpiStats = [
    {
      label: "Today's Appointments",
      value: "2",
      change: "Next at 02:00 PM",
      isPositive: true,
      subtext: "1 video session scheduled",
    },
    {
      label: "Pending Escrow Balance",
      value: `$${bookings
        .filter((b) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS")
        .reduce((acc, b) => acc + b.providerEarning, 0)
        .toFixed(2)}`,
      change: "Auto-releases on fulfill",
      isPositive: true,
      subtext: "Held in escrow",
    },
    {
      label: "Fulfilled This Month",
      value: bookings.filter((b) => b.status === "COMPLETED").length.toString(),
      change: "100% completion rate",
      isPositive: true,
      subtext: "All payouts settled",
    },
    {
      label: "Avg. Duration",
      value: "41 min",
      change: "On schedule",
      isPositive: true,
      subtext: "Standard clinical slot",
    },
  ];

  const handleUpdateStatus = (id: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setDrawerOpen(false);
    setFeedbackMsg(
      newStatus === "COMPLETED"
        ? `Appointment marked completed! Earnings of $${selectedBooking?.providerEarning || 102.0} released to your wallet.`
        : `Appointment status updated to ${newStatus}.`
    );
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const kanbanColumns: { status: BookingStatus; label: string; color: string }[] = [
    { status: "PENDING", label: "Awaiting Confirmation", color: "border-amber-500/50" },
    { status: "CONFIRMED", label: "Confirmed & Upcoming", color: "border-blue-500/50" },
    { status: "IN_PROGRESS", label: "In Consultation Now", color: "border-purple-500/50" },
    { status: "COMPLETED", label: "Fulfilled & Settled", color: "border-emerald-500/50" },
  ];

  return (
    <StandardPageShell
      title="Appointments & Order Fulfillment"
      description={`Manage your client bookings, start telemedicine video calls, track fulfillment progress, and auto-release escrow funds.`}
      breadcrumbs={[
        { label: "Practice", href: "/provider" },
        { label: "Bookings & Orders" },
      ]}
      kpiStats={kpiStats}
      activeView={activeView}
      onViewChange={(v) => setActiveView(v as "table" | "kanban" | "calendar")}
      allowedViews={["kanban", "table", "calendar"]}
      onExport={(fmt) => alert(`Exporting appointment logs in ${fmt.toUpperCase()}...`)}
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Appointment Details & Fulfillment"
      drawerContent={
        selectedBooking ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {selectedBooking.orderNumber}
                  </span>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {selectedBooking.consumerName}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedBooking.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Your Earning</span>
                  <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ${selectedBooking.providerEarning.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Scheduled At</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedBooking.scheduledAt}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Duration</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedBooking.durationMin} minutes
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block text-xs">Intake Notes</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic mt-0.5">
                    "{selectedBooking.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Telemedicine Room Launcher */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
              <h5 className="font-semibold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Video size={14} /> Telemedicine Video Room
              </h5>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                End-to-end encrypted WebRTC room ready for this consultation.
              </p>
              <button
                type="button"
                onClick={() => alert(`Launching Telemedicine Call Room for #${selectedBooking.orderNumber}...`)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Video size={14} /> Launch Telemedicine Room
              </button>
            </div>

            {/* Fulfillment Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                Update Fulfillment State
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedBooking.status === "PENDING" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "CONFIRMED")}
                    className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={14} /> Confirm
                  </button>
                )}
                {selectedBooking.status === "CONFIRMED" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "IN_PROGRESS")}
                    className="py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Play size={14} /> Start Consult
                  </button>
                )}
                {(selectedBooking.status === "CONFIRMED" ||
                  selectedBooking.status === "IN_PROGRESS") && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedBooking.id, "COMPLETED")}
                    className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check size={14} /> Mark Completed
                  </button>
                )}
                {selectedBooking.status !== "COMPLETED" &&
                  selectedBooking.status !== "CANCELLED" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedBooking.id, "CANCELLED")}
                      className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/40 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
              </div>
            </div>
          </div>
        ) : null
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      {/* KANBAN VIEW */}
      {activeView === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map((col) => {
            const colBookings = bookings.filter((b) => b.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-800/60 flex flex-col min-h-[450px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    {col.label}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {colBookings.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBooking(b);
                        setDrawerOpen(true);
                      }}
                      className="bg-white dark:bg-[#111827] p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-500/50 cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold text-slate-500">
                          {b.orderNumber}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          +${b.providerEarning.toFixed(2)}
                        </span>
                      </div>
                      <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                        {b.consumerName}
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{b.serviceTitle}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {b.scheduledAt.split(" ")[1]}
                        </span>
                        <span>{b.durationMin}m</span>
                      </div>
                    </div>
                  ))}

                  {colBookings.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                      No appointments
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {activeView === "table" && (
        <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Scheduled</th>
                <th className="py-3 px-4">Earning</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => {
                    setSelectedBooking(b);
                    setDrawerOpen(true);
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-medium">{b.orderNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {b.consumerName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{b.serviceTitle}</td>
                  <td className="py-3.5 px-4 text-slate-500">{b.scheduledAt}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                    ${b.providerEarning.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : b.status === "IN_PROGRESS"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400"
                          : b.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(b);
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
      )}

      {/* CALENDAR VIEW */}
      {activeView === "calendar" && (
        <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="text-blue-600" size={18} />
              October 2026 Consultation Schedule
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-blue-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-blue-600 inline-block"></span> Confirmed
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span> Completed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2 font-bold text-slate-500 uppercase text-[10px]">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const dayNum = i + 1;
              const hasBooking = dayNum === 20 || dayNum === 21 || dayNum === 22;
              return (
                <div
                  key={dayNum}
                  className={`min-h-[70px] p-2 rounded-xl border text-left flex flex-col justify-between ${
                    dayNum === 21
                      ? "border-blue-500 bg-blue-50/30 dark:bg-blue-950/20"
                      : "border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20"
                  }`}
                >
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                    {dayNum}
                  </span>
                  {hasBooking && (
                    <div className="bg-blue-600 text-white rounded p-1 text-[10px] font-medium truncate">
                      {dayNum === 21 ? "2 Consults" : "1 Consult"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </StandardPageShell>
  );
}
