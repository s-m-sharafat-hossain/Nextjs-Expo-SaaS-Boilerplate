import { useState, useCallback, useEffect } from "react";
import { SupportService } from "./support.service";
import {
  SupportTicket,
  TicketCategoryType,
  TicketPriorityType,
  CreateTicketSchema,
  SubmitReviewSchema,
} from "./support.schema";

export const FAQ_ITEMS = [
  {
    q: "How do I switch between Admin, Provider, and Consumer roles?",
    a: "Open the profile tab or sidebar drawer and use the 1-Click Role Switcher. In production, roles are assigned based on your verified credentials.",
  },
  {
    q: "How does the shared database between web and mobile work?",
    a: "Both apps share the same PostgreSQL database via the centralized REST API at /api/v1/*. Any user registered or booking made on mobile is immediately visible on the web dashboard.",
  },
  {
    q: "How can Providers withdraw their earnings?",
    a: "Navigate to the Wallet tab, tap 'Request Payout', enter your destination account, and confirm using Face ID / Fingerprint biometrics.",
  },
  {
    q: "Which payment gateways are supported?",
    a: "Stripe, PayPal, SSLCommerz (BD), bKash/Nagad (BD), Razorpay (IN), Paystack (Africa), and Direct Manual Bank transfer with TrxID verification.",
  },
];

export const useSupportController = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // New Ticket State
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategoryType>("GENERAL_INQUIRY");
  const [priority, setPriority] = useState<TicketPriorityType>("MEDIUM");
  const [message, setMessage] = useState("");

  // Review State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Load Tickets
   */
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SupportService.getTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load support tickets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  /**
   * Submit Support Ticket
   */
  const handleCreateTicket = useCallback(async () => {
    setError(null);
    setSuccessMessage(null);

    const validation = CreateTicketSchema.safeParse({
      subject,
      category,
      priority,
      message,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please complete all ticket fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await SupportService.createTicket(validation.data);
      setTickets((prev) => [newTicket, ...prev]);
      setIsNewTicketOpen(false);
      setSubject("");
      setMessage("");
      setSuccessMessage(`Ticket #${newTicket.ticketNumber} created successfully! Our team will respond shortly.`);
    } catch (err: any) {
      setError(err?.message || "Failed to submit support ticket");
    } finally {
      setIsSubmitting(false);
    }
  }, [subject, category, priority, message]);

  /**
   * Submit Review
   */
  const handleSubmitReview = useCallback(async (targetId = "srv_general") => {
    setError(null);
    setSuccessMessage(null);

    const validation = SubmitReviewSchema.safeParse({
      targetId,
      targetType: "SERVICE",
      rating,
      title: reviewTitle,
      comment: reviewComment,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Please check your review input");
      return;
    }

    setIsSubmitting(true);
    try {
      await SupportService.submitReview(validation.data);
      setIsReviewOpen(false);
      setReviewTitle("");
      setReviewComment("");
      setSuccessMessage("Thank you! Your verified review has been published.");
    } catch (err: any) {
      setError(err?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  }, [rating, reviewTitle, reviewComment]);

  const toggleFaq = (idx: number) => {
    setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx);
  };

  return {
    tickets,
    expandedFaqIndex,
    toggleFaq,
    isNewTicketOpen,
    setIsNewTicketOpen,
    subject,
    setSubject,
    category,
    setCategory,
    priority,
    setPriority,
    message,
    setMessage,
    isReviewOpen,
    setIsReviewOpen,
    rating,
    setRating,
    reviewTitle,
    setReviewTitle,
    reviewComment,
    setReviewComment,
    isLoading,
    isSubmitting,
    error,
    successMessage,
    loadTickets,
    handleCreateTicket,
    handleSubmitReview,
  };
};
