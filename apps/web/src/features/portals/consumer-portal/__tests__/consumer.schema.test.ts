// apps/web/src/features/portals/consumer-portal/__tests__/consumer.schema.test.ts
import { describe, it, expect } from "vitest";
import {
  exploreServicesFilterSchema,
  createBookingSchema,
  cancelBookingSchema,
  submitReviewSchema,
} from "../consumer.schema";

describe("Consumer Portal Schemas", () => {
  it("should validate exploreServicesFilterSchema properly", () => {
    const valid = exploreServicesFilterSchema.safeParse({
      search: "Cardiologist",
      category: "Cardiology",
      minPrice: 50,
      maxPrice: 200,
    });
    expect(valid.success).toBe(true);
  });

  it("should validate createBookingSchema properly", () => {
    const valid = createBookingSchema.safeParse({
      serviceId: "srv-001",
      scheduledAt: "2026-10-22T14:00:00.000Z",
      notes: "First time visit",
    });
    expect(valid.success).toBe(true);

    const invalid = createBookingSchema.safeParse({
      serviceId: "",
      scheduledAt: "invalid-date",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate cancelBookingSchema properly", () => {
    const valid = cancelBookingSchema.safeParse({
      bookingId: "ord-999",
      reason: "Rescheduling required",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate submitReviewSchema rating range", () => {
    const valid = submitReviewSchema.safeParse({
      providerId: "prov-001",
      bookingId: "ord-001",
      rating: 5,
      comment: "Excellent bedside manner and very thorough explanation.",
    });
    expect(valid.success).toBe(true);

    const invalidRating = submitReviewSchema.safeParse({
      providerId: "prov-001",
      bookingId: "ord-001",
      rating: 6,
      comment: "Great",
    });
    expect(invalidRating.success).toBe(false);
  });
});
