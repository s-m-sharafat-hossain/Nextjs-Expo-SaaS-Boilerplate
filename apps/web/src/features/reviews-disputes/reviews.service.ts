// apps/web/src/features/reviews-disputes/reviews.service.ts
import { ReviewsRepository } from "./reviews.repository";
import { SubmitReviewInput, ProviderReplyInput, FileDisputeInput, ResolveDisputeInput } from "./reviews.schema";
import { DisputeStatus, BookingStatus } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { prisma } from "@/shared/lib/db";

export class ReviewsService {
  static async submitReview(consumerId: string, input: SubmitReviewInput) {
    const booking = await prisma.bookingOrder.findUnique({
      where: { id: input.bookingId },
    });

    if (!booking) {
      throw new AppError("Booking order not found", 404);
    }

    if (booking.consumerId !== consumerId) {
      throw new AppError("You can only review bookings made by your account", 403);
    }

    return ReviewsRepository.createReview({
      bookingId: input.bookingId,
      providerId: booking.providerId,
      consumerId,
      rating: input.rating,
      comment: input.comment,
    });
  }

  static async replyReview(providerId: string, input: ProviderReplyInput) {
    return ReviewsRepository.replyToReview(input.reviewId, providerId, input.reply);
  }

  static async fileDispute(consumerId: string, input: FileDisputeInput) {
    const booking = await prisma.bookingOrder.findUnique({
      where: { id: input.bookingId },
    });

    if (!booking) {
      throw new AppError("Booking not found", 404);
    }

    if (booking.consumerId !== consumerId) {
      throw new AppError("Unauthorized", 403);
    }

    return ReviewsRepository.createDispute({
      bookingId: input.bookingId,
      consumerId,
      providerId: booking.providerId,
      reason: input.reason,
    });
  }

  static async resolveDispute(adminUserId: string, input: ResolveDisputeInput) {
    const updated = await ReviewsRepository.updateDisputeStatus(
      input.disputeId,
      input.status as DisputeStatus,
      input.resolutionNotes,
      input.refundAmount
    );

    if (input.status === "RESOLVED_REFUND") {
      await prisma.bookingOrder.update({
        where: { id: updated.bookingId },
        data: { status: BookingStatus.REFUNDED },
      });
    }

    return updated;
  }
}
