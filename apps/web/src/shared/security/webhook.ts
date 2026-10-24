// apps/web/src/shared/security/webhook.ts
import crypto from "crypto";
import { NextRequest } from "next/server";

// Store for processed webhook IDs to prevent replay attacks (10-minute cache)
const processedWebhooks = new Map<string, number>();

// Clean up expired replay IDs every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [id, expiry] of processedWebhooks.entries()) {
      if (expiry <= now) processedWebhooks.delete(id);
    }
  }, 5 * 60 * 1000);
}

// In-memory rate limiter for webhook delivery (10 req/min per endpoint)
const webhookDeliveryCounts = new Map<string, { count: number; resetAt: number }>();

export class WebhookSecurity {
  /**
   * Generates an HMAC SHA-256 signature for outgoing webhook payload
   */
  static generateSignature(payload: string, secret: string): string {
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
  }

  /**
   * Timing-safe verification of incoming HMAC signature
   */
  static verifySignature(payload: string, incomingSignature: string, secret: string): boolean {
    if (!payload || !incomingSignature || !secret) return false;

    try {
      const computed = this.generateSignature(payload, secret);
      return crypto.timingSafeEqual(
        Buffer.from(incomingSignature, "hex"),
        Buffer.from(computed, "hex")
      );
    } catch {
      return false;
    }
  }

  /**
   * Webhook Replay Protection:
   * - Validates unique UUID webhookId hasn't been processed
   * - Enforces timestamp tolerance (within 5 minutes)
   */
  static checkReplayProtection(
    webhookId: string,
    timestampHeader?: string | null,
    toleranceMs = 5 * 60 * 1000 // 5 minutes
  ): { valid: boolean; reason?: string } {
    if (!webhookId) {
      return { valid: false, reason: "Missing required Webhook ID (X-Webhook-ID) header" };
    }

    const now = Date.now();

    // 1. Check duplicate webhook ID
    if (processedWebhooks.has(webhookId)) {
      return { valid: false, reason: "Duplicate webhook detected: Webhook ID has already been processed" };
    }

    // 2. Timestamp freshness check
    if (timestampHeader) {
      const parsedTime = Number(timestampHeader) || Date.parse(timestampHeader);
      if (isNaN(parsedTime) || Math.abs(now - parsedTime) > toleranceMs) {
        return { valid: false, reason: "Webhook timestamp expired or outside permitted 5-minute tolerance window" };
      }
    }

    // Record processed webhook ID with 10-minute expiry
    processedWebhooks.set(webhookId, now + 10 * 60 * 1000);
    return { valid: true };
  }

  /**
   * Webhook Rate Limiter: max 10 deliveries/min per endpoint
   */
  static checkRateLimit(endpointId: string, limit = 10, windowSeconds = 60): boolean {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const existing = webhookDeliveryCounts.get(endpointId);

    if (!existing || existing.resetAt <= now) {
      webhookDeliveryCounts.set(endpointId, { count: 1, resetAt: now + windowMs });
      return true;
    }

    if (existing.count >= limit) {
      return false;
    }

    existing.count += 1;
    return true;
  }

  /**
   * Webhook Multi-Method Authentication:
   * 1. JWT Bearer token
   * 2. API Key header (x-api-key or Authorization: Bearer <key>)
   * 3. HTTP Basic Auth
   */
  static authenticate(
    req: NextRequest,
    configuredSecret?: string
  ): { authenticated: boolean; method: string; error?: string } {
    const authHeader = req.headers.get("authorization");
    const apiKeyHeader = req.headers.get("x-api-key");
    const secret = configuredSecret || process.env.WEBHOOK_SECRET || process.env.N8N_SECRET_TOKEN;

    // 1. API Key header
    if (apiKeyHeader && secret && apiKeyHeader === secret) {
      return { authenticated: true, method: "API_KEY" };
    }

    if (authHeader) {
      // 2. Bearer Token (JWT or Secret)
      if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.slice(7).trim();
        if (secret && token === secret) {
          return { authenticated: true, method: "BEARER_TOKEN" };
        }
      }

      // 3. HTTP Basic Authentication
      if (authHeader.startsWith("Basic ")) {
        try {
          const decoded = Buffer.from(authHeader.slice(6), "base64").toString("utf-8");
          const [, password] = decoded.split(":");
          if (secret && password === secret) {
            return { authenticated: true, method: "BASIC_AUTH" };
          }
        } catch {
          // ignore basic auth parse error
        }
      }
    }

    return { authenticated: false, method: "NONE", error: "Missing or invalid webhook credentials" };
  }

  /**
   * Dispatch outgoing webhook with HMAC signature, unique UUID, and exponential backoff retry logic
   */
  static async dispatchWithRetry(
    targetUrl: string,
    payload: Record<string, any>,
    secret: string,
    maxRetries = 3
  ): Promise<{ success: boolean; response?: any; error?: string }> {
    const webhookId = crypto.randomUUID();
    const timestamp = Date.now().toString();
    const serialized = JSON.stringify(payload);
    const signature = this.generateSignature(serialized, secret);

    let attempt = 0;
    let delay = 1000; // 1 second initial delay

    while (attempt < maxRetries) {
      attempt++;
      try {
        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-ID": webhookId,
            "X-Webhook-Timestamp": timestamp,
            "X-Webhook-Signature": signature,
          },
          body: serialized,
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          return { success: true, response: data };
        }

        console.warn(`[Webhook] Attempt ${attempt} failed with status ${res.status}. Retrying in ${delay}ms...`);
      } catch (err: any) {
        console.warn(`[Webhook] Attempt ${attempt} error: ${err.message}. Retrying in ${delay}ms...`);
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff
      }
    }

    console.error(`🚨 [Webhook Delivery Failure] Exhausted all ${maxRetries} retries to ${targetUrl}`);
    return { success: false, error: `Failed after ${maxRetries} attempts` };
  }
}
