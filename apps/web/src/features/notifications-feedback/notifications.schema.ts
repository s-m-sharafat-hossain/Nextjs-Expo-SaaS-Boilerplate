// apps/web/src/features/notifications-feedback/notifications.schema.ts
import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(2),
  message: z.string().min(2),
  link: z.string().optional(),
});

export const submitFeedbackSchema = z.object({
  type: z.enum(["FEEDBACK", "BUG", "FEATURE"]).default("FEEDBACK"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  rating: z.number().int().min(1).max(5).optional(),
  email: z.string().email().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
