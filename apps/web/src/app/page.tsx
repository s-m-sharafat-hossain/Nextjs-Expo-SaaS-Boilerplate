// apps/web/src/app/page.tsx
"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Shield,
  Stethoscope,
  User,
  Zap,
  Globe,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Video,
  CreditCard,
} from "lucide-react";
import { PublicLandingLayout } from "@/shared/layouts/PublicLandingLayout";
import { siteConfig } from "@shared/config";
import { ChatWidgetComponent } from "@/features/chat-n8n/chat-widget.component";

export default function HomePage() {
  return (
    <PublicLandingLayout>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/80 dark:border-blue-800/60 shadow-xs">
            <Sparkles size={14} className="animate-spin text-blue-500" />
            <span>Master Production-Ready SaaS & Marketplace Boilerplate #1</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Enterprise Multi-Role Marketplace & SaaS{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Engineered for Production
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Built with Next.js 15+ App Router, Feature-Based Modular MVC, and 3 dedicated role portals
            (Super Admin, Provider/Doctor, and Consumer/Patient) with cross-device responsive layout enforcement.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/admin"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
            >
              <span>Explore Admin Portal</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/provider"
              className="px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-slate-700"
            >
              <span>{siteConfig.roleLabels.provider.singular} Practice</span>
              <Stethoscope size={16} className="text-emerald-400" />
            </Link>
            <Link
              href="/consumer"
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <span>{siteConfig.roleLabels.consumer.singular} Hub</span>
              <User size={16} className="text-blue-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. THE THREE PORTALS ARCHITECTURE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-slate-50 dark:bg-[#080c14] border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Three Dedicated Role Portals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Every role has isolated data security, dedicated navigation schemas, and custom business controllers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Portal Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-4">
                  <Shield size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {siteConfig.roleLabels.admin.portalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  KYC approval workflows, user audits, manual payment TrxID validation, platform revenue KPIs, and audit logs.
                </p>
              </div>
              <Link
                href="/admin"
                className="mt-6 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:underline"
              >
                <span>Launch Admin Portal</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Provider Portal Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mb-4">
                  <Stethoscope size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {siteConfig.roleLabels.provider.portalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Service listing CRUD, weekly slot scheduler, video tele-health fulfillments, escrow wallet, and payout requests.
                </p>
              </div>
              <Link
                href="/provider"
                className="mt-6 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <span>Launch {siteConfig.roleLabels.provider.singular} Portal</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Consumer Portal Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center mb-4">
                  <User size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {siteConfig.roleLabels.consumer.portalTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Specialist discovery, instant multi-country checkout, step-by-step real-time order tracker, and PDF receipt downloads.
                </p>
              </div>
              <Link
                href="/consumer"
                className="mt-6 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
              >
                <span>Launch {siteConfig.roleLabels.consumer.singular} Portal</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. TRANSPARENT PRICING TIERS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Simple, Predictable Pricing Tiers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              All plans include complete access to our Three-Portal Architecture and AI automation tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {siteConfig.plans.map((plan) => (
              <div
                key={plan.id}
                className={`p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border transition-all ${
                  plan.popular
                    ? "border-blue-600 dark:border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-600/20"
                    : "border-slate-200 dark:border-slate-800 shadow-sm"
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/register"
                  className={`mt-8 w-full py-2.5 rounded-xl font-semibold text-xs text-center transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200"
                  }`}
                >
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chatbot Widget for Public Visitors */}
      <ChatWidgetComponent />
    </PublicLandingLayout>
  );
}
