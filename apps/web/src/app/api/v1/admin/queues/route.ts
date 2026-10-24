// apps/web/src/app/api/v1/admin/queues/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { QueueDashboard } from "@/shared/queue/queue-dashboard";
import { queueManager } from "@/shared/queue/queue-manager";
import { auth } from "@/shared/lib/auth";

/**
 * GET /api/v1/admin/queues - Queue health & stats (admin only)
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  const { searchParams } = req.nextUrl;
  const view = searchParams.get("view") || "health";

  if (view === "stats") {
    const stats = await QueueDashboard.getAllStats();
    return ApiResponse.success(stats, "Queue stats");
  }

  const health = await QueueDashboard.getSystemHealth();
  return ApiResponse.success(health, "Queue health");
}

/**
 * POST /api/v1/admin/queues - Add test job or trigger queue action
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "SUPER_ADMIN") {
    return ApiResponse.error("Forbidden", 403);
  }

  try {
    const body = await req.json();
    const { jobName, data } = body;

    if (!jobName || !data) {
      return ApiResponse.error("jobName and data are required", 400);
    }

    const jobId = await queueManager.add(jobName, data);
    return ApiResponse.success({ jobId }, `Job '${jobName}' added to queue`);
  } catch (err: any) {
    return ApiResponse.error(err?.message || "Failed to add job", 500);
  }
}
