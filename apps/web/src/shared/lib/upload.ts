// src/shared/lib/upload.ts
// Universal file upload helper (UploadThing-style / Supabase Storage / S3)
// Replace the implementation body with your chosen provider

export interface UploadResult {
  url: string;    // Public CDN URL
  key: string;    // Storage key / path
  name: string;
  size: number;
  mimeType: string;
}

/**
 * Demo upload — replace with actual provider SDK (UploadThing / Supabase / S3)
 *
 * ─ UploadThing: import { UTApi } from "uploadthing/server"
 * ─ Supabase:    import { supabase } from "./supabase"; supabase.storage.from("files").upload(path, file)
 * ─ AWS S3:      import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
 */
export async function uploadFile(
  file: File,
  folder = "uploads"
): Promise<UploadResult> {
  // Demo mode: return a placeholder result
  if (!process.env.UPLOADTHING_TOKEN && !process.env.SUPABASE_URL) {
    const ext = file.name.split(".").pop() ?? "bin";
    const key = `${folder}/${Date.now()}.${ext}`;
    console.log(`[Upload Demo] Would upload ${file.name} to ${key}`);
    return {
      url: `https://placehold.co/600x400?text=${encodeURIComponent(file.name)}`,
      key,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }

  // ── Replace below with your chosen SDK ──
  throw new Error(
    "Upload provider not configured. Set UPLOADTHING_TOKEN or SUPABASE_URL in .env"
  );
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  options: { maxSizeMB?: number; allowedTypes?: string[] } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 5, allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"] } = options;

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Max size: ${maxSizeMB}MB` };
  }
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed: ${file.type}` };
  }
  return { valid: true };
}
