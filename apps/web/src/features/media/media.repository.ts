// apps/web/src/features/media/media.repository.ts
import { prisma } from "@/shared/lib/db";
import { FileType } from "@prisma/client";

export class MediaRepository {
  static async saveFile(data: {
    userId: string;
    name: string;
    url: string;
    key: string;
    size: number;
    mimeType: string;
    fileType: FileType;
  }) {
    return prisma.mediaFile.create({
      data,
    });
  }

  static async listUserFiles(userId: string) {
    return prisma.mediaFile.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getFileById(fileId: string, userId: string) {
    return prisma.mediaFile.findFirst({
      where: { id: fileId, userId },
    });
  }

  static async deleteFile(fileId: string, userId: string) {
    return prisma.mediaFile.deleteMany({
      where: { id: fileId, userId },
    });
  }
}
