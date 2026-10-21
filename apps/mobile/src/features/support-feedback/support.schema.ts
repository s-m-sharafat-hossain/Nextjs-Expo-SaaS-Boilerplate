import { z } from "zod";

export const TicketPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export type TicketPriorityType = z.infer<typeof TicketPriorityEnum>;

export const TicketCategoryEnum = z.enum([
  "BILLING",
  "TECHNICAL",
  "BOOKING_DISPUTE",
  "KYC_ACCOUNT",
  "GENERAL_INQUIRY",
]);
export type TicketCategoryType = z.infer<typeof TicketCategoryEnum>;

export const TicketStatusEnum = z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "CLOSED"]);
export type TicketStatusType = z.infer<typeof TicketStatusEnum>;

export const CreateTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: TicketCategoryEnum,
  priority: TicketPriorityEnum.default("MEDIUM"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachmentUrl: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

export const SupportTicketSchema = z.object({
  id: z.string(),
  ticketNumber: z.string(),
  subject: z.string(),
  category: TicketCategoryEnum,
  priority: TicketPriorityEnum,
  status: TicketStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
  lastResponse: z.string().optional(),
});

export type SupportTicket = z.infer<typeof SupportTicketSchema>;

export const SubmitReviewSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(["PROVIDER", "SERVICE", "PLATFORM"]),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export type SubmitReviewInput = z.infer<typeof SubmitReviewSchema>;
