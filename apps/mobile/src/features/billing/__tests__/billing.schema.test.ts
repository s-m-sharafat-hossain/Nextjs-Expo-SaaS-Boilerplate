import { describe, it, expect } from "vitest";
import { PayoutRequestSchema, ManualTrxSubmitSchema } from "../billing.schema";

describe("Mobile Billing & Payout Schema Validation", () => {
  it("should validate a compliant payout request above $10", () => {
    const valid = PayoutRequestSchema.safeParse({
      amount: 150.00,
      payoutMethod: "BANK_TRANSFER",
      accountDetails: "Chase Checking •••• 9201",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject payout requests under $10 threshold", () => {
    const invalid = PayoutRequestSchema.safeParse({
      amount: 5.00,
      payoutMethod: "PAYPAL",
      accountDetails: "doctor@paypal.me",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate manual bank / mobile money transaction submission", () => {
    const valid = ManualTrxSubmitSchema.safeParse({
      gateway: "BKASH",
      amount: 69.00,
      transactionId: "BKH92048201",
      senderNumberOrAccount: "01711002233",
      packageId: "pkg_growth",
    });
    expect(valid.success).toBe(true);
  });
});
