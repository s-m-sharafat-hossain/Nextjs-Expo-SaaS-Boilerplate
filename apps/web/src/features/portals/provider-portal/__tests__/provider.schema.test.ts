// apps/web/src/features/portals/provider-portal/__tests__/provider.schema.test.ts
import { describe, it, expect } from "vitest";
import {
  createServiceSchema,
  updateServiceSchema,
  updateBookingStatusSchema,
  availabilitySlotSchema,
  requestPayoutSchema,
} from "../provider.schema";

describe("Provider Portal Schemas", () => {
  it("should validate createServiceSchema properly", () => {
    const valid = createServiceSchema.safeParse({
      title: "Executive Medical Checkup",
      description: "Complete systemic evaluation and lab test interpretation",
      category: "Consultation",
      price: 150,
      durationMinutes: 45,
    });
    expect(valid.success).toBe(true);

    const invalid = createServiceSchema.safeParse({
      title: "Hi",
      description: "Short",
      category: "",
      price: -10,
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate updateBookingStatusSchema properly", () => {
    const valid = updateBookingStatusSchema.safeParse({
      bookingId: "ord-123",
      status: "COMPLETED",
    });
    expect(valid.success).toBe(true);

    const invalid = updateBookingStatusSchema.safeParse({
      bookingId: "ord-123",
      status: "INVALID_STATUS",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate availabilitySlotSchema 24h format", () => {
    const valid = availabilitySlotSchema.safeParse({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
    });
    expect(valid.success).toBe(true);

    const invalidTime = availabilitySlotSchema.safeParse({
      dayOfWeek: 1,
      startTime: "9am",
      endTime: "5pm",
    });
    expect(invalidTime.success).toBe(false);
  });

  it("should validate requestPayoutSchema minimum amount", () => {
    const valid = requestPayoutSchema.safeParse({
      amount: 100,
      payoutMethod: "BANK_TRANSFER",
      accountDetails: { bank: "Chase", account: "12345" },
    });
    expect(valid.success).toBe(true);

    const belowMinimum = requestPayoutSchema.safeParse({
      amount: 5,
      payoutMethod: "BANK_TRANSFER",
      accountDetails: {},
    });
    expect(belowMinimum.success).toBe(false);
  });
});
