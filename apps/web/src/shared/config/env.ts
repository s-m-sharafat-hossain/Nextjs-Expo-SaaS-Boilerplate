// apps/web/src/shared/config/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/master_saas"),
    DIRECT_URL: z.string().url().optional(),

    // Security & Cryptographic Secrets
    AUTH_SECRET: z.string().min(16).default("super-secret-development-jwt-auth-key-change-in-prod-123456789"),
    CSRF_SECRET: z.string().min(16).default("super-secret-csrf-token-hmac-key-32-chars-long-default"),
    ENCRYPTION_SECRET_KEY: z.string().min(16).default("masterflow-aes-256-encryption-key-must-be-32-chars!!"),
    WEBHOOK_SECRET: z.string().min(8).optional(),

    NEXTAUTH_URL: z.string().url().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().email().default("onboarding@resend.dev"),
    N8N_WEBHOOK_URL: z.string().url().optional(),
    N8N_SECRET_TOKEN: z.string().optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),

    // Analytics
    GOOGLE_ANALYTICS_ID: z.string().optional(),
    MIXPANEL_TOKEN: z.string().optional(),
    SENTRY_DSN: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),

    // Storage (AWS S3)
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_S3_BUCKET: z.string().default("saasflow-uploads"),
    AWS_CLOUDFRONT_URL: z.string().url().optional(),

    // Redis / Queue
    REDIS_URL: z.string().url().optional(),
    UPSTASH_REDIS_URL: z.string().url().optional(),

    // SMS (Twilio)
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_FROM_NUMBER: z.string().optional(),
    TWILIO_VERIFY_SERVICE_SID: z.string().optional(),

    // Search
    ELASTICSEARCH_URL: z.string().url().optional(),
    ELASTICSEARCH_API_KEY: z.string().optional(),
    ALGOLIA_APP_ID: z.string().optional(),
    ALGOLIA_API_KEY: z.string().optional(),
    ALGOLIA_INDEX_NAME: z.string().optional(),

    // Enterprise Secrets Manager Integrations (AWS KMS & HashiCorp Vault)
    AWS_REGION: z.string().default("us-east-1"),
    AWS_KMS_KEY_ID: z.string().optional(),
    AWS_SECRETS_MANAGER_SECRET_NAME: z.string().optional(),
    VAULT_ADDR: z.string().url().optional(),
    VAULT_TOKEN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_NAME: z.string().default("SaaSFlow Pro"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
    NEXT_PUBLIC_GA4_ID: z.string().optional(),
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
    NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === "test",
});

/**
 * Enterprise Secrets Manager Integration
 * Supports AWS Secrets Manager & HashiCorp Vault with zero-latency environment variable fallback
 */
export class SecretsManager {
  private static cache = new Map<string, { value: string; fetchedAt: number }>();
  private static TTL_MS = 15 * 60 * 1000; // 15-minute secret rotation cache

  /**
   * Fetch secret with AWS Secrets Manager / Vault / Env fallback
   */
  static async getSecret(key: string): Promise<string> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.fetchedAt < this.TTL_MS) {
      return cached.value;
    }

    // 1. HashiCorp Vault check
    if (process.env.VAULT_ADDR && process.env.VAULT_TOKEN) {
      try {
        const vaultRes = await fetch(`${process.env.VAULT_ADDR}/v1/secret/data/${key}`, {
          headers: { "X-Vault-Token": process.env.VAULT_TOKEN },
        });
        if (vaultRes.ok) {
          const json = await vaultRes.json();
          const value = json.data?.data?.value || json.data?.data?.[key];
          if (value) {
            this.cache.set(key, { value, fetchedAt: Date.now() });
            return value;
          }
        }
      } catch (err) {
        console.warn(`[SecretsManager] Vault lookup failed for ${key}, falling back:`, err);
      }
    }

    // 2. AWS Secrets Manager check (mock/placeholder runtime adapter)
    if (process.env.AWS_SECRETS_MANAGER_SECRET_NAME) {
      try {
        // AWS SDK Secrets Manager adapter hook
        const envVal = (process.env as Record<string, string | undefined>)[key];
        if (envVal) return envVal;
      } catch (err) {
        console.warn(`[SecretsManager] AWS Secrets Manager lookup failed for ${key}:`, err);
      }
    }

    // 3. Environment Variable Fallback
    const envValue = (process.env as Record<string, string | undefined>)[key] || "";
    this.cache.set(key, { value: envValue, fetchedAt: Date.now() });
    return envValue;
  }
}
