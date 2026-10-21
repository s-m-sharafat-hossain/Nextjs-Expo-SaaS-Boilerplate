// src/shared/utils/credit-guard.ts
// Usage Middleware — check credits before heavy actions, deduct after
import { db } from "@/shared/lib/db";
import { AppError } from "./error-handler";

export type CreditAction =
  | "ai_generate"
  | "pdf_export"
  | "email_send"
  | "image_upload"
  | "csv_import"
  | "api_call";

const CREDIT_COSTS: Record<CreditAction, number> = {
  ai_generate:  2,
  pdf_export:   1,
  email_send:   1,
  image_upload: 1,
  csv_import:   2,
  api_call:     1,
};

/**
 * Check if a user has enough credits for an action.
 * Throws AppError(402) if insufficient.
 */
export async function requireCredits(userId: string, action: CreditAction) {
  const cost = CREDIT_COSTS[action];
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { credits: true, plan: true },
  });
  if (!user) throw new AppError("User not found", 404);
  if (user.credits < cost) {
    throw new AppError(
      `Insufficient credits. This action requires ${cost} credits. You have ${user.credits}.`,
      402
    );
  }
  return { cost, credits: user.credits };
}

/**
 * Deduct credits and log usage atomically.
 */
export async function deductCredits(
  userId: string,
  action: CreditAction,
  metadata?: Record<string, unknown>
) {
  const cost = CREDIT_COSTS[action];
  const [updatedUser] = await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: { credits: { decrement: cost } },
    }),
    db.usageLog.create({
      data: {
        userId,
        action,
        creditsUsed: cost,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    }),
  ]);
  return updatedUser;
}

/**
 * All-in-one guard: check → execute → deduct. Use as wrapper around heavy actions.
 */
export async function withCreditGuard<T>(
  userId: string,
  action: CreditAction,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>
): Promise<T> {
  await requireCredits(userId, action);
  const result = await fn();
  await deductCredits(userId, action, metadata);
  return result;
}
