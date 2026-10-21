// apps/web/src/shared/security/signature.ts
import crypto from "crypto";
import { siteConfig } from "@shared/config";

/**
 * Validates n8n webhook secret header
 */
export function verifyN8nSecret(incomingToken: string | null): boolean {
  const secret = siteConfig.n8n.secretToken;
  if (!secret) return true; // If no secret configured, allow in dev
  if (!incomingToken) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(incomingToken),
      Buffer.from(secret)
    );
  } catch {
    return false;
  }
}

/**
 * Validates HMAC SHA-256 webhook signatures
 */
export function verifyHmacSha256(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  try {
    const computed = crypto
      .createHmac("sha256", secretKey)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computed)
    );
  } catch {
    return false;
  }
}
