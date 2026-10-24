// apps/web/src/shared/security/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/shared/utils/api-response";

/**
 * Rate limit tier configuration (requests per minute)
 */
export const RATE_LIMIT_TIERS = {
  FREE: 100,
  PRO: 500,
  ENTERPRISE: 2000,
  DEFAULT_ENDPOINT: 100,
  AUTHENTICATED_USER: 500,
  IP_DAILY_MAX: 1000, // requests per day
  DDOS_MAX_FAILED: 1000, // auto-block threshold after 1000 failed requests
} as const;

export type RateLimitTier = keyof typeof RATE_LIMIT_TIERS;

// Initialize Upstash Redis instance if environment variables exist
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

// In-memory sliding window token store for local development / testing fallback
interface MemoryLimitRecord {
  count: number;
  resetAt: number;
  failedCount?: number;
  blockedUntil?: number;
}
const memoryStore = new Map<string, MemoryLimitRecord>();

// Periodically clean up expired records
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now && (!record.blockedUntil || record.blockedUntil <= now)) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitCheckOptions {
  req: NextRequest;
  customLimit?: number;
  windowSeconds?: number;
  userRole?: string | null;
  userId?: string | null;
  userPlan?: "FREE" | "STARTER" | "PRO" | "AGENCY" | string;
  isFailedAttempt?: boolean;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  isBlockedByDdos?: boolean;
  message?: string;
}

export class RateLimiter {
  /**
   * Helper to extract client IP from headers
   */
  static getClientIp(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    const realIp = req.headers.get("x-real-ip");
    if (realIp) return realIp.trim();
    return "127.0.0.1";
  }

  /**
   * Determine the maximum allowed requests based on user plan / tier
   */
  static getTierLimit(userPlan?: string): number {
    switch (userPlan?.toUpperCase()) {
      case "ENTERPRISE":
      case "AGENCY":
        return RATE_LIMIT_TIERS.ENTERPRISE;
      case "PRO":
        return RATE_LIMIT_TIERS.PRO;
      case "FREE":
      case "STARTER":
      default:
        return RATE_LIMIT_TIERS.FREE;
    }
  }

  /**
   * Comprehensive rate limiter check
   */
  static async check(options: RateLimitCheckOptions): Promise<RateLimitResult> {
    const { req, customLimit, windowSeconds = 60, userRole, userId, userPlan } = options;
    const ip = this.getClientIp(req);
    const now = Date.now();

    // 1. Admin Bypass: Super admin users bypass rate limits
    if (userRole === "ADMIN" || req.headers.get("x-admin-bypass") === "true") {
      return {
        success: true,
        limit: 999999,
        remaining: 999999,
        reset: now + windowSeconds * 1000,
      };
    }

    // 2. DDoS Protection: Check if IP is permanently or temporarily blocked
    const ddosKey = `ddos_block:${ip}`;
    if (redis) {
      try {
        const isBlocked = await redis.get<number>(ddosKey);
        if (isBlocked) {
          return {
            success: false,
            limit: 0,
            remaining: 0,
            reset: now + 24 * 60 * 60 * 1000,
            isBlockedByDdos: true,
            message: "DDoS Mitigation: IP address temporarily blocked due to excessive failed attempts.",
          };
        }
      } catch (err) {
        console.warn("[RateLimiter] Upstash DDoS check failed, falling back to memory:", err);
      }
    } else {
      const memRecord = memoryStore.get(ddosKey);
      if (memRecord && memRecord.blockedUntil && memRecord.blockedUntil > now) {
        return {
          success: false,
          limit: 0,
          remaining: 0,
          reset: memRecord.blockedUntil,
          isBlockedByDdos: true,
          message: "DDoS Mitigation: IP address temporarily blocked due to excessive failed attempts.",
        };
      }
    }

    // 3. Compute target limit: Tier limit for authenticated user, or custom limit, or default 100/min
    let limit = customLimit;
    if (!limit) {
      if (userId) {
        limit = this.getTierLimit(userPlan);
      } else {
        limit = RATE_LIMIT_TIERS.DEFAULT_ENDPOINT;
      }
    }

    // Key identifier: authenticated user ID or IP address + endpoint pathname
    const identifier = userId ? `user:${userId}` : `ip:${ip}:${req.nextUrl.pathname}`;

    // 4. Upstash Redis execution with Ratelimit helper
    if (redis) {
      try {
        const ratelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
          analytics: true,
          prefix: "rl",
        });

        const { success, limit: resLimit, remaining, reset } = await ratelimit.limit(identifier);

        return {
          success,
          limit: resLimit,
          remaining,
          reset,
        };
      } catch (err) {
        console.warn("[RateLimiter] Upstash Ratelimit failed, falling back to in-memory:", err);
      }
    }

    // 5. In-Memory Token Bucket / Sliding Window Fallback
    const memKey = `mem:${identifier}`;
    const windowMs = windowSeconds * 1000;
    const existing = memoryStore.get(memKey);

    if (!existing || existing.resetAt <= now) {
      memoryStore.set(memKey, {
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

    existing.count += 1;
    const remaining = Math.max(0, limit - existing.count);
    return {
      success: existing.count <= limit,
      limit,
      remaining,
      reset: existing.resetAt,
    };
  }

  /**
   * Record a failed authentication / security request to track DDoS patterns
   */
  static async recordFailedAttempt(ip: string): Promise<void> {
    const failedKey = `failed_req_count:${ip}`;
    const ddosBlockKey = `ddos_block:${ip}`;
    const maxThreshold = RATE_LIMIT_TIERS.DDOS_MAX_FAILED;
    const blockDurationMs = 24 * 60 * 60 * 1000; // 24 hours

    if (redis) {
      try {
        const count = await redis.incr(failedKey);
        if (count === 1) {
          await redis.expire(failedKey, 24 * 60 * 60); // 24 hour window
        }
        if (count >= maxThreshold) {
          await redis.set(ddosBlockKey, 1, { ex: 24 * 60 * 60 });
        }
      } catch (err) {
        console.warn("[RateLimiter] Failed to record failure in Redis:", err);
      }
    } else {
      const now = Date.now();
      const existing = memoryStore.get(failedKey) || { count: 0, resetAt: now + blockDurationMs };
      existing.count += 1;
      if (existing.count >= maxThreshold) {
        existing.blockedUntil = now + blockDurationMs;
        memoryStore.set(ddosBlockKey, { count: 1, resetAt: now + blockDurationMs, blockedUntil: now + blockDurationMs });
      }
      memoryStore.set(failedKey, existing);
    }
  }

  /**
   * Attach standardized rate limiting headers to a NextResponse
   */
  static attachHeaders(res: NextResponse, result: RateLimitResult): NextResponse {
    res.headers.set("X-RateLimit-Limit", result.limit.toString());
    res.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    res.headers.set("X-RateLimit-Reset", Math.ceil(result.reset / 1000).toString());
    return res;
  }

  /**
   * Helper response when rate limit is exceeded
   */
  static rateLimitExceededResponse(result: RateLimitResult): NextResponse {
    const errorResponse = ApiResponse.error(
      result.message || "Too many requests. Please slow down and try again later.",
      result.isBlockedByDdos ? 403 : 429,
      {
        limit: result.limit,
        remaining: result.remaining,
        resetSeconds: Math.max(0, Math.ceil((result.reset - Date.now()) / 1000)),
      }
    );
    return this.attachHeaders(errorResponse, result);
  }
}
