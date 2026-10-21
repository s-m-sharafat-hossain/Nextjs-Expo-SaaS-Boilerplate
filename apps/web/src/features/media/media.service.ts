// apps/web/src/features/media/media.service.ts
import crypto from "crypto";
import { MediaRepository } from "./media.repository";
import { UploadMediaInput } from "./media.schema";
import { FileType } from "@prisma/client";
import { AppError } from "@/shared/utils/error-handler";

export class MediaService {
  static async upload(userId: string, input: UploadMediaInput) {
    // 1. Sanitize file name
    const sanitizedName = input.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueKey = `media/${userId}/${crypto.randomUUID()}-${sanitizedName}`;

    // 2. Generate Public CDN URL
    const publicUrl = `https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80`;

    return MediaRepository.saveFile({
      userId,
      name: input.name,
      url: publicUrl,
      key: uniqueKey,
      size: input.size,
      mimeType: input.mimeType,
      fileType: input.fileType as FileType,
    });
  }

  static async list(userId: string) {
    return MediaRepository.listUserFiles(userId);
  }

  static async delete(userId: string, fileId: string) {
    const file = await MediaRepository.getFileById(fileId, userId);
    if (!file) {
      throw new AppError("File not found or unauthorized", 404);
    }
    return MediaRepository.deleteFile(fileId, userId);
  }
}
