// apps/web/src/app/api/v1/analytics/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { AnalyticsTracker } from "@/shared/analytics/tracker";
import { auth } from "@/shared/lib/auth";

/**
 * GET /api/v1/analytics - Admin analytics summary
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (role !== "SUPER_ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  const { searchParams } = req.nextUrl;
  const view = searchParams.get("view") || "summary";

  if (view === "retention") {
    const data = AnalyticsTracker.getRetentionData();
    return ApiResponse.success(data, "Retention data");
  }

  const summary = AnalyticsTracker.getAnalyticsSummary();
  return ApiResponse.success(summary, "Analytics summary");
}

/**
 * POST /api/v1/analytics/track - Server-side event tracking
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  try {
    const body = await req.json();
    const { category, action, label, value, properties } = body;

    if (!category || !action) {
      return ApiResponse.error("category and action are required", 400);
    }

    AnalyticsTracker.track({
      category,
      action,
      label,
      value,
      properties,
      userId: session?.user?.id,
    });

    return ApiResponse.success(null, "Event tracked");
  } catch {
    return ApiResponse.error("Invalid request", 400);
  }
}
