import { describe, it, expect } from "vitest";
import {
  ConsumerServiceDiscoverySchema,
  CreateBookingCheckoutSchema,
  ConsumerBookingTimelineSchema,
} from "../consumer.schema";

describe("Consumer Portal Schema Validation", () => {
  it("should validate consumer service discovery item", () => {
    const valid = ConsumerServiceDiscoverySchema.safeParse({
      id: "srv_01",
      title: "Comprehensive Clinical Dermatology Consultation",
      category: "Medical & Health",
      providerName: "Dr. Sarah Mitchell",
      providerSpecialty: "Board Certified Dermatology",
      rating: 4.95,
      reviewsCount: 148,
      price: 95.00,
      durationMinutes: 45,
      isWishlisted: true,
    });
    expect(valid.success).toBe(true);
  });

  it("should validate booking checkout payload across gateways", () => {
    const valid = CreateBookingCheckoutSchema.safeParse({
      serviceId: "srv_01",
      slotDate: "Tomorrow",
      slotTime: "10:00 AM",
      gateway: "BKASH",
    });
    expect(valid.success).toBe(true);
  });

  it("should reject checkout without serviceId or time slot", () => {
    const invalid = CreateBookingCheckoutSchema.safeParse({
      serviceId: "",
      slotDate: "Tomorrow",
      slotTime: "",
      gateway: "STRIPE",
    });
    expect(invalid.success).toBe(false);
  });

  it("should validate live booking timeline item with progression steps", () => {
    const valid = ConsumerBookingTimelineSchema.safeParse({
      id: "bkg_01",
      bookingNumber: "BKG-9021",
      serviceTitle: "Comprehensive Clinical Dermatology",
      providerName: "Dr. Sarah Mitchell",
      scheduledDate: "Today",
      scheduledTime: "02:30 PM",
      amount: 95.00,
      status: "CONFIRMED",
      steps: [
        { title: "Booking Placed", description: "Verified", completed: true, current: false },
        { title: "Confirmed", description: "Accepted", completed: true, current: true },
      ],
    });
    expect(valid.success).toBe(true);
  });
});
