// apps/web/src/features/portals/provider-portal/provider.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { ProviderService } from "./provider.service";
import {
  createServiceSchema,
  updateServiceSchema,
  updateBookingStatusSchema,
  batchAvailabilitySlotsSchema,
  requestPayoutSchema,
} from "./provider.schema";

export async function createServiceAction(providerId: string, formData: FormData) {
  try {
    const raw = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      price: formData.get("price"),
      durationMinutes: formData.get("durationMinutes") || 60,
      tags: formData.get("tags") ? String(formData.get("tags")).split(",").map((s) => s.trim()) : [],
      imageUrl: formData.get("imageUrl") || undefined,
    };
    const validated = createServiceSchema.parse(raw);
    const result = await ProviderService.createService(providerId, validated);
    revalidatePath("/provider/services");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create service" };
  }
}

export async function updateServiceAction(providerId: string, formData: FormData) {
  try {
    const raw = {
      id: formData.get("id"),
      title: formData.get("title") || undefined,
      description: formData.get("description") || undefined,
      category: formData.get("category") || undefined,
      price: formData.get("price") ? Number(formData.get("price")) : undefined,
      durationMinutes: formData.get("durationMinutes") ? Number(formData.get("durationMinutes")) : undefined,
      isActive: formData.get("isActive") !== null ? formData.get("isActive") === "true" : undefined,
      imageUrl: formData.get("imageUrl") || undefined,
    };
    const validated = updateServiceSchema.parse(raw);
    const result = await ProviderService.updateService(validated.id, providerId, validated);
    revalidatePath("/provider/services");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update service" };
  }
}

export async function updateBookingStatusAction(providerId: string, formData: FormData) {
  try {
    const raw = {
      bookingId: formData.get("bookingId"),
      status: formData.get("status"),
      cancellationReason: formData.get("cancellationReason") || undefined,
    };
    const validated = updateBookingStatusSchema.parse(raw);
    const result = await ProviderService.updateBookingStatus(providerId, validated);
    revalidatePath("/provider/bookings");
    revalidatePath("/provider");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update booking status" };
  }
}

export async function requestPayoutAction(providerId: string, formData: FormData) {
  try {
    let details: any = {};
    const rawDetails = formData.get("accountDetails");
    if (typeof rawDetails === "string") {
      try {
        details = JSON.parse(rawDetails);
      } catch {
        details = { note: rawDetails };
      }
    }

    const raw = {
      amount: formData.get("amount"),
      payoutMethod: formData.get("payoutMethod"),
      accountDetails: details,
    };
    const validated = requestPayoutSchema.parse(raw);
    const result = await ProviderService.requestPayout(providerId, validated);
    revalidatePath("/provider/payouts");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to request payout" };
  }
}
