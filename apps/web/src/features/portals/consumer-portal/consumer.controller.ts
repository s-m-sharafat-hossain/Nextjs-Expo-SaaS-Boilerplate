// apps/web/src/features/portals/consumer-portal/consumer.controller.ts
import { NextRequest } from "next/server";
import { ConsumerService } from "./consumer.service";
import {
  exploreServicesFilterSchema,
  createBookingSchema,
  cancelBookingSchema,
  submitReviewSchema,
} from "./consumer.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { handleApiError } from "@/shared/utils/error-handler";

export class ConsumerController {
  private static getUserId(req: NextRequest): string {
    const headerUserId = req.headers.get("x-user-id");
    if (headerUserId) return headerUserId;
    return "demo-consumer-id";
  }

  static async getStats(req: NextRequest) {
    try {
      const consumerId = this.getUserId(req);
      const stats = await ConsumerService.getDashboardStats(consumerId);
      return ApiResponse.success(stats);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getExploreServices(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const filter = exploreServicesFilterSchema.parse({
        search: searchParams.get("search") || undefined,
        category: searchParams.get("category") || undefined,
        minPrice: searchParams.get("minPrice") || undefined,
        maxPrice: searchParams.get("maxPrice") || undefined,
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 12,
      });

      const catalog = await ConsumerService.getExploreServices(filter);
      return ApiResponse.success(catalog);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getServiceById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const service = await ConsumerService.getServiceById(params.id);
      return ApiResponse.success(service);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async createBooking(req: NextRequest) {
    try {
      const consumerId = this.getUserId(req);
      const body = await req.json();
      const validated = createBookingSchema.parse(body);
      const booking = await ConsumerService.createBooking(consumerId, validated);
      return ApiResponse.success(booking, "Appointment booked successfully", 201);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getBookings(req: NextRequest) {
    try {
      const consumerId = this.getUserId(req);
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || undefined;
      const bookings = await ConsumerService.getBookings(consumerId, status);
      return ApiResponse.success(bookings);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async cancelBooking(req: NextRequest) {
    try {
      const consumerId = this.getUserId(req);
      const body = await req.json();
      const validated = cancelBookingSchema.parse(body);
      const booking = await ConsumerService.cancelBooking(consumerId, validated.bookingId, validated.reason);
      return ApiResponse.success(booking, "Booking cancelled successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async submitReview(req: NextRequest) {
    try {
      const consumerId = this.getUserId(req);
      const body = await req.json();
      const validated = submitReviewSchema.parse(body);
      const review = await ConsumerService.submitReview(consumerId, validated);
      return ApiResponse.success(review, "Review submitted successfully", 201);
    } catch (error) {
      return handleApiError(error);
    }
  }
}
