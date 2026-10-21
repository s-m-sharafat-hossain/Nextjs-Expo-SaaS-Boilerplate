import { z } from "zod";

export const BookingStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "REFUNDED",
]);

export type BookingStatusType = z.infer<typeof BookingStatusEnum>;

export const ProviderServiceListingSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string(),
  price: z.number().min(5, "Minimum price is $5"),
  durationMinutes: z.number().default(30),
  active: z.boolean().default(true),
  description: z.string(),
  bookingsCount: z.number().default(0),
});

export type ProviderServiceListing = z.infer<typeof ProviderServiceListingSchema>;

export const ProviderBookingQueueItemSchema = z.object({
  id: z.string(),
  bookingNumber: z.string(),
  consumerName: z.string(),
  consumerEmail: z.string(),
  consumerImage: z.string().optional(),
  serviceTitle: z.string(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  amount: z.number(),
  status: BookingStatusEnum,
  qrToken: z.string(),
  meetingUrl: z.string().optional(),
});

export type ProviderBookingQueueItem = z.infer<typeof ProviderBookingQueueItemSchema>;

export const ProviderScheduleSlotSchema = z.object({
  id: z.string(),
  dayOfWeek: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean().default(true),
});

export type ProviderScheduleSlot = z.infer<typeof ProviderScheduleSlotSchema>;

export const ProviderKycUploadSchema = z.object({
  documentType: z.enum(["PASSPORT", "NATIONAL_ID", "MEDICAL_LICENSE", "BUSINESS_REG"]),
  documentNumber: z.string().min(4, "Document number required"),
  documentImageUrl: z.string().min(1, "Document photo/scan required"),
});

export type ProviderKycUploadInput = z.infer<typeof ProviderKycUploadSchema>;
