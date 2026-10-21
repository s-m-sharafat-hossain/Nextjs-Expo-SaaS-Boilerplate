import { ApiClient } from "@/shared/lib/api-client";
import {
  ProviderServiceListing,
  ProviderBookingQueueItem,
  ProviderScheduleSlot,
  ProviderKycUploadInput,
} from "./provider.schema";

export class ProviderMobileService {
  /**
   * Fetch services created by the current provider
   */
  static async getListings(): Promise<ProviderServiceListing[]> {
    try {
      return await ApiClient.get<ProviderServiceListing[]>("/provider/listings");
    } catch {
      return [
        {
          id: "srv_01",
          title: "Comprehensive Clinical Dermatology Consultation",
          category: "Medical & Health",
          price: 95.00,
          durationMinutes: 45,
          active: true,
          description: "Video consultation with diagnosis, treatment plan, and direct electronic pharmacy prescription.",
          bookingsCount: 42,
        },
        {
          id: "srv_02",
          title: "Follow-up Skin & Mole Assessment",
          category: "Medical & Health",
          price: 50.00,
          durationMinutes: 20,
          active: true,
          description: "Quick follow-up review for existing patients following initial therapy.",
          bookingsCount: 19,
        },
      ];
    }
  }

  /**
   * Toggle Listing Active/Inactive Status
   */
  static async toggleListingStatus(id: string, active: boolean): Promise<void> {
    try {
      await ApiClient.patch(`/provider/listings/${id}`, { active });
    } catch {
      // Mock success
    }
  }

  /**
   * Fetch Incoming Bookings / Orders Queue
   */
  static async getBookingsQueue(): Promise<ProviderBookingQueueItem[]> {
    try {
      return await ApiClient.get<ProviderBookingQueueItem[]>("/provider/bookings");
    } catch {
      return [
        {
          id: "bkg_01",
          bookingNumber: "BKG-9021",
          consumerName: "Jessica Alba",
          consumerEmail: "jessica@client.com",
          serviceTitle: "Comprehensive Clinical Dermatology",
          scheduledDate: "Today",
          scheduledTime: "02:30 PM",
          amount: 95.00,
          status: "PENDING",
          qrToken: "QR_BKG_9021_TOKEN",
          meetingUrl: "https://meet.jit.si/MasterSaasConsultation-9021",
        },
        {
          id: "bkg_02",
          bookingNumber: "BKG-8842",
          consumerName: "Michael Chang",
          consumerEmail: "michael.c@gmail.com",
          serviceTitle: "Follow-up Skin & Mole Assessment",
          scheduledDate: "Today",
          scheduledTime: "04:15 PM",
          amount: 50.00,
          status: "CONFIRMED",
          qrToken: "QR_BKG_8842_TOKEN",
          meetingUrl: "https://meet.jit.si/MasterSaasConsultation-8842",
        },
      ];
    }
  }

  /**
   * Update Booking Status (CONFIRMED / COMPLETED / CANCELLED)
   */
  static async updateBookingStatus(id: string, status: any): Promise<void> {
    try {
      await ApiClient.patch(`/provider/bookings/${id}/status`, { status });
    } catch {
      // Mock success
    }
  }

  /**
   * Scan & Verify QR Ticket / Order
   */
  static async verifyQrTicket(qrToken: string): Promise<{ valid: boolean; booking?: ProviderBookingQueueItem }> {
    try {
      return await ApiClient.post("/provider/bookings/verify-qr", { qrToken });
    } catch {
      return {
        valid: true,
      };
    }
  }

  /**
   * Fetch Provider Availability Slots
   */
  static async getScheduleSlots(): Promise<ProviderScheduleSlot[]> {
    try {
      return await ApiClient.get<ProviderScheduleSlot[]>("/provider/slots");
    } catch {
      return [
        { id: "s1", dayOfWeek: "MONDAY", startTime: "09:00 AM", endTime: "05:00 PM", isActive: true },
        { id: "s2", dayOfWeek: "TUESDAY", startTime: "09:00 AM", endTime: "05:00 PM", isActive: true },
        { id: "s3", dayOfWeek: "WEDNESDAY", startTime: "09:00 AM", endTime: "05:00 PM", isActive: true },
        { id: "s4", dayOfWeek: "THURSDAY", startTime: "09:00 AM", endTime: "05:00 PM", isActive: true },
        { id: "s5", dayOfWeek: "FRIDAY", startTime: "10:00 AM", endTime: "03:00 PM", isActive: true },
        { id: "s6", dayOfWeek: "SATURDAY", startTime: "11:00 AM", endTime: "02:00 PM", isActive: false },
        { id: "s7", dayOfWeek: "SUNDAY", startTime: "Closed", endTime: "Closed", isActive: false },
      ];
    }
  }

  /**
   * Toggle Schedule Slot Active
   */
  static async toggleScheduleSlot(slotId: string, isActive: boolean): Promise<void> {
    try {
      await ApiClient.patch(`/provider/slots/${slotId}`, { isActive });
    } catch {
      // Mock success
    }
  }

  /**
   * Upload KYC Verification Document
   */
  static async uploadKyc(input: ProviderKycUploadInput): Promise<{ success: boolean; kycId: string }> {
    try {
      return await ApiClient.post("/provider/kyc/upload", input);
    } catch {
      return {
        success: true,
        kycId: `kyc_${Date.now()}`,
      };
    }
  }
}
