// apps/web/src/features/media/media.action.ts
"use server";

import { MediaService } from "./media.service";
import { uploadMediaSchema, UploadMediaInput } from "./media.schema";
import { revalidatePath } from "next/cache";

export async function uploadMediaAction(userId: string, input: UploadMediaInput) {
  try {
    const validated = uploadMediaSchema.parse(input);
    const result = await MediaService.upload(userId, validated);
    revalidatePath("/consumer");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to upload file" };
  }
}

export async function deleteMediaAction(userId: string, fileId: string) {
  try {
    await MediaService.delete(userId, fileId);
    revalidatePath("/consumer");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete file" };
  }
}
