// apps/web/src/features/portals/admin-portal/__tests__/admin.schema.test.ts
import { describe, it, expect } from "vitest";
import {
  reviewKycSchema,
  processPayoutSchema,
  verifyTransactionSchema,
  updateUserStatusSchema,
  getUsersFilterSchema,
} from "../admin.schema";

describe("Admin Portal Schemas", () => {
  it("should validate reviewKycSchema properly", () => {
    const valid = reviewKycSchema.safeParse({
      documentId: "kyc-123",
      status: "VERIFIED",
    });
    expect(valid.success).toBe(true);

    const invalid = reviewKycSchema.safeParse({
      documentId: "",
      status: "UNKNOWN_STATUS",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate processPayoutSchema properly", () => {
    const valid = processPayoutSchema.safeParse({
      payoutId: "pay-100",
      status: "PAID",
      transactionRef: "ACH-9921",
    });
    expect(valid.success).toBe(true);

    const invalid = processPayoutSchema.safeParse({
      payoutId: "",
      status: "PENDING",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate verifyTransactionSchema properly", () => {
    const valid = verifyTransactionSchema.safeParse({
      transactionId: "trx-888",
      status: "PAID",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate updateUserStatusSchema properly", () => {
    const valid = updateUserStatusSchema.safeParse({
      userId: "usr-001",
      isBanned: true,
      creditsDelta: 100,
    });
    expect(valid.success).toBe(true);
  });

  it("should apply default pagination in getUsersFilterSchema", () => {
    const result = getUsersFilterSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});
