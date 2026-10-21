// apps/web/src/features/portals/consumer-portal/consumer.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { ConsumerService } from "./consumer.service";
import {
  createBookingSchema,
  cancelBookingSchema,
  submitReviewSchema,
} from "./consumer.schema";

export async function createBookingAction(consumerId: string, formData: FormData) {
  try {
    const raw = {
      serviceId: formData.get("serviceId"),
      scheduledAt: formData.get("scheduledAt"),
      notes: formData.get("notes") || undefined,
    };
    const validated = createBookingSchema.parse(raw);
    const result = await ConsumerService.createBooking(consumerId, validated);
    revalidatePath("/consumer/bookings");
    revalidatePath("/consumer");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to book appointment" };
  }
}

export async function cancelBookingAction(consumerId: string, formData: FormData) {
  try {
    const raw = {
      bookingId: formData.get("bookingId"),
      reason: formData.get("reason") || undefined,
    };
    const validated = cancelBookingSchema.parse(raw);
    const result = await ConsumerService.cancelBooking(consumerId, validated.bookingId, validated.reason);
    revalidatePath("/consumer/bookings");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to cancel booking" };
  }
}

export async function submitReviewAction(consumerId: string, formData: FormData) {
  try {
    const raw = {
      providerId: formData.get("providerId"),
      bookingId: formData.get("bookingId") || undefined,
      rating: formData.get("rating"),
      comment: formData.get("comment"),
    };
    const validated = submitReviewSchema.parse(raw);
    const result = await ConsumerService.submitReview(consumerId, validated);
    revalidatePath("/consumer/bookings");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit review" };
  }
}
