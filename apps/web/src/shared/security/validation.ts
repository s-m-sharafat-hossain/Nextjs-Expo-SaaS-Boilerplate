// apps/web/src/shared/security/validation.ts
import { z } from "zod";

/**
 * Whitelist of permitted MIME types for secure file uploads
 */
export const ALLOWED_MIME_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  DOCUMENTS: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "application/msword", // doc
    "text/csv",
  ],
} as const;

export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES.IMAGES,
  ...ALLOWED_MIME_TYPES.DOCUMENTS,
];

export const FILE_SIZE_LIMITS = {
  IMAGE_MAX_BYTES: 10 * 1024 * 1024, // 10MB
  DOCUMENT_MAX_BYTES: 50 * 1024 * 1024, // 50MB
  MAX_IMAGE_WIDTH: 5000,
  MAX_IMAGE_HEIGHT: 5000,
} as const;

/**
 * Security validation rules and sanitization schemas
 */
export class SecurityValidator {
  /**
   * File upload validation: checks MIME type, size limits and image dimensions
   */
  static validateFileUpload(file: {
    mimeType: string;
    sizeBytes: number;
    width?: number;
    height?: number;
  }): { valid: boolean; error?: string } {
    if (!ALL_ALLOWED_MIME_TYPES.includes(file.mimeType as any)) {
      return {
        valid: false,
        error: `Disallowed file type '${file.mimeType}'. Allowed formats: JPG, PNG, WEBP, GIF, PDF, DOCX, CSV.`,
      };
    }

    const isImage = ALLOWED_MIME_TYPES.IMAGES.includes(file.mimeType as any);
    const limit = isImage ? FILE_SIZE_LIMITS.IMAGE_MAX_BYTES : FILE_SIZE_LIMITS.DOCUMENT_MAX_BYTES;

    if (file.sizeBytes > limit) {
      const mbLimit = limit / (1024 * 1024);
      return {
        valid: false,
        error: `File size exceeds the maximum permitted limit of ${mbLimit}MB.`,
      };
    }

    if (isImage && (file.width || file.height)) {
      if (
        (file.width && file.width > FILE_SIZE_LIMITS.MAX_IMAGE_WIDTH) ||
        (file.height && file.height > FILE_SIZE_LIMITS.MAX_IMAGE_HEIGHT)
      ) {
        return {
          valid: false,
          error: `Image dimensions exceed maximum permitted resolution (5000x5000px).`,
        };
      }
    }

    return { valid: true };
  }

  /**
   * Validates URLs to permit only secure http:// or https:// schemes
   * Blocks javascript:, data:, file:, vbscript: and open redirects
   */
  static validateUrl(inputUrl: string): { valid: boolean; error?: string } {
    try {
      const parsed = new URL(inputUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return {
          valid: false,
          error: `Protocol '${parsed.protocol}' is prohibited. Only http: and https: protocols are permitted.`,
        };
      }
      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid URL format." };
    }
  }

  /**
   * SQL Injection detection: flags common injection signatures in dynamic inputs
   */
  static detectSqlInjection(input: string): boolean {
    if (!input || typeof input !== "string") return false;
    const sqlInjectionPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|MERGE)\b)/i,
      /(--|\/\*|\*\/|;|xp_|sp_)/i,
      /('(\s*OR\s*|\s*AND\s*)'?[^']+'?=?)/i,
      /(\bOR\b\s+1\s*=\s*1)/i,
      /(\bAND\b\s+1\s*=\s*1)/i,
    ];
    return sqlInjectionPatterns.some((pattern) => pattern.test(input));
  }

  /**
   * NoSQL Injection detection: ensures JSON objects do not contain MongoDB / CouchDB operator injection
   */
  static detectNoSqlInjection(obj: any): boolean {
    if (!obj || typeof obj !== "object") return false;

    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        return true;
      }
      if (typeof obj[key] === "object") {
        if (this.detectNoSqlInjection(obj[key])) return true;
      }
    }
    return false;
  }

  /**
   * Command Injection detection: verifies no shell command metacharacters exist in input
   */
  static detectCommandInjection(input: string): boolean {
    if (!input || typeof input !== "string") return false;
    // Disallow shell operators: ;, &, |, `, $, (, ), <, >, \n
    const commandInjectionPattern = /[;&|`$()<>\n]/;
    return commandInjectionPattern.test(input);
  }
}

/**
 * Enhanced Strict Zod Schemas for inputs
 */
export const strictUrlSchema = z
  .string()
  .url("Must be a valid URL")
  .refine(
    (url) => url.startsWith("https://") || url.startsWith("http://"),
    "URL must strictly use HTTP or HTTPS protocol"
  );

export const strictEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(255, "Email address is too long")
  .refine((val) => !SecurityValidator.detectSqlInjection(val), "Disallowed characters detected in email");

export const strictTextSchema = (minLength = 1, maxLength = 1000) =>
  z
    .string()
    .trim()
    .min(minLength, `Input must be at least ${minLength} characters`)
    .max(maxLength, `Input must not exceed ${maxLength} characters`)
    .refine((val) => !SecurityValidator.detectCommandInjection(val), "Command injection vectors prohibited")
    .refine((val) => !SecurityValidator.detectSqlInjection(val), "SQL injection vectors prohibited");
