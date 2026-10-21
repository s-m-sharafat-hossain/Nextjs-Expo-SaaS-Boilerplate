// apps/web/src/app/(auth)/signup/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { CenteredAuthLayout } from "@/shared/layouts/CenteredAuthLayout";
import { siteConfig } from "@shared/config";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CONSUMER" | "PROVIDER">("CONSUMER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (role === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/consumer");
      }
    } catch {
      setErrorMsg("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredAuthLayout
      title="Create Your Account"
      subtitle="Get started with complimentary bonus credits and explore all platform features."
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            I am registering as:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("CONSUMER")}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                role === "CONSUMER"
                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-600 dark:text-blue-400"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              👤 {siteConfig.roleLabels.consumer.singular}
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                role === "PROVIDER"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-600 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              🩺 {siteConfig.roleLabels.provider.singular}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Morgan"
            required
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            required
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Password (min. 8 characters)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            minLength={8}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 flex items-center justify-center gap-1.5"
        >
          <span>{isLoading ? "Creating account..." : "Start Free Trial"}</span>
          <ArrowRight size={15} />
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-slate-500">
        <span>Already have an account? </span>
        <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </CenteredAuthLayout>
  );
}
