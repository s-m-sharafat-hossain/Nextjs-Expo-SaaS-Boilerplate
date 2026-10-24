// apps/web/src/features/portals/super-admin-portal/__tests__/super-admin.schema.test.ts
import { describe, it, expect } from "vitest";
import {
  updatePlatformSettingsSchema,
  manageAdminSchema,
  promoteToAdminSchema,
  superAdminFilterSchema,
} from "../super-admin.schema";
import { RateLimiter } from "@/shared/security/rate-limiter";
import { NextRequest } from "next/server";

describe("Super Admin Portal Governance Suite", () => {
  describe("1. Platform Settings Schema", () => {
    it("should validate updatePlatformSettingsSchema with valid fields", () => {
      const valid = updatePlatformSettingsSchema.safeParse({
        platformName: "MasterFlow SaaS",
        maintenanceMode: true,
        maintenanceMessage: "Scheduled platform upgrade",
        registrationEnabled: false,
        defaultPlan: "PRO",
        maxFreeCredits: 50,
        platformFeePercent: 12.5,
        minPayoutAmount: 100,
        kycRequired: true,
        termsRequired: true,
      });

      expect(valid.success).toBe(true);
      if (valid.success) {
        expect(valid.data.platformFeePercent).toBe(12.5);
        expect(valid.data.maintenanceMode).toBe(true);
      }
    });

    it("should reject fee percentages greater than 100", () => {
      const invalid = updatePlatformSettingsSchema.safeParse({
        platformFeePercent: 120,
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("2. Admin Management Schema", () => {
    it("should validate manageAdminSchema actions", () => {
      const validPromote = manageAdminSchema.safeParse({
        targetUserId: "user-super-123",
        action: "PROMOTE_TO_SUPER_ADMIN",
        reason: "Security Operations Chief",
      });
      expect(validPromote.success).toBe(true);

      const validSuspend = manageAdminSchema.safeParse({
        targetUserId: "user-456",
        action: "SUSPEND",
      });
      expect(validSuspend.success).toBe(true);
    });

    it("should reject invalid actions", () => {
      const invalid = manageAdminSchema.safeParse({
        targetUserId: "user-456",
        action: "INVALID_ACTION",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("3. User Promotion Schema", () => {
    it("should validate promoteToAdminSchema with elevated roles", () => {
      const valid = promoteToAdminSchema.safeParse({
        userId: "target-user-001",
        role: "SUPER_ADMIN",
        reason: "Apex owner elevation",
      });
      expect(valid.success).toBe(true);
    });
  });

  describe("4. Super Admin Filter Schema", () => {
    it("should apply default pagination", () => {
      const parsed = superAdminFilterSchema.parse({});
      expect(parsed.page).toBe(1);
      expect(parsed.limit).toBe(20);
    });
  });

  describe("5. Rate Limiter SUPER_ADMIN Bypass", () => {
    it("should grant unlimited bypass to SUPER_ADMIN role", async () => {
      const dummyReq = new NextRequest("http://localhost:3000/api/v1/super-admin");
      const result = await RateLimiter.check({
        req: dummyReq,
        userRole: "SUPER_ADMIN",
      });

      expect(result.success).toBe(true);
      expect(result.limit).toBe(999999);
      expect(result.remaining).toBe(999999);
    });
  });
});
