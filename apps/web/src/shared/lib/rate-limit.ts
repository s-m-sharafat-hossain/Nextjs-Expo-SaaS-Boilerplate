// src/shared/lib/rate-limit.ts
// Dual-mode Rate Limiter: In-memory sliding window by default, Upstash Redis ready

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory token bucket cache for standalone / development mode
const memoryStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale memory records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Identifier: user ID, IP address, or API key */
  identifier: string;
  /** Maximum allowed requests within the window */
  limit?: number;
  /** Window duration in seconds (default: 60 seconds) */
  windowSeconds?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for an identifier (e.g. IP or User ID)
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { identifier, limit = 10, windowSeconds = 60 } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  // 1. Upstash Redis check if credentials exist
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const key = `ratelimit:${identifier}`;
      const res = await fetch(`${redisUrl}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${redisToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["TTL", key],
        ]),
      });

      if (res.ok) {
        const [incrRes, ttlRes] = await res.json();
        const currentCount = Number(incrRes.result ?? 1);
        let ttl = Number(ttlRes.result ?? -1);

        if (ttl === -1) {
          // Set expiry if first request
          await fetch(`${redisUrl}/EXPIRE/${key}/${windowSeconds}`, {
            headers: { Authorization: `Bearer ${redisToken}` },
          });
          ttl = windowSeconds;
        }

        const remaining = Math.max(0, limit - currentCount);
        return {
          success: currentCount <= limit,
          limit,
          remaining,
          reset: now + ttl * 1000,
        };
      }
    } catch (err) {
      console.warn("[RateLimit] Upstash request failed, falling back to memory:", err);
    }
  }

  // 2. High-performance In-Memory Sliding Window Fallback
  const key = `mem:${identifier}`;
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    // New window
    memoryStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Existing window
  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    success: existing.count <= limit,
    limit,
    remaining,
    reset: existing.resetAt,
  };
}
