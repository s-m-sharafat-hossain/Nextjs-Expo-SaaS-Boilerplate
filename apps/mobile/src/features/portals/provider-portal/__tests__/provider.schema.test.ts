import { describe, it, expect } from "vitest";
import {
  ProviderServiceListingSchema,
  ProviderBookingQueueItemSchema,
  ProviderScheduleSlotSchema,
} from "../provider.schema";

describe("Provider Portal Schema Validation", () => {
  it("should validate provider service listing with minimum price requirement", () => {
    const valid = ProviderServiceListingSchema.safeParse({
      id: "srv_01",
      title: "Telehealth Consultation",
      category: "Health",
      price: 95.00,
      durationMinutes: 45,
      active: true,
      description: "Direct video consultation",
      bookingsCount: 10,
    });
    expect(valid.success).toBe(true);
  });

  it("should reject listing with price below $5", () => {
    const invalid = ProviderServiceListingSchema.safeParse({
      id: "srv_02",
      title: "Free consult",
      category: "Health",
      price: 2.00,
      durationMinutes: 15,
      active: true,
      description: "Invalid price item",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate incoming booking queue item with QR token", () => {
    const valid = ProviderBookingQueueItemSchema.safeParse({
      id: "bkg_01",
      bookingNumber: "BKG-9021",
      consumerName: "Jessica Alba",
      consumerEmail: "jessica@client.com",
      serviceTitle: "Comprehensive Clinical Dermatology",
      scheduledDate: "Today",
      scheduledTime: "02:30 PM",
      amount: 95.00,
      status: "PENDING",
      qrToken: "QR_BKG_9021_TOKEN",
    });
    expect(valid.success).toBe(true);
  });

  it("should validate schedule slot structure", () => {
    const valid = ProviderScheduleSlotSchema.safeParse({
      id: "slot_01",
      dayOfWeek: "MONDAY",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      isActive: true,
    });
    expect(valid.success).toBe(true);
  });
});
