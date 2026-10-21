// apps/web/src/features/portals/consumer-portal/consumer.service.ts
import { ConsumerRepository } from "./consumer.repository";
import {
  ExploreServicesFilterInput,
  CreateBookingInput,
  SubmitReviewInput,
} from "./consumer.schema";
import { BookingStatus } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { NotificationsRepository } from "@/features/notifications-feedback/notifications.repository";

export class ConsumerService {
  static async getDashboardStats(consumerId: string) {
    return ConsumerRepository.getDashboardStats(consumerId);
  }

  static async getExploreServices(filter: ExploreServicesFilterInput) {
    return ConsumerRepository.getExploreServices(filter);
  }

  static async getServiceById(id: string) {
    const service = await ConsumerRepository.getServiceById(id);
    if (!service) {
      throw new AppError("Requested service not found", 404);
    }
    return service;
  }

  static async createBooking(consumerId: string, input: CreateBookingInput) {
    const booking = await ConsumerRepository.createBooking(consumerId, input);

    // Notify Provider about new incoming appointment
    await NotificationsRepository.createNotification({
      userId: booking.providerId,
      title: "New Appointment Booked",
      message: `You have received a new booking (#${booking.orderNumber}) for $${booking.amount}. Scheduled: ${new Date(
        booking.scheduledAt
      ).toLocaleString()}.`,
      link: "/provider/bookings",
    });

    return booking;
  }

  static async getBookings(consumerId: string, status?: string) {
    const bookingStatus = status ? (status as BookingStatus) : undefined;
    return ConsumerRepository.getBookings(consumerId, bookingStatus);
  }

  static async cancelBooking(consumerId: string, bookingId: string, reason?: string) {
    const booking = await ConsumerRepository.cancelBooking(consumerId, bookingId, reason);

    // Notify provider
    await NotificationsRepository.createNotification({
      userId: booking.providerId,
      title: "Booking Cancelled by Client",
      message: `Booking #${booking.orderNumber} was cancelled: ${reason || "No reason given"}.`,
      link: "/provider/bookings",
    });

    return booking;
  }

  static async submitReview(consumerId: string, input: SubmitReviewInput) {
    const review = await ConsumerRepository.submitReview(consumerId, input);

    // Notify provider of new review
    await NotificationsRepository.createNotification({
      userId: input.providerId,
      title: `New ${input.rating}★ Review Received`,
      message: `A client left a feedback review: "${input.comment.slice(0, 80)}..."`,
      link: "/provider/reviews",
    });

    return review;
  }
}
