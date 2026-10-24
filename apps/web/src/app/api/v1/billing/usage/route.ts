// apps/web/src/app/api/v1/billing/usage/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { UsageBillingService } from "@/features/billing/usage.service";
import { auth } from "@/shared/lib/auth";
import { z } from "zod";

const recordUsageSchema = z.object({
  metric: z.enum(["api_calls", "ai_tokens", "storage_mb", "sms_sent", "compute_seconds"]),
  quantity: z.number().positive(),
  metadata: z.record(z.any()).optional(),
});

/**
 * GET /api/v1/billing/usage - Get current usage summary
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }

  const { searchParams } = new URL(req.url);
  const targetUserId = (session.user as any).role === "SUPER_ADMIN" && searchParams.get("userId")
    ? searchParams.get("userId")!
    : session.user.id;

  try {
    const summary = await UsageBillingService.getUsageSummary(targetUserId);
    return ApiResponse.success(summary, "Usage summary retrieved");
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to retrieve usage", 500);
  }
}

/**
 * POST /api/v1/billing/usage - Record metered usage event
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }

  try {
    const body = await req.json();
    const parsed = recordUsageSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error.errors[0]?.message || "Invalid payload", 400);
    }

    const result = await UsageBillingService.recordUsage({
      userId: session.user.id,
      metric: parsed.data.metric,
      quantity: parsed.data.quantity,
      metadata: parsed.data.metadata,
    });

    return ApiResponse.success(result, "Usage event recorded", 201);
  } catch (err: any) {
    return ApiResponse.error(err.message || "Failed to record usage", 500);
  }
}
