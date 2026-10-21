// src/shared/lib/analytics.ts
// Universal Event Tracking & Revenue Analytics Helper
import { db } from "./db";
import { Logger } from "./logger";

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  userId?: string;
  timestamp?: string;
}

/**
 * Universal trackEvent function: PostHog / Umami / GA4 / Console
 */
export async function trackEvent(
  event: string,
  properties: Record<string, unknown> = {},
  userId?: string
) {
  try {
    const payload: AnalyticsEvent = {
      event,
      properties,
      userId,
      timestamp: new Date().toISOString(),
    };

    // 1. PostHog / External Analytics Dispatch
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
      fetch(`${process.env.NEXT_PUBLIC_POSTHOG_HOST}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
          event,
          properties: {
            ...properties,
            distinct_id: userId ?? "anonymous",
          },
        }),
      }).catch((err) => Logger.warn("[Analytics] PostHog dispatch failed:", err));
    }

    // 2. Structured log in development
    if (process.env.NODE_ENV !== "production") {
      Logger.info(`[Analytics] Event: ${event}`, { properties, userId });
    }

    return { tracked: true, event };
  } catch (err) {
    Logger.error("[Analytics] trackEvent failed", err);
    return { tracked: false };
  }
}

/**
 * Calculate core SaaS Revenue & Growth Metrics from Database
 */
export async function calculateRevenueMetrics() {
  const [activeSubs, totalUsers, totalTransactions] = await Promise.all([
    db.subscription.findMany({
      where: { status: "ACTIVE" },
      select: { planType: true },
    }),
    db.user.count(),
    db.paymentTransaction.findMany({
      where: { status: "PAID" },
      select: { finalAmount: true },
    }),
  ]);

  // Plan pricing tiers (in USD)
  const PLAN_PRICES: Record<string, number> = {
    STARTER: 19,
    PRO: 49,
    AGENCY: 149,
    FREE: 0,
  };

  const mrr = activeSubs.reduce((acc, sub) => acc + (PLAN_PRICES[sub.planType] ?? 0), 0);
  const arr = mrr * 12;
  const totalRevenue = totalTransactions.reduce((acc, tx) => acc + tx.finalAmount, 0);
  const arpu = activeSubs.length > 0 ? (mrr / activeSubs.length).toFixed(2) : "0.00";

  return {
    mrr,
    arr,
    totalRevenue,
    activeSubscribers: activeSubs.length,
    totalUsers,
    arpu: Number(arpu),
  };
}
