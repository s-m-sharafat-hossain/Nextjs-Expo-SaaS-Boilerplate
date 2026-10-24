// apps/web/src/shared/components/LanguageSwitcher.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LOCALES, SupportedLocale, isRtlLocale } from "../i18n";

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>("en");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem("user-locale") as SupportedLocale) || "en";
    setCurrentLocale(saved);
    applyLocaleToDocument(saved);
  }, []);

  const applyLocaleToDocument = (locale: string) => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
      // Save cookie for SSR detection
      document.cookie = `user_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const selectLocale = (code: SupportedLocale) => {
    setCurrentLocale(code);
    localStorage.setItem("user-locale", code);
    applyLocaleToDocument(code);
    setIsOpen(false);
  };

  const activeLang = SUPPORTED_LOCALES.find((l) => l.code === currentLocale) || SUPPORTED_LOCALES[0];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <span className="text-sm">{activeLang.flag}</span>
        <span>{activeLang.code.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-1.5 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {SUPPORTED_LOCALES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLocale(lang.code as SupportedLocale)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                  lang.code === currentLocale
                    ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {lang.code === currentLocale && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
