// apps/web/src/app/api/v1/compliance/gdpr/delete/route.ts
import { NextRequest } from "next/server";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { prisma } from "@/shared/lib/db";
import { ApiResponse } from "@/shared/utils/api-response";
import { AuditLogger } from "@/shared/security/audit-logger";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const authUser = await AuthMiddleware.authenticate(req);
    const body = await req.json();

    const { confirmationPassword } = body;
    if (!confirmationPassword) {
      return ApiResponse.error("Password confirmation is required to verify data deletion request", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!user || !user.passwordHash) {
      return ApiResponse.error("Account verification failed", 401);
    }

    const isValid = await bcrypt.compare(confirmationPassword, user.passwordHash);
    if (!isValid) {
      return ApiResponse.error("Invalid password confirmation", 401);
    }

    // GDPR Right to be Forgotten: Anonymize / Delete personal records
    await prisma.$transaction(async (tx) => {
      // 1. Record compliance audit record
      await tx.complianceRequest.create({
        data: {
          userId: user.id,
          type: "RIGHT_TO_FORGOTTEN",
          status: "COMPLETED",
          completedAt: new Date(),
          details: { anonymizedAt: new Date().toISOString() },
        },
      });

      // 2. Anonymize user identifying information
      await tx.user.update({
        where: { id: user.id },
        data: {
          name: "Deleted User (GDPR)",
          email: `deleted_${user.id}@anonymized.gdpr`,
          phone: null,
          bio: null,
          image: null,
          address: null,
          governmentId: null,
          passwordHash: null,
          isActive: false,
          isBanned: true,
          twoFactorEnabled: false,
          twoFactorSecret: null,
        },
      });

      // 3. Purge sessions and API keys
      await tx.session.deleteMany({ where: { userId: user.id } });
      await tx.apiKey.deleteMany({ where: { userId: user.id } });
      await tx.oAuthToken.deleteMany({ where: { userId: user.id } });
    });

    await AuditLogger.logUserAction(
      user.id,
      "GDPR_RIGHT_TO_FORGOTTEN_EXECUTED",
      "users",
      user.id
    );

    return ApiResponse.success(
      { deleted: true },
      "Your personal data has been erased in accordance with GDPR Right to be Forgotten compliance."
    );
  } catch (error: any) {
    return ApiResponse.error(error.message || "Failed to process data deletion", error.statusCode || 500);
  }
}
