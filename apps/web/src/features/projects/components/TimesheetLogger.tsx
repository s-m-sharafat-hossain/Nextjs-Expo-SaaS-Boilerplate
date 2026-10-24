// apps/web/src/features/projects/components/TimesheetLogger.tsx
"use client";

import React, { useState } from "react";
import { logTimesheetAction } from "../projects.action";

interface TimesheetItem {
  id: string;
  hours: number;
  description?: string | null;
  date: Date | string;
  project: { id: string; name: string };
  task?: { id: string; title: string } | null;
}

interface TimesheetLoggerProps {
  projectId: string;
  initialEntries: TimesheetItem[];
}

export function TimesheetLogger({ projectId, initialEntries }: TimesheetLoggerProps) {
  const [entries, setEntries] = useState<TimesheetItem[]>(initialEntries);
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalHours = entries.reduce((acc, curr) => acc + curr.hours, 0);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) return;

    setIsSubmitting(true);
    try {
      const created = await logTimesheetAction({
        projectId,
        hours: parsedHours,
        description,
      });

      setEntries((prev) => [created as any, ...prev]);
      setHours("");
      setDescription("");
    } catch (err) {
      console.error("Failed to log timesheet", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ⏱️ Timesheet & Work Hours
          </h3>
          <p className="text-xs text-slate-500">Track and bill development hours on this project</p>
        </div>
        <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold text-sm">
          Total: {totalHours.toFixed(1)} hrs
        </div>
      </div>

      {/* Log Hours Form */}
      <form onSubmit={handleLog} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Hours *</label>
          <input
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            required
            placeholder="e.g. 2.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-500 mb-1">Work Description</label>
          <input
            type="text"
            placeholder="e.g. Code review and test suite fixes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging..." : "Log Hours"}
          </button>
        </div>
      </form>

      {/* Recent Entries */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto">
        {entries.map((entry) => (
          <div key={entry.id} className="py-2.5 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {entry.description || "Development & Tasks"}
              </span>
              <div className="text-slate-400 text-[10px]">
                {new Date(entry.date).toLocaleDateString()}
              </div>
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-300 font-mono">
              {entry.hours.toFixed(2)} hrs
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-slate-400 text-xs py-4">No hours logged yet for this project.</p>
        )}
      </div>
    </div>
  );
}
