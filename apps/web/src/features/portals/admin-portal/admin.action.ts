// apps/web/src/features/portals/admin-portal/admin.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { AdminService } from "./admin.service";
import {
  reviewKycSchema,
  processPayoutSchema,
  verifyTransactionSchema,
  updateUserStatusSchema,
} from "./admin.schema";

export async function reviewKycAction(formData: FormData) {
  try {
    const raw = {
      documentId: formData.get("documentId"),
      status: formData.get("status"),
      rejectionReason: formData.get("rejectionReason") || undefined,
    };
    const validated = reviewKycSchema.parse(raw);
    const result = await AdminService.reviewKyc(validated);
    revalidatePath("/admin");
    revalidatePath("/admin/kyc");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to review KYC" };
  }
}

export async function processPayoutAction(formData: FormData) {
  try {
    const raw = {
      payoutId: formData.get("payoutId"),
      status: formData.get("status"),
      rejectionReason: formData.get("rejectionReason") || undefined,
      transactionRef: formData.get("transactionRef") || undefined,
    };
    const validated = processPayoutSchema.parse(raw);
    const result = await AdminService.processPayout(validated);
    revalidatePath("/admin/payouts");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to process payout" };
  }
}

export async function verifyTransactionAction(formData: FormData) {
  try {
    const raw = {
      transactionId: formData.get("transactionId"),
      status: formData.get("status"),
      rejectionReason: formData.get("rejectionReason") || undefined,
    };
    const validated = verifyTransactionSchema.parse(raw);
    const result = await AdminService.verifyTransaction(validated);
    revalidatePath("/admin/transactions");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to verify transaction" };
  }
}

export async function updateUserStatusAction(formData: FormData) {
  try {
    const raw = {
      userId: formData.get("userId") as string,
      isActive: formData.get("isActive") !== null ? formData.get("isActive") === "true" : undefined,
      isBanned: formData.get("isBanned") !== null ? formData.get("isBanned") === "true" : undefined,
      role: (formData.get("role") as any) || undefined,
      creditsDelta: formData.get("creditsDelta") ? Number(formData.get("creditsDelta")) : undefined,
    };
    const validated = updateUserStatusSchema.parse(raw);
    const result = await AdminService.updateUser(validated);
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user status" };
  }
}
