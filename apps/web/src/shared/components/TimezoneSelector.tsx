// apps/web/src/shared/components/TimezoneSelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { COMMON_TIMEZONES, TimezoneManager } from "../timezone/detector";

export function TimezoneSelector() {
  const [currentTimezone, setCurrentTimezone] = useState("UTC");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user-timezone") || TimezoneManager.detectBrowserTimezone();
    setCurrentTimezone(saved);
  }, []);

  const selectTimezone = (tz: string) => {
    setCurrentTimezone(tz);
    localStorage.setItem("user-timezone", tz);
    document.cookie = `user_timezone=${tz}; path=/; max-age=31536000; SameSite=Lax`;
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("timezone-changed", { detail: { timezone: tz } }));
  };

  const activeZone = COMMON_TIMEZONES.find((t) => t.value === currentTimezone) || {
    value: currentTimezone,
    label: currentTimezone,
    offset: "",
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        title={`Active Timezone: ${activeZone.label}`}
      >
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold">{activeZone.value.split("/").pop()?.replace(/_/g, " ") || activeZone.value}</span>
        {activeZone.offset && <span className="text-slate-400 text-[10px]">({activeZone.offset})</span>}
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-1.5 w-64 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Select Timezone
            </div>
            {COMMON_TIMEZONES.map((zone) => (
              <button
                key={zone.value}
                onClick={() => selectTimezone(zone.value)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                  zone.value === currentTimezone
                    ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex flex-col">
                  <span>{zone.label}</span>
                  <span className="text-[10px] text-slate-400">{zone.offset}</span>
                </div>
                {zone.value === currentTimezone && (
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
