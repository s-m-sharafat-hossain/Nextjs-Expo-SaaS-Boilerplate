// apps/web/src/features/portals/provider-portal/provider.schema.ts
import { z } from "zod";

export const createServiceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  durationMinutes: z.coerce.number().min(15).default(60),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().min(1, "Service ID is required"),
  isActive: z.boolean().optional(),
});

export const updateBookingStatusSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  status: z.enum(["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
  cancellationReason: z.string().optional(),
});

export const availabilitySlotSchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6), // 0: Sunday, 6: Saturday
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format must be HH:MM (24h)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format must be HH:MM (24h)"),
});

export const batchAvailabilitySlotsSchema = z.object({
  slots: z.array(availabilitySlotSchema),
});

export const requestPayoutSchema = z.object({
  amount: z.coerce.number().min(10, "Minimum payout request is $10.00"),
  payoutMethod: z.enum(["BANK_TRANSFER", "PAYPAL", "BKASH", "STRIPE_CONNECT"]),
  accountDetails: z.record(z.string(), z.any()),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
export type AvailabilitySlotInput = z.infer<typeof availabilitySlotSchema>;
export type BatchAvailabilitySlotsInput = z.infer<typeof batchAvailabilitySlotsSchema>;
export type RequestPayoutInput = z.infer<typeof requestPayoutSchema>;
