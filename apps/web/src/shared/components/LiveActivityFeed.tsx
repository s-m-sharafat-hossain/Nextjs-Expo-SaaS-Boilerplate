// apps/web/src/shared/components/LiveActivityFeed.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Activity, Bell, CheckCircle2, DollarSign, Calendar, MessageSquare, Zap } from "lucide-react";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: "BOOKING" | "PAYMENT" | "CHAT" | "SYSTEM";
  timestamp: string;
  user?: { name: string; avatar?: string };
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act-1",
      title: "Telehealth Consultation Booked",
      description: "Dr. Sarah Mitchell scheduled an appointment with Patient John.",
      type: "BOOKING",
      timestamp: "Just now",
      user: { name: "Dr. Sarah Mitchell" },
    },
    {
      id: "act-2",
      title: "Invoice Paid via Stripe",
      description: "Payment of $120.00 processed for consultation receipt #INV-8891.",
      type: "PAYMENT",
      timestamp: "3m ago",
    },
    {
      id: "act-3",
      title: "AI Clinical Triage Completed",
      description: "n8n chatbot processed symptom triage session in 840ms.",
      type: "CHAT",
      timestamp: "12m ago",
    },
  ]);

  // Connect to SSE for real-time live activities
  useEffect(() => {
    if (typeof window === "undefined") return;

    const eventSource = new EventSource("/api/v1/sse?userId=activity-feed");

    eventSource.addEventListener("activity:new", (event: MessageEvent) => {
      try {
        const newAct = JSON.parse(event.data);
        setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
      } catch {
        // ignore parse error
      }
    });

    return () => {
      eventSource.close();
    };
  }, []);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "BOOKING":
        return <Calendar className="h-4 w-4 text-sky-500" />;
      case "PAYMENT":
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case "CHAT":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Zap className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Live Platform Activity</h3>
        </div>
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          Live Sync
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 rounded-lg p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{act.title}</p>
                <span className="text-[11px] text-slate-400 shrink-0">{act.timestamp}</span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
