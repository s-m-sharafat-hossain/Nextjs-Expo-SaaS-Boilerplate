import { describe, it, expect } from "vitest";
import { AdminMetricsSchema, KycVerificationItemSchema, DisputeItemSchema } from "../admin.schema";

describe("Admin Portal Schema Validation", () => {
  it("should validate complete admin metrics payload", () => {
    const valid = AdminMetricsSchema.safeParse({
      mrr: 18450,
      arr: 221400,
      totalUsers: 1420,
      activeProviders: 84,
      pendingKycCount: 3,
      pendingPayoutsCount: 4,
      pendingManualTrxCount: 2,
      openDisputesCount: 1,
      grossRevenue: 94820,
      platformCommission: 14223,
    });
    expect(valid.success).toBe(true);
  });

  it("should validate KYC verification item structure", () => {
    const valid = KycVerificationItemSchema.safeParse({
      id: "kyc_01",
      providerId: "prv_sarah",
      providerName: "Dr. Sarah Mitchell",
      email: "sarah.m@healthclinic.org",
      specialtyOrBusiness: "Board Certified Dermatology",
      documentType: "MEDICAL_LICENSE",
      documentUrl: "https://example.com/license.pdf",
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    });
    expect(valid.success).toBe(true);
  });

  it("should validate dispute resolver ticket schema", () => {
    const valid = DisputeItemSchema.safeParse({
      id: "dsp_01",
      ticketNumber: "DSP-4901",
      consumerName: "Emily Watson",
      providerName: "Dr. Sarah Mitchell",
      bookingId: "BKG-7729",
      reason: "Provider delay during emergency call",
      amount: 85.00,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    });
    expect(valid.success).toBe(true);
  });
});
