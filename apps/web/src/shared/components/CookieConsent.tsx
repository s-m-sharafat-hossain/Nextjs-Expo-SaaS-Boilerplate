"use client";

import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("saasflow_cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("saasflow_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("saasflow_cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 p-5 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 text-slate-200 shadow-2xl transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">We value your privacy</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            We use cookies to analyze site traffic, remember your preferences, and optimize your AI workflow experience.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/20 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
