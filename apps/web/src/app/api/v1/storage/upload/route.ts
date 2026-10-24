// apps/web/src/app/api/v1/storage/upload/route.ts
import { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";
import { s3Service, S3StorageService } from "@/shared/storage/s3";
import { auth } from "@/shared/lib/auth";

/**
 * POST /api/v1/storage/upload
 * Multipart file upload → S3
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "documents";

    if (!file) {
      return ApiResponse.error("No file provided", 400);
    }

    const contentType = file.type;
    const key = folder === "images"
      ? S3StorageService.buildImageKey(session.user.id, file.name)
      : S3StorageService.buildDocumentKey(session.user.id, file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await s3Service.upload({
      key,
      body: buffer,
      contentType,
      maxSizeMB: 25,
    });

    if (!result) {
      return ApiResponse.error("Upload failed", 500);
    }

    return ApiResponse.success(result, "File uploaded successfully");
  } catch (err: any) {
    const message = err?.message || "Upload error";
    return ApiResponse.error(message, message.includes("not allowed") || message.includes("exceeds") ? 400 : 500);
  }
}

/**
 * GET /api/v1/storage/upload?key=<key>&action=presign
 * Get pre-signed URL for direct browser upload
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }

  const { searchParams } = req.nextUrl;
  const key = searchParams.get("key");
  const contentType = searchParams.get("contentType") || "application/octet-stream";
  const action = searchParams.get("action") || "presign-upload";

  if (!key) {
    return ApiResponse.error("key is required", 400);
  }

  if (action === "presign-download") {
    const url = await s3Service.getPresignedDownloadUrl(key);
    if (!url) return ApiResponse.error("Could not generate download URL", 500);
    return ApiResponse.success({ url }, "Pre-signed download URL");
  }

  const url = await s3Service.getPresignedUploadUrl(key, contentType);
  if (!url) return ApiResponse.error("Could not generate upload URL", 500);
  return ApiResponse.success({ url, key }, "Pre-signed upload URL");
}

/**
 * DELETE /api/v1/storage/upload?key=<key>
 */
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return ApiResponse.error("Unauthorized", 401);
  }

  const { searchParams } = req.nextUrl;
  const key = searchParams.get("key");
  if (!key) return ApiResponse.error("key is required", 400);

  // Ensure user can only delete their own files
  if (!key.startsWith(`users/${session.user.id}/`)) {
    return ApiResponse.error("Forbidden — cannot delete other users' files", 403);
  }

  const deleted = await s3Service.delete(key);
  if (!deleted) return ApiResponse.error("Delete failed", 500);

  return ApiResponse.success(null, "File deleted");
}
