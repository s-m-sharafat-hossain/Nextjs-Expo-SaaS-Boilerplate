// apps/web/src/shared/components/PasswordStrengthMeter.tsx
"use client";

import React, { useMemo } from "react";
import { Check, X, ShieldCheck } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const checks = useMemo(() => {
    return [
      { label: "At least 12 characters", met: password.length >= 12 },
      { label: "At least 1 uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
      { label: "At least 1 lowercase letter (a-z)", met: /[a-z]/.test(password) },
      { label: "At least 1 number (0-9)", met: /[0-9]/.test(password) },
      { label: "At least 1 special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const score = checks.filter((c) => c.met).length;

  const strength = useMemo(() => {
    if (!password) return { label: "", color: "bg-slate-200 dark:bg-slate-700", width: "0%" };
    if (score <= 2) return { label: "Weak", color: "bg-rose-500", width: "25%" };
    if (score === 3) return { label: "Fair", color: "bg-amber-500", width: "50%" };
    if (score === 4) return { label: "Good", color: "bg-blue-500", width: "75%" };
    return { label: "Strong & Enterprise Ready", color: "bg-emerald-500", width: "100%" };
  }, [password, score]);

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
          Password Strength:
        </span>
        <span className="font-semibold text-slate-900 dark:text-slate-100">{strength.label}</span>
      </div>

      {/* Strength Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-full transition-all duration-300 ${strength.color}`}
          style={{ width: strength.width }}
        />
      </div>

      {/* Rules list */}
      <ul className="mt-2 space-y-1">
        {checks.map((rule, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-1.5 transition-colors ${
              rule.met ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {rule.met ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <X className="h-3 w-3 text-slate-400" />
            )}
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
