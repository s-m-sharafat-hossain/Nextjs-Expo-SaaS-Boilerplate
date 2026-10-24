// apps/web/src/features/billing/usage.service.ts
import { prisma } from "@/shared/lib/db";
import Stripe from "stripe";

export interface UsageEvent {
  userId: string;
  metric: "api_calls" | "ai_tokens" | "storage_mb" | "sms_sent" | "compute_seconds";
  quantity: number;
  metadata?: Record<string, any>;
}

export interface UsageSummary {
  userId: string;
  cycleStart: string;
  cycleEnd: string;
  totalEvents: number;
  byMetric: Record<string, number>;
  estimatedCostUSD: number;
}

const METRIC_RATES: Record<string, number> = {
  api_calls: 0.0001,       // $0.10 per 1,000 calls
  ai_tokens: 0.00002,      // $0.02 per 1,000 tokens
  storage_mb: 0.00005,     // $0.05 per GB-month
  sms_sent: 0.015,         // $0.015 per SMS
  compute_seconds: 0.0002, // $0.0002 per second
};

export class UsageBillingService {
  private static stripeClient: Stripe | null = null;

  private static getStripe(): Stripe | null {
    if (this.stripeClient) return this.stripeClient;
    const key = process.env.STRIPE_SECRET_KEY;
    if (key && !key.includes("placeholder")) {
      this.stripeClient = new Stripe(key, { apiVersion: "2024-11-20.acacia" as any });
    }
    return this.stripeClient;
  }

  /**
   * Record a metered usage event
   */
  static async recordUsage(event: UsageEvent) {
    const { userId, metric, quantity, metadata } = event;

    // 1. Persist to UsageLog in database
    const log = await prisma.usageLog.create({
      data: {
        userId,
        action: `usage:${metric}`,
        creditsUsed: Math.ceil(quantity),
        metadata: JSON.stringify({
          quantity,
          metric,
          unitCost: METRIC_RATES[metric] || 0,
          ...metadata,
        }),
      },
    });

    // 2. Report to Stripe Metered Billing if customer has a subscription with Stripe
    const stripe = this.getStripe();
    if (stripe) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { stripeCustomerId: true },
        });

        if (user?.stripeCustomerId) {
          // Stripe Billing Meter Event
          await stripe.billing.meterEvents.create({
            event_name: metric,
            payload: {
              value: String(quantity),
              stripe_customer_id: user.stripeCustomerId,
            },
            timestamp: Math.floor(Date.now() / 1000),
          });
        }
      } catch (err: any) {
        console.warn("[UsageBillingService] Stripe meter sync skipped/failed:", err.message);
      }
    }

    return {
      success: true,
      logId: log.id,
      metric,
      quantity,
      estimatedCost: (METRIC_RATES[metric] || 0) * quantity,
    };
  }

  /**
   * Get aggregated usage summary for a user in the current billing cycle
   */
  static async getUsageSummary(userId: string, startDate?: Date, endDate?: Date): Promise<UsageSummary> {
    const now = new Date();
    const cycleStart = startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const cycleEnd = endDate || now;

    const logs = await prisma.usageLog.findMany({
      where: {
        userId,
        createdAt: { gte: cycleStart, lte: cycleEnd },
        action: { startsWith: "usage:" },
      },
    });

    const byMetric: Record<string, number> = {
      api_calls: 0,
      ai_tokens: 0,
      storage_mb: 0,
      sms_sent: 0,
      compute_seconds: 0,
    };

    let estimatedCostUSD = 0;

    for (const log of logs) {
      const metric = log.action.replace("usage:", "");
      let qty = log.creditsUsed;
      if (log.metadata) {
        try {
          const parsed = JSON.parse(log.metadata);
          if (parsed.quantity) qty = Number(parsed.quantity);
        } catch {
          // keep creditsUsed
        }
      }

      byMetric[metric] = (byMetric[metric] || 0) + qty;
      const rate = METRIC_RATES[metric] || 0;
      estimatedCostUSD += rate * qty;
    }

    return {
      userId,
      cycleStart: cycleStart.toISOString(),
      cycleEnd: cycleEnd.toISOString(),
      totalEvents: logs.length,
      byMetric,
      estimatedCostUSD: Math.round(estimatedCostUSD * 100) / 100,
    };
  }
}
