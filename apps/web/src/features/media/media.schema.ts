// apps/web/src/features/media/media.schema.ts
import { z } from "zod";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/csv",
  "video/mp4",
  "audio/mpeg",
];

export const uploadMediaSchema = z.object({
  name: z.string().min(1, "File name required"),
  size: z.number().max(10 * 1024 * 1024, "File size must not exceed 10MB"),
  mimeType: z.string().refine((val) => ALLOWED_MIME_TYPES.includes(val), {
    message: "Unsupported file MIME type. Allowed: JPG, PNG, WEBP, PDF, CSV, MP4",
  }),
  fileType: z.enum(["IMAGE", "PDF", "CSV", "VIDEO", "AUDIO", "OTHER"]).default("OTHER"),
});

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
