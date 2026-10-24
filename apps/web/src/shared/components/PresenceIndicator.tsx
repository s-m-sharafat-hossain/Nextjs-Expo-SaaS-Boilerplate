// apps/web/src/shared/components/PresenceIndicator.tsx
"use client";

import React from "react";

interface PresenceIndicatorProps {
  status: "ONLINE" | "AWAY" | "OFFLINE";
  lastSeen?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function PresenceIndicator({
  status,
  lastSeen,
  size = "md",
  showLabel = false,
}: PresenceIndicatorProps) {
  const dotSize = size === "sm" ? "h-2 w-2" : size === "lg" ? "h-3.5 w-3.5" : "h-2.5 w-2.5";

  const color =
    status === "ONLINE"
      ? "bg-emerald-500 ring-emerald-200 dark:ring-emerald-950"
      : status === "AWAY"
      ? "bg-amber-500 ring-amber-200 dark:ring-amber-950"
      : "bg-slate-400 ring-slate-200 dark:ring-slate-800";

  const label =
    status === "ONLINE"
      ? "Active now"
      : status === "AWAY"
      ? "Away"
      : lastSeen
      ? `Last seen ${new Date(lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      : "Offline";

  return (
    <div className="inline-flex items-center gap-1.5" title={label}>
      <span className={`relative flex ${dotSize}`}>
        {status === "ONLINE" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full ring-2 ${dotSize} ${color}`} />
      </span>
      {showLabel && (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
      )}
    </div>
  );
}
