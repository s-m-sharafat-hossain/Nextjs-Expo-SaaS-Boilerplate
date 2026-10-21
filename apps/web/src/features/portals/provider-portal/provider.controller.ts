// apps/web/src/features/portals/provider-portal/provider.controller.ts
import { NextRequest } from "next/server";
import { ProviderService } from "./provider.service";
import {
  createServiceSchema,
  updateServiceSchema,
  updateBookingStatusSchema,
  batchAvailabilitySlotsSchema,
  requestPayoutSchema,
} from "./provider.schema";
import { ApiResponse } from "@/shared/utils/api-response";
import { handleApiError } from "@/shared/utils/error-handler";

export class ProviderController {
  private static getUserId(req: NextRequest): string {
    const headerUserId = req.headers.get("x-user-id");
    if (headerUserId) return headerUserId;
    // Fallback default demo provider ID
    return "demo-provider-id";
  }

  static async getStats(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const stats = await ProviderService.getDashboardStats(providerId);
      return ApiResponse.success(stats);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getServices(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const services = await ProviderService.getServices(providerId);
      return ApiResponse.success(services);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async createService(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const body = await req.json();
      const validated = createServiceSchema.parse(body);
      const service = await ProviderService.createService(providerId, validated);
      return ApiResponse.success(service, "Service created successfully", 201);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async updateService(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const body = await req.json();
      const validated = updateServiceSchema.parse(body);
      const service = await ProviderService.updateService(validated.id, providerId, validated);
      return ApiResponse.success(service, "Service updated successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async deleteService(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const { searchParams } = new URL(req.url);
      const serviceId = searchParams.get("id");
      if (!serviceId) throw new Error("Service ID is required");

      const deleted = await ProviderService.deleteService(serviceId, providerId);
      return ApiResponse.success(deleted, "Service deleted successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getBookings(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const { searchParams } = new URL(req.url);
      const status = searchParams.get("status") || undefined;
      const bookings = await ProviderService.getBookings(providerId, status);
      return ApiResponse.success(bookings);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async updateBookingStatus(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const body = await req.json();
      const validated = updateBookingStatusSchema.parse(body);
      const booking = await ProviderService.updateBookingStatus(providerId, validated);
      return ApiResponse.success(booking, "Booking status updated successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getSlots(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const slots = await ProviderService.getAvailabilitySlots(providerId);
      return ApiResponse.success(slots);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async setSlots(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const body = await req.json();
      const validated = batchAvailabilitySlotsSchema.parse(body);
      const slots = await ProviderService.setAvailabilitySlots(providerId, validated.slots);
      return ApiResponse.success(slots, "Schedule slots updated successfully");
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async getWallet(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const wallet = await ProviderService.getWallet(providerId);
      return ApiResponse.success(wallet);
    } catch (error) {
      return handleApiError(error);
    }
  }

  static async requestPayout(req: NextRequest) {
    try {
      const providerId = this.getUserId(req);
      const body = await req.json();
      const validated = requestPayoutSchema.parse(body);
      const payout = await ProviderService.requestPayout(providerId, validated);
      return ApiResponse.success(payout, "Payout request submitted successfully", 201);
    } catch (error) {
      return handleApiError(error);
    }
  }
}
