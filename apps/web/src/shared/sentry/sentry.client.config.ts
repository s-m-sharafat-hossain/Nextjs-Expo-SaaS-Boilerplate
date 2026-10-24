// apps/web/src/shared/sentry/sentry.client.config.ts
/**
 * Sentry Client-Side Configuration
 * Instruments browser errors, performance, and replays
 */
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const NODE_ENV = process.env.NODE_ENV || "development";

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

    // Performance
    tracesSampleRate: NODE_ENV === "production" ? 0.1 : 1.0,

    // Session Replay for bug reproduction (production only)
    replaysSessionSampleRate: NODE_ENV === "production" ? 0.05 : 0,
    replaysOnErrorSampleRate: NODE_ENV === "production" ? 0.5 : 0,

    beforeSend(event) {
      // Strip auth tokens from breadcrumbs
      if (Array.isArray(event.breadcrumbs)) {
        event.breadcrumbs = event.breadcrumbs.map((b: any) => {
          if (b.category === "fetch" || b.category === "xhr") {
            if (b.data?.url?.includes("/api/")) {
              delete b.data.requestBody;
            }
          }
          return b;
        });
      }
      return event;
    },

    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      "Failed to fetch",
      "ChunkLoadError",
    ],
  });
}

export { Sentry };
