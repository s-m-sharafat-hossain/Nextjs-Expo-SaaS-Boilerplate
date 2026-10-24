// apps/web/src/app/api/v1/admin/analytics/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { AnalyticsTracker } from "@/shared/analytics/tracker";
import { QueueDashboard } from "@/shared/queue/queue-dashboard";
import { auth } from "@/shared/lib/auth";

/**
 * GET /api/v1/admin/analytics — Comprehensive admin analytics dashboard data
 *
 * Combines: event analytics, retention, queue health
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  const { searchParams } = req.nextUrl;
  const view = searchParams.get("view") || "overview";

  switch (view) {
    case "retention":
      return ApiResponse.success(AnalyticsTracker.getRetentionData(), "Retention data");

    case "queues":
      return ApiResponse.success(await QueueDashboard.getSystemHealth(), "Queue health");

    case "overview":
    default: {
      const [analytics, queueHealth] = await Promise.all([
        AnalyticsTracker.getAnalyticsSummary(),
        QueueDashboard.getSystemHealth(),
      ]);
      return ApiResponse.success(
        { analytics, queueHealth },
        "Admin analytics overview"
      );
    }
  }
}
