// apps/web/src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Shield, Stethoscope, User, AlertCircle } from "lucide-react";
import { CenteredAuthLayout } from "@/shared/layouts/CenteredAuthLayout";
import { siteConfig } from "@shared/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      // Direct demo sign in or credentials API
      if (email.includes("admin")) {
        router.push("/admin");
      } else if (email.includes("provider") || email.includes("doctor")) {
        router.push("/provider");
      } else {
        router.push("/consumer");
      }
    } catch {
      setErrorMsg("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredAuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account or use the instant 1-Click demo logins below."
    >
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@demo.com"
            required
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/30 flex items-center justify-center gap-1.5"
        >
          <span>{isLoading ? "Signing in..." : "Sign In to Portal"}</span>
          <ArrowRight size={15} />
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-slate-500">
        <span>Don't have an account? </span>
        <Link href="/register" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Create Account
        </Link>
      </div>
    </CenteredAuthLayout>
  );
}
