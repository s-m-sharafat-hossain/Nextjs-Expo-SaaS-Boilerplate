// apps/web/src/features/reviews-disputes/reviews.schema.ts
import { z } from "zod";

export const submitReviewSchema = z.object({
  bookingId: z.string().cuid(),
  rating: z.number().int().min(1, "Minimum rating is 1 star").max(5, "Maximum rating is 5 stars"),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(1000),
});

export const providerReplySchema = z.object({
  reviewId: z.string().cuid(),
  reply: z.string().min(2).max(1000),
});

export const fileDisputeSchema = z.object({
  bookingId: z.string().cuid(),
  reason: z.string().min(10, "Please describe the dispute reason in detail (min 10 characters)"),
});

export const resolveDisputeSchema = z.object({
  disputeId: z.string().cuid(),
  status: z.enum(["UNDER_REVIEW", "RESOLVED_REFUND", "REJECTED"]),
  resolutionNotes: z.string().min(5),
  refundAmount: z.number().positive().optional(),
});

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
export type ProviderReplyInput = z.infer<typeof providerReplySchema>;
export type FileDisputeInput = z.infer<typeof fileDisputeSchema>;
export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>;
