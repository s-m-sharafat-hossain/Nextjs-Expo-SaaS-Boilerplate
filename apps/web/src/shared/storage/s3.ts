// apps/web/src/shared/storage/s3.ts
import type { PutObjectCommandInput, GetObjectCommandInput } from "@aws-sdk/client-s3";

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | ReadableStream | Blob;
  contentType: string;
  bucket?: string;
  acl?: "private" | "public-read";
  metadata?: Record<string, string>;
  maxSizeMB?: number;
}

export interface S3File {
  key: string;
  url: string;
  bucket: string;
  size?: number;
  contentType: string;
  uploadedAt: string;
  etag?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "application/pdf",
  "text/plain", "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4", "video/webm",
  "audio/mpeg", "audio/webm",
];

export class S3StorageService {
  private client: any = null;
  private bucket: string;
  private region: string;
  private cdnUrl: string | null;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET || "saasflow-uploads";
    this.region = process.env.AWS_REGION || "us-east-1";
    this.cdnUrl = process.env.AWS_CLOUDFRONT_URL || null;
    this.initClient();
  }

  private async initClient() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) return;

    try {
      const { S3Client } = await import("@aws-sdk/client-s3");
      this.client = new S3Client({
        region: this.region,
        credentials: { accessKeyId, secretAccessKey },
      });
    } catch (err) {
      console.warn("[S3] SDK init failed:", err);
    }
  }

  /**
   * Upload a file to S3
   */
  async upload(options: UploadOptions): Promise<S3File | null> {
    const { key, body, contentType, acl = "private", metadata } = options;
    const bucket = options.bucket || this.bucket;
    const maxBytes = (options.maxSizeMB || 50) * 1024 * 1024;

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
      throw new Error(`File type '${contentType}' is not allowed.`);
    }

    // Check body size for Buffer/Uint8Array
    if (body instanceof Buffer || body instanceof Uint8Array) {
      if (body.length > maxBytes) {
        throw new Error(`File exceeds maximum allowed size of ${options.maxSizeMB || 50}MB.`);
      }
    }

    if (!this.client) {
      console.warn("[S3] Client not initialized — returning mock URL");
      return {
        key,
        url: `https://mock-s3.example.com/${bucket}/${key}`,
        bucket,
        contentType,
        uploadedAt: new Date().toISOString(),
      };
    }

    try {
      const { PutObjectCommand } = await import("@aws-sdk/client-s3");
      const input: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: body as any,
        ContentType: contentType,
        ACL: acl,
        Metadata: metadata,
      };

      const result = await this.client.send(new PutObjectCommand(input));

      const url = this.cdnUrl
        ? `${this.cdnUrl}/${key}`
        : `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        key,
        url,
        bucket,
        contentType,
        uploadedAt: new Date().toISOString(),
        etag: result.ETag,
      };
    } catch (err) {
      console.error("[S3] Upload error:", err);
      return null;
    }
  }

  /**
   * Generate a pre-signed URL for direct browser upload (avoids server proxy)
   */
  async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 300): Promise<string | null> {
    if (!this.client) return null;
    if (!ALLOWED_MIME_TYPES.includes(contentType)) return null;

    try {
      const { PutObjectCommand } = await import("@aws-sdk/client-s3");
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

      return getSignedUrl(
        this.client,
        new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType }),
        { expiresIn }
      );
    } catch (err) {
      console.error("[S3] Presigned URL error:", err);
      return null;
    }
  }

  /**
   * Generate a pre-signed URL for download (private objects)
   */
  async getPresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string | null> {
    if (!this.client) return null;
    try {
      const { GetObjectCommand } = await import("@aws-sdk/client-s3");
      const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

      return getSignedUrl(
        this.client,
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { expiresIn }
      );
    } catch (err) {
      console.error("[S3] Download presign error:", err);
      return null;
    }
  }

  /**
   * Delete an object
   */
  async delete(key: string, bucket?: string): Promise<boolean> {
    if (!this.client) return false;
    try {
      const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      await this.client.send(
        new DeleteObjectCommand({ Bucket: bucket || this.bucket, Key: key })
      );
      return true;
    } catch (err) {
      console.error("[S3] Delete error:", err);
      return false;
    }
  }

  /**
   * Build an optimized image key with WebP conversion marker
   */
  static buildImageKey(userId: string, filename: string, variant: "original" | "thumb" | "medium" | "large" = "original"): string {
    const ext = variant === "original" ? filename.split(".").pop() : "webp";
    const base = filename.replace(/\.[^.]+$/, "");
    const timestamp = Date.now();
    return `users/${userId}/images/${variant}/${base}-${timestamp}.${ext}`;
  }

  /**
   * Build a document key (non-image files)
   */
  static buildDocumentKey(userId: string, filename: string): string {
    return `users/${userId}/documents/${Date.now()}-${filename}`;
  }
}

export const s3Service = new S3StorageService();
