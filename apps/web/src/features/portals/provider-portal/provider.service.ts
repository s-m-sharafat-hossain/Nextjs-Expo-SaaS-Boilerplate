// apps/web/src/features/portals/provider-portal/provider.service.ts
import { ProviderRepository } from "./provider.repository";
import {
  CreateServiceInput,
  UpdateServiceInput,
  UpdateBookingStatusInput,
  AvailabilitySlotInput,
  RequestPayoutInput,
} from "./provider.schema";
import { BookingStatus } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";
import { NotificationsRepository } from "@/features/notifications-feedback/notifications.repository";

export class ProviderService {
  static async getDashboardStats(providerId: string) {
    return ProviderRepository.getDashboardStats(providerId);
  }

  static async getServices(providerId: string) {
    return ProviderRepository.getServices(providerId);
  }

  static async createService(providerId: string, input: CreateServiceInput) {
    return ProviderRepository.createService(providerId, input);
  }

  static async updateService(serviceId: string, providerId: string, input: Partial<UpdateServiceInput>) {
    return ProviderRepository.updateService(serviceId, providerId, input);
  }

  static async deleteService(serviceId: string, providerId: string) {
    return ProviderRepository.deleteService(serviceId, providerId);
  }

  static async getBookings(providerId: string, status?: string) {
    const bookingStatus = status ? (status as BookingStatus) : undefined;
    return ProviderRepository.getBookings(providerId, bookingStatus);
  }

  static async updateBookingStatus(providerId: string, input: UpdateBookingStatusInput) {
    const booking = await ProviderRepository.updateBookingStatus(
      input.bookingId,
      providerId,
      input.status as BookingStatus,
      input.cancellationReason
    );

    // Notify consumer about booking status update
    await NotificationsRepository.createNotification({
      userId: booking.consumerId,
      title: `Appointment ${input.status}`,
      message:
        input.status === "CONFIRMED"
          ? "Your appointment has been confirmed by your provider."
          : input.status === "COMPLETED"
          ? "Your consultation has been marked completed! Please leave a review."
          : input.status === "CANCELLED"
          ? `Your appointment was cancelled: ${input.cancellationReason || "No reason specified"}`
          : "Your appointment is now in progress.",
      link: "/consumer/bookings",
    });

    return booking;
  }

  static async getAvailabilitySlots(providerId: string) {
    return ProviderRepository.getAvailabilitySlots(providerId);
  }

  static async setAvailabilitySlots(providerId: string, slots: AvailabilitySlotInput[]) {
    return ProviderRepository.setAvailabilitySlots(providerId, slots);
  }

  static async getWallet(providerId: string) {
    return ProviderRepository.getWallet(providerId);
  }

  static async requestPayout(providerId: string, input: RequestPayoutInput) {
    return ProviderRepository.createPayoutRequest(
      providerId,
      input.amount,
      input.payoutMethod,
      input.accountDetails
    );
  }
}
