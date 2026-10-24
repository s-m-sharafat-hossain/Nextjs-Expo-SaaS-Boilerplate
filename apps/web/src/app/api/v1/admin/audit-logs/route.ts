// apps/web/src/app/api/v1/admin/audit-logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuditLogger } from "@/shared/security/audit-logger";
import { ApiResponse } from "@/shared/utils/api-response";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Super admin role guard
    const user = await AuthMiddleware.authenticate(req);
    AuthMiddleware.requireRole(user, [Role.ADMIN]);

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");
    const filter = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
      search: searchParams.get("search") || undefined,
      action: searchParams.get("action") || undefined,
      entity: searchParams.get("entity") || undefined,
      userId: searchParams.get("userId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    if (format === "csv") {
      const csv = await AuditLogger.exportLogsCsv(filter);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="audit-logs-${Date.now()}.csv"`,
        },
      });
    }

    const result = await AuditLogger.getLogs(filter);
    return ApiResponse.success(result, "Audit logs retrieved successfully");
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to retrieve audit logs", error.statusCode || 500);
  }
}
