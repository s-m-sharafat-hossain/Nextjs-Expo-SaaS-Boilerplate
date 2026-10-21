// apps/web/src/app/(dashboard)/provider/schedule/page.tsx
"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { StandardPageShell } from "@/shared/layouts/StandardPageShell";
import { useRoleTerminology } from "@/shared/hooks/useRoleTerminology";

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  isEnabled: boolean;
  slots: { startTime: string; endTime: string }[];
}

export default function ProviderSchedulePage() {
  const terms = useRoleTerminology("PROVIDER");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      dayOfWeek: 1,
      dayName: "Monday",
      isEnabled: true,
      slots: [
        { startTime: "09:00", endTime: "12:00" },
        { startTime: "13:30", endTime: "17:00" },
      ],
    },
    {
      dayOfWeek: 2,
      dayName: "Tuesday",
      isEnabled: true,
      slots: [{ startTime: "09:00", endTime: "17:00" }],
    },
    {
      dayOfWeek: 3,
      dayName: "Wednesday",
      isEnabled: true,
      slots: [{ startTime: "09:00", endTime: "17:00" }],
    },
    {
      dayOfWeek: 4,
      dayName: "Thursday",
      isEnabled: true,
      slots: [{ startTime: "10:00", endTime: "16:00" }],
    },
    {
      dayOfWeek: 5,
      dayName: "Friday",
      isEnabled: true,
      slots: [{ startTime: "09:00", endTime: "14:00" }],
    },
    {
      dayOfWeek: 6,
      dayName: "Saturday",
      isEnabled: false,
      slots: [],
    },
    {
      dayOfWeek: 0,
      dayName: "Sunday",
      isEnabled: false,
      slots: [],
    },
  ]);

  const [blackoutDates, setBlackoutDates] = useState<string[]>([
    "2026-11-26 (Thanksgiving)",
    "2026-12-25 (Christmas Holiday)",
  ]);
  const [newBlackout, setNewBlackout] = useState("");

  const kpiStats = [
    {
      label: "Weekly Available Hours",
      value: "32.5 hrs",
      change: "Standard full-time",
      isPositive: true,
      subtext: "Across 5 active days",
    },
    {
      label: "Open Time Slots",
      value: "42 slots",
      change: "45 min increments",
      isPositive: true,
      subtext: "Available for instant booking",
    },
    {
      label: "Custom Blackout Dates",
      value: blackoutDates.length.toString(),
      change: "Auto-synced",
      isPositive: true,
      subtext: "No clients can book",
    },
    {
      label: "Slot Buffer Time",
      value: "15 min",
      change: "Between sessions",
      isPositive: true,
      subtext: "Clinical note preparation",
    },
  ];

  const handleToggleDay = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek
          ? {
              ...d,
              isEnabled: !d.isEnabled,
              slots: !d.isEnabled && d.slots.length === 0
                ? [{ startTime: "09:00", endTime: "17:00" }]
                : d.slots,
            }
          : d
      )
    );
  };

  const handleAddSlot = (dayOfWeek: number) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek
          ? {
              ...d,
              slots: [...d.slots, { startTime: "14:00", endTime: "18:00" }],
            }
          : d
      )
    );
  };

  const handleRemoveSlot = (dayOfWeek: number, index: number) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek
          ? {
              ...d,
              slots: d.slots.filter((_, i) => i !== index),
            }
          : d
      )
    );
  };

  const handleSlotTimeChange = (
    dayOfWeek: number,
    index: number,
    field: "startTime" | "endTime",
    val: string
  ) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek
          ? {
              ...d,
              slots: d.slots.map((s, i) => (i === index ? { ...s, [field]: val } : s)),
            }
          : d
      )
    );
  };

  const handleSaveSchedule = () => {
    setFeedbackMsg("Recurring availability schedule saved and synchronized with client booking calendar.");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleAddBlackout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlackout.trim()) return;
    setBlackoutDates((prev) => [...prev, newBlackout.trim()]);
    setNewBlackout("");
  };

  return (
    <StandardPageShell
      title="Availability & Slot Scheduler"
      description={`Set your recurring weekly clinical office hours and define blackout holiday dates. ${terms.consumerPlural} can only book within authorized open windows.`}
      breadcrumbs={[
        { label: "Practice", href: "/provider" },
        { label: "Slot Scheduler" },
      ]}
      kpiStats={kpiStats}
      actions={
        <button
          type="button"
          onClick={handleSaveSchedule}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Save size={14} /> Save Schedule
        </button>
      }
    >
      {feedbackMsg && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={16} /> {feedbackMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Recurring Schedule (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={18} />
              Weekly Office Hours
            </h3>

            <div className="space-y-4">
              {schedule.map((day) => (
                <div
                  key={day.dayOfWeek}
                  className={`p-4 rounded-xl border transition-all ${
                    day.isEnabled
                      ? "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                      : "bg-slate-50 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/50 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.isEnabled}
                        onChange={() => handleToggleDay(day.dayOfWeek)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {day.dayName}
                      </span>
                    </label>

                    {day.isEnabled && (
                      <button
                        type="button"
                        onClick={() => handleAddSlot(day.dayOfWeek)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Window
                      </button>
                    )}
                  </div>

                  {day.isEnabled ? (
                    <div className="space-y-2">
                      {day.slots.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleSlotTimeChange(day.dayOfWeek, idx, "startTime", e.target.value)
                            }
                            className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-slate-100"
                          />
                          <span className="text-xs text-slate-400">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleSlotTimeChange(day.dayOfWeek, idx, "endTime", e.target.value)
                            }
                            className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-slate-900 dark:text-slate-100"
                          />
                          {day.slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSlot(day.dayOfWeek, idx)}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Closed / Unavailable</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blackout Dates & Holidays (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="text-purple-600" size={18} />
              Blackout Dates & Vacations
            </h3>
            <p className="text-xs text-slate-500">
              Specify upcoming holidays, clinic closures, or conferences when you will be away.
            </p>

            <form onSubmit={handleAddBlackout} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 2026-12-31 (New Year Eve)"
                value={newBlackout}
                onChange={(e) => setNewBlackout(e.target.value)}
                className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold"
              >
                Add
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {blackoutDates.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => setBlackoutDates((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StandardPageShell>
  );
}
