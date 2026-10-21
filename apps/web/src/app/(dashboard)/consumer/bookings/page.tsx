// apps/web/src/app/(dashboard)/consumer/bookings/page.tsx
"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  Download,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ArrowRight,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

type BookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface ConsumerBooking {
  id: string;
  orderNumber: string;
  providerId: string;
  providerName: string;
  serviceTitle: string;
  scheduledAt: string;
  durationMin: number;
  amount: number;
  status: BookingStatus;
  reviewed: boolean;
  notes?: string;
}

export default function ConsumerBookingsPage() {
  const terms = useRoleTerminology("CONSUMER");
  const [selectedBooking, setSelectedBooking] = useState<ConsumerBooking | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [bookings, setBookings] = useState<ConsumerBooking[]>([
    {
      id: "ord-001",
      orderNumber: "ORD-2026-0001",
      providerId: "prov-001",
      providerName: "Dr. Sarah Mitchell, MD",
      serviceTitle: "Comprehensive Initial Medical Consultation",
      scheduledAt: "2026-10-21 14:00",
      durationMin: 45,
      amount: 120.0,
      status: "CONFIRMED",
      reviewed: false,
      notes: "Experiencing recurring headaches for 2 weeks.",
    },
    {
      id: "ord-004",
      orderNumber: "ORD-2026-0004",
      providerId: "prov-002",
      providerName: "Dr. David Chen, MD",
      serviceTitle: "Cardiovascular Health & ECG Review",
      scheduledAt: "2026-10-18 10:00",
      durationMin: 45,
      amount: 180.0,
      status: "COMPLETED",
      reviewed: true,
    },
    {
      id: "ord-005",
      orderNumber: "ORD-2026-0005",
      providerId: "prov-003",
      providerName: "Dr. Elena Rostova, PhD",
      serviceTitle: "Cognitive Performance & Sleep Intake",
      scheduledAt: "2026-10-10 11:30",
      durationMin: 60,
      amount: 150.0,
      status: "COMPLETED",
      reviewed: false,
    },
  ]);

  const kpiStats = [
    {
      label: "Upcoming Consultations",
      value: bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").length.toString(),
      change: "Next in 2 hours",
      isPositive: true,
      subtext: "Encrypted telemedicine room ready",
    },
    {
      label: "Fulfilled Consultations",
      value: bookings.filter((b) => b.status === "COMPLETED").length.toString(),
      change: "All records saved",
      isPositive: true,
      subtext: "Prescriptions & notes available",
    },
    {
      label: "Total Healthcare Spend",
      value: `$${bookings.reduce((acc, b) => acc + b.amount, 0).toFixed(2)}`,
      change: "Verified receipts",
      isPositive: true,
      subtext: "Tax & HSA deductible",
    },
    {
      label: "Diagnostic Credits",
      value: "35 credits",
      change: "+25 bonus active",
      isPositive: true,
      subtext: "AI clinical triage credits",
    },
  ];

  const timelineSteps: { key: BookingStatus; label: string }[] = [
    { key: "PENDING", label: "Appointment Booked" },
    { key: "CONFIRMED", label: "Confirmed by Doctor" },
    { key: "IN_PROGRESS", label: "Video Consult Active" },
    { key: "COMPLETED", label: "Fulfilled & Prescribed" },
  ];

  const getStepState = (currentStatus: BookingStatus, stepKey: BookingStatus) => {
    const order: BookingStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === "CANCELLED") return "cancelled";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    alert(`Downloading verified PDF tax invoice & clinical receipt for #${orderNumber}...`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking?.id ? { ...b, reviewed: true } : b
      )
    );
    if (selectedBooking) {
      setSelectedBooking((prev) => (prev ? { ...prev, reviewed: true } : null));
    }
    setReviewModalOpen(false);
    setFeedbackMsg(`Thank you for rating Dr. ${selectedBooking?.providerName}! Your review has been published.`);
    setReviewComment("");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <StandardPageShell
      title="My Appointments & Clinical History"
      description={`Track the live status of your medical consultations, join encrypted video rooms, download medical receipts, and review your ${terms.providerUnitName.toLowerCase()}s.`}
      breadcrumbs={[
        { label: "Care", href: "/consumer" },
        { label: "My Appointments" },
      ]}
      kpiStats={kpiStats}
      onExport={(fmt) => alert(`Exporting medical history in ${fmt.toUpperCase()}...`)}
      drawerOpen={drawerOpen}
      onDrawerClose={() => setDrawerOpen(false)}
      drawerTitle="Appointment Status Tracker"
      drawerContent={
        selectedBooking ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {selectedBooking.orderNumber}
                  </span>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {selectedBooking.providerName}
                  </h4>
                  <p className="text-xs text-slate-500">{selectedBooking.serviceTitle}</p>
                </div>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                  ${selectedBooking.amount.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {selectedBooking.scheduledAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {selectedBooking.durationMin} minutes
                </span>
              </div>
            </div>

            {/* Step-by-Step Progress Timeline */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 block">
                Fulfillment Timeline
              </span>
              <div className="space-y-4 pl-2">
                {timelineSteps.map((step, idx) => {
                  const state = getStepState(selectedBooking.status, step.key);
                  return (
                    <div key={step.key} className="flex items-start gap-3 relative">
                      {idx < timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-3 top-6 w-0.5 h-7 ${
                            state === "completed" ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                          }`}
                        />
                      )}
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                          state === "completed"
                            ? "bg-emerald-600 text-white"
                            : state === "current"
                            ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        {state === "completed" ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      <div className="pt-0.5">
                        <span
                          className={`text-xs font-semibold block ${
                            state === "current"
                              ? "text-blue-600 dark:text-blue-400 font-bold"
                              : state === "completed"
                              ? "text-slate-900 dark:text-slate-100"
                              : "text-slate-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Telemedicine Video Launcher */}
            {selectedBooking.status === "CONFIRMED" && (
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
                <h5 className="font-semibold text-xs text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                  <Video size={14} /> Telemedicine Video Room Ready
                </h5>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Your doctor will meet you in this secure WebRTC room.
                </p>
                <button
                  type="button"
                  onClick={() => alert(`Entering video consultation room #${selectedBooking.orderNumber}...`)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Video size={14} /> Join Video Consultation
                </button>
              </div>
            )}

            {/* Actions: Download Invoice & Leave Review */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedBooking.orderNumber)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={14} /> Download Clinical Receipt & Invoice
              </button>

              {selectedBooking.status === "COMPLETED" && !selectedBooking.reviewed && (
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Star size={14} /> Leave Consultation Review
                </button>
              )}
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

      {/* Bookings List */}
      <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Doctor / Specialist</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Scheduled</th>
                <th className="py-3 px-4">Fee</th>
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
                    {b.providerName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{b.serviceTitle}</td>
                  <td className="py-3.5 px-4 text-slate-500">{b.scheduledAt}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    ${b.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        b.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
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
                      Track
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Submission Modal */}
      {reviewModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitReview}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={18} />
                Rate Your Consultation
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                How was your appointment experience with{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {selectedBooking.providerName}
                </span>
                ?
              </p>

              {/* Star Selector */}
              <div className="flex items-center gap-2 justify-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={
                        star <= rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-300 dark:text-slate-700"
                      }
                    />
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Written Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details on bedside manner, clarity of prescription instructions, or punctuality..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
    </StandardPageShell>
  );
}
