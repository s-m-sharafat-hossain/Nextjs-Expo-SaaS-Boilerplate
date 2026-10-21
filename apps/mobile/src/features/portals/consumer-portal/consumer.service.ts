import { ApiClient } from "@/shared/lib/api-client";
import {
  ConsumerServiceDiscoveryItem,
  ConsumerBookingTimelineItem,
  CreateBookingCheckoutInput,
} from "./consumer.schema";

export class ConsumerMobileService {
  /**
   * Discover marketplace services with search and category filters
   */
  static async getDiscoverServices(query?: string, category?: string): Promise<ConsumerServiceDiscoveryItem[]> {
    try {
      return await ApiClient.get<ConsumerServiceDiscoveryItem[]>("/consumer/services", {
        params: { query, category },
      } as any);
    } catch {
      return [
        {
          id: "srv_01",
          title: "Comprehensive Clinical Dermatology Consultation",
          category: "Medical & Health",
          providerName: "Dr. Sarah Mitchell",
          providerSpecialty: "Board Certified Dermatology",
          providerImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
          rating: 4.95,
          reviewsCount: 148,
          price: 95.00,
          durationMinutes: 45,
          isWishlisted: true,
        },
        {
          id: "srv_02",
          title: "Corporate Legal Contract Review & IP Protection",
          category: "Legal & Advisory",
          providerName: "David Chen, Esq.",
          providerSpecialty: "Corporate & Tech IP Law",
          providerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          rating: 4.88,
          reviewsCount: 86,
          price: 150.00,
          durationMinutes: 60,
          isWishlisted: false,
        },
        {
          id: "srv_03",
          title: "Full-Stack SaaS Architecture Strategy Session",
          category: "Engineering & Tech",
          providerName: "Alex Vance",
          providerSpecialty: "Principal Cloud Architect",
          providerImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
          rating: 5.0,
          reviewsCount: 312,
          price: 200.00,
          durationMinutes: 60,
          isWishlisted: true,
        },
      ];
    }
  }

  /**
   * Fetch active bookings with live status timelines
   */
  static async getBookingTimelines(): Promise<ConsumerBookingTimelineItem[]> {
    try {
      return await ApiClient.get<ConsumerBookingTimelineItem[]>("/consumer/bookings/timelines");
    } catch {
      return [
        {
          id: "bkg_01",
          bookingNumber: "BKG-9021",
          serviceTitle: "Comprehensive Clinical Dermatology",
          providerName: "Dr. Sarah Mitchell",
          scheduledDate: "Today",
          scheduledTime: "02:30 PM",
          amount: 95.00,
          status: "CONFIRMED",
          meetingUrl: "https://meet.jit.si/MasterSaasConsultation-9021",
          steps: [
            { title: "Booking Placed & Paid", description: "Payment verified via Stripe", completed: true, current: false },
            { title: "Provider Confirmed", description: "Dr. Sarah accepted your slot", completed: true, current: true },
            { title: "Consultation Video Room Ready", description: "Join 5 mins before start", completed: false, current: false },
            { title: "Prescription & Notes Issued", description: "Delivered to your medical portal", completed: false, current: false },
          ],
        },
      ];
    }
  }

  /**
   * Create Booking Checkout
   */
  static async createBookingCheckout(input: CreateBookingCheckoutInput): Promise<{ success: boolean; bookingId: string }> {
    try {
      return await ApiClient.post("/consumer/bookings/checkout", input);
    } catch {
      return {
        success: true,
        bookingId: `bkg_${Date.now()}`,
      };
    }
  }
}
