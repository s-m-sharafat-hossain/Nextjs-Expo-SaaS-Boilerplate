// apps/web/src/shared/sentry/sentry.server.config.ts
/**
 * Sentry Server-Side Configuration
 * Instruments errors, performance, and traces on the Next.js server
 */
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const NODE_ENV = process.env.NODE_ENV || "development";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,

    // Performance monitoring
    tracesSampleRate: NODE_ENV === "production" ? 0.2 : 1.0,

    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

    // Redact sensitive data before sending to Sentry
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers["Authorization"];
        delete event.request.headers["Cookie"];
        delete event.request.headers["x-api-key"];
      }
      if (event.user) {
        delete event.user.email;
        delete event.user.ip_address;
      }
      return event;
    },

    // Ignore known non-critical errors
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      "NetworkError when attempting to fetch resource",
      "Failed to fetch",
      "ChunkLoadError",
      /^Loading chunk \d+ failed/,
    ],

    integrations: [
      Sentry.prismaIntegration(),
    ],
  });
}

export { Sentry };
