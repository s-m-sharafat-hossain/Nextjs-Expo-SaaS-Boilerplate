# Environment Variables

This document lists all required and optional environment variables for the Master Boilerplate.

## Database

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/master_boilerplate_1?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/master_boilerplate_1?schema=public"
```

## Application

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Authentication

```env
# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Email (Resend)

```env
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="noreply@yourdomain.com"
```

## Payment Gateways

```env
# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PRICE_STARTER_MONTHLY="price_id_here"
STRIPE_PRICE_PRO_MONTHLY="price_id_here"
STRIPE_PRICE_AGENCY_MONTHLY="price_id_here"

# SSLCommerz (Bangladesh)
SSLCOMMERZ_STORE_ID="your_store_id"
SSLCOMMERZ_STORE_PASS="your_store_password"

# bKash (Bangladesh)
BKASH_MERCHANT_ID="your_merchant_id"
BKASH_PASSWORD="your_password"

# Razorpay (India)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"

# PayPal
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"

# PayStack (Africa)
PAYSTACK_SECRET_KEY="your_paystack_secret_key"
```

## AI & Automation

```env
OPENAI_API_KEY="sk-your-openai-api-key"
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/path"
N8N_SECRET_TOKEN="your-n8n-secret-token"
```

## Rate Limiting (Upstash Redis)

```env
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"
```

## Analytics

```env
NEXT_PUBLIC_POSTHOG_KEY="your-posthog-key"
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"
```

## Error Monitoring (Sentry - Optional)

```env
NEXT_PUBLIC_SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

## File Upload

```env
# UploadThing
UPLOADTHING_TOKEN="your_uploadthing_token"

# Supabase Storage
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## Development vs Production

### Development
- Use test/stripe keys
- Use sandbox payment gateways
- Set `NODE_ENV=development`

### Production
- Use live Stripe keys
- Use production payment gateway credentials
- Set `NODE_ENV=production`
- Ensure all secrets are set
- Enable rate limiting with Upstash Redis
- Configure error monitoring (Sentry)
