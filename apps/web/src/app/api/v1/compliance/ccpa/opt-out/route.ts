// apps/web/src/app/api/v1/compliance/ccpa/opt-out/route.ts
import { NextRequest } from "next/server";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { prisma } from "@/shared/lib/db";
import { ApiResponse } from "@/shared/utils/api-response";
import { AuditLogger } from "@/shared/security/audit-logger";

export async function POST(req: NextRequest) {
  try {
    const user = await AuthMiddleware.authenticate(req);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { ccpaOptedOut: true },
      }),
      prisma.complianceRequest.create({
        data: {
          userId: user.id,
          type: "CCPA_OPT_OUT",
          status: "COMPLETED",
          completedAt: new Date(),
          details: { optedOutAt: new Date().toISOString() },
        },
      }),
    ]);

    await AuditLogger.logUserAction(user.id, "CCPA_OPT_OUT_RECORDED", "users", user.id);

    return ApiResponse.success(
      { ccpaOptedOut: true },
      "You have successfully opted out of the sale or sharing of personal data under CCPA."
    );
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to process CCPA opt-out", error.statusCode || 500);
  }
}
