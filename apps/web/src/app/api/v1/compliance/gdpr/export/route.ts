// apps/web/src/app/api/v1/compliance/gdpr/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { prisma } from "@/shared/lib/db";
import { ApiResponse } from "@/shared/utils/api-response";
import { AuditLogger } from "@/shared/security/audit-logger";
import { DataProtection } from "@/shared/security/encryption";

export async function GET(req: NextRequest) {
  try {
    const user = await AuthMiddleware.authenticate(req);

    // Retrieve all user data for GDPR portability
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        wallet: true,
        subscription: true,
        kycDocuments: true,
        workspaceMembers: { include: { workspace: true } },
        providedServices: true,
        providerBookings: true,
        consumerBookings: true,
        consumerReviews: true,
        providerReviews: true,
        payments: true,
        tickets: true,
        notifications: true,
        complianceRequests: true,
      },
    });

    if (!fullUser) {
      return ApiResponse.error("User not found", 404);
    }

    // Decrypt sensitive fields for user's personal portability package
    const decryptedUser = DataProtection.decryptUserFields(fullUser);
    if (decryptedUser.wallet) {
      decryptedUser.wallet = DataProtection.decryptWalletFields(decryptedUser.wallet);
    }

    // Strip password hash from export
    const { passwordHash, twoFactorSecret, ...exportData } = decryptedUser;

    // Record compliance request & audit log
    await prisma.complianceRequest.create({
      data: {
        userId: user.id,
        type: "EXPORT_DATA",
        status: "COMPLETED",
        completedAt: new Date(),
        details: { exportFormat: "JSON", timestamp: new Date().toISOString() },
      },
    });

    await AuditLogger.logDataAccess(user.id, "users", user.id, "GDPR_DATA_EXPORT");

    const format = new URL(req.url).searchParams.get("format");
    if (format === "download") {
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="gdpr-data-export-${user.id}.json"`,
        },
      });
    }

    return ApiResponse.success(exportData, "GDPR data export generated successfully");
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to export data", error.statusCode || 500);
  }
}
