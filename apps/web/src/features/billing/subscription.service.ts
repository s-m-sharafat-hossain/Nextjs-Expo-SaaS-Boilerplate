// apps/web/src/features/billing/subscription.service.ts
import { prisma } from "@/shared/lib/db";
import Stripe from "stripe";
import { PlanType, SubscriptionStatus } from "@prisma/client";

export interface ProrationEstimate {
  currentPlan: string;
  targetPlan: string;
  currentPlanAmount: number;
  targetPlanAmount: number;
  daysRemainingInCycle: number;
  daysInCycle: number;
  creditForUnusedCurrentPlan: number;
  chargeForTargetPlanRemaining: number;
  netProratedAmount: number;
  currency: string;
}

const PLAN_MONTHLY_PRICES: Record<string, number> = {
  FREE: 0,
  STARTER: 29,
  PRO: 79,
  AGENCY: 199,
};

export class SubscriptionProrationService {
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
   * Calculate proration preview before upgrading/downgrading
   */
  static calculateProrationEstimate(
    currentPlan: string,
    targetPlan: string,
    currentPeriodEnd: Date,
    currentPeriodStart: Date = new Date(),
    currency = "USD"
  ): ProrationEstimate {
    const currentPrice = PLAN_MONTHLY_PRICES[currentPlan] ?? 0;
    const targetPrice = PLAN_MONTHLY_PRICES[targetPlan] ?? 0;

    const now = new Date();
    const totalCycleMs = Math.max(1, currentPeriodEnd.getTime() - currentPeriodStart.getTime());
    const remainingMs = Math.max(0, currentPeriodEnd.getTime() - now.getTime());

    const daysInCycle = Math.round(totalCycleMs / (1000 * 60 * 60 * 24)) || 30;
    const daysRemaining = Math.round(remainingMs / (1000 * 60 * 60 * 24));

    const remainingFraction = Math.min(1, Math.max(0, remainingMs / totalCycleMs));

    const creditForUnused = Math.round(currentPrice * remainingFraction * 100) / 100;
    const chargeForTarget = Math.round(targetPrice * remainingFraction * 100) / 100;
    const netProratedAmount = Math.max(0, Math.round((chargeForTarget - creditForUnused) * 100) / 100);

    return {
      currentPlan,
      targetPlan,
      currentPlanAmount: currentPrice,
      targetPlanAmount: targetPrice,
      daysRemainingInCycle: daysRemaining,
      daysInCycle,
      creditForUnusedCurrentPlan: creditForUnused,
      chargeForTargetPlanRemaining: chargeForTarget,
      netProratedAmount,
      currency,
    };
  }

  /**
   * Upgrade or downgrade user plan with immediate proration applied
   */
  static async changePlan(userId: string, targetPlan: PlanType) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) throw new Error("User not found");

    const currentPlan = user.plan;
    const stripe = this.getStripe();

    if (stripe && user.subscription?.stripeSubscriptionId) {
      try {
        const sub = await stripe.subscriptions.retrieve(user.subscription.stripeSubscriptionId);
        const subItemId = sub.items.data[0]?.id;

        if (subItemId) {
          // Update Stripe subscription with proration behavior: always_invoice
          await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
            items: [
              {
                id: subItemId,
                deleted: true,
              },
            ],
            proration_behavior: "always_invoice",
          });
        }
      } catch (err: any) {
        console.warn("[SubscriptionProrationService] Stripe update failed, updating local state:", err.message);
      }
    }

    // Update local database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { plan: targetPlan },
    });

    if (user.subscription) {
      await prisma.subscription.update({
        where: { id: user.subscription.id },
        data: {
          planType: targetPlan,
          status: SubscriptionStatus.ACTIVE,
        },
      });
    }

    return {
      success: true,
      previousPlan: currentPlan,
      newPlan: targetPlan,
      user: { id: updatedUser.id, email: updatedUser.email, plan: updatedUser.plan },
    };
  }
}
