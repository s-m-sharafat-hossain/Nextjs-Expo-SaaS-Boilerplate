import { z } from "zod";

export const ConsumerServiceDiscoverySchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  providerName: z.string(),
  providerSpecialty: z.string(),
  providerImage: z.string().optional(),
  rating: z.number().default(4.9),
  reviewsCount: z.number().default(12),
  price: z.number(),
  durationMinutes: z.number().default(30),
  isWishlisted: z.boolean().default(false),
});

export type ConsumerServiceDiscoveryItem = z.infer<typeof ConsumerServiceDiscoverySchema>;

export const ConsumerBookingTimelineSchema = z.object({
  id: z.string(),
  bookingNumber: z.string(),
  serviceTitle: z.string(),
  providerName: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  amount: z.number(),
  status: z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  meetingUrl: z.string().optional(),
  steps: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      completed: z.boolean(),
      current: z.boolean(),
    })
  ),
});

export type ConsumerBookingTimelineItem = z.infer<typeof ConsumerBookingTimelineSchema>;

export const CreateBookingCheckoutSchema = z.object({
  serviceId: z.string().min(1, "Service selection is required"),
  slotDate: z.string().min(1, "Date selection is required"),
  slotTime: z.string().min(1, "Time slot is required"),
  notes: z.string().optional(),
  gateway: z.enum([
    "STRIPE",
    "PAYPAL",
    "SSLCOMMERZ",
    "BKASH",
    "RAZORPAY",
    "PAYSTACK",
    "MANUAL_BANK",
  ]),
});

export type CreateBookingCheckoutInput = z.infer<typeof CreateBookingCheckoutSchema>;
