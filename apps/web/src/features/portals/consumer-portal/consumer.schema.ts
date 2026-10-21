// apps/web/src/features/portals/consumer-portal/consumer.schema.ts
import { z } from "zod";

export const exploreServicesFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Service ID is required"),
  scheduledAt: z.string().datetime({ message: "Valid ISO datetime is required" }).or(z.string().min(10)),
  notes: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  reason: z.string().optional(),
});

export const submitReviewSchema = z.object({
  providerId: z.string().min(1, "Provider ID is required"),
  bookingId: z.string().min(1, "Booking ID is required"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1 and 5 stars"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export type ExploreServicesFilterInput = z.infer<typeof exploreServicesFilterSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
