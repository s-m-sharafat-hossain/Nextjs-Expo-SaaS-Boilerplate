// apps/web/src/shared/config/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/master_saas"),
    DIRECT_URL: z.string().url().optional(),
    AUTH_SECRET: z.string().min(1).default("super-secret-development-jwt-auth-key-change-in-prod-123456789"),
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
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_NAME: z.string().default("SaaSFlow Pro"),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === "test",
});
