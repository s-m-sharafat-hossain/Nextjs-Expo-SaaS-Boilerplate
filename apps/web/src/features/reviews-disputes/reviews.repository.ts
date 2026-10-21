// apps/web/src/features/reviews-disputes/reviews.repository.ts
import { prisma } from "@/shared/lib/db";
import { DisputeStatus } from "@prisma/client";

export class ReviewsRepository {
  static async createReview(data: {
    bookingId: string;
    providerId: string;
    consumerId: string;
    rating: number;
    comment: string;
  }) {
    return prisma.review.create({
      data,
    });
  }

  static async replyToReview(reviewId: string, providerId: string, reply: string) {
    return prisma.review.updateMany({
      where: { id: reviewId, providerId },
      data: { reply },
    });
  }

  static async getProviderReviews(providerId: string) {
    return prisma.review.findMany({
      where: { providerId },
      include: {
        consumer: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createDispute(data: {
    bookingId: string;
    consumerId: string;
    providerId: string;
    reason: string;
  }) {
    return prisma.disputeRefund.create({
      data: {
        ...data,
        status: DisputeStatus.OPEN,
      },
    });
  }

  static async updateDisputeStatus(
    disputeId: string,
    status: DisputeStatus,
    resolutionNotes: string,
    refundAmount?: number
  ) {
    return prisma.disputeRefund.update({
      where: { id: disputeId },
      data: {
        status,
        resolutionNotes,
        refundAmount,
      },
      include: {
        booking: true,
      },
    });
  }

  static async listAllDisputes() {
    return prisma.disputeRefund.findMany({
      include: {
        booking: true,
        consumer: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
