// apps/web/src/shared/components/CurrencySelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, DollarSign } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "../currency/converter";

export function CurrencySelector() {
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user-currency") || "USD";
    setCurrentCurrency(saved);
  }, []);

  const selectCurrency = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem("user-currency", code);
    document.cookie = `user_currency=${code}; path=/; max-age=31536000; SameSite=Lax`;
    setIsOpen(false);
    // Dispatch event so price widgets update
    window.dispatchEvent(new CustomEvent("currency-changed", { detail: { currency: code } }));
  };

  const active = SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.USD;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span>{active.flag}</span>
        <span className="font-semibold">{active.code}</span>
        <span className="text-slate-400">({active.symbol})</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {Object.values(SUPPORTED_CURRENCIES).map((curr) => (
              <button
                key={curr.code}
                onClick={() => selectCurrency(curr.code)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                  curr.code === currentCurrency
                    ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{curr.flag}</span>
                  <span>{curr.name}</span>
                </div>
                {curr.code === currentCurrency && (
                  <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
