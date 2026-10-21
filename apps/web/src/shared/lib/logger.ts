// src/shared/lib/logger.ts
// Structured error monitoring and system health logger

export type LogLevel = "info" | "warn" | "error";

export class Logger {
  static info(message: string, context?: Record<string, unknown>) {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, context ?? "");
  }

  static warn(message: string, context?: Record<string, unknown>) {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, context ?? "");
  }

  static error(message: string, error?: unknown, context?: Record<string, unknown>) {
    const errorDetails = error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;

    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, {
      error: errorDetails,
      ...(context ? { context } : {}),
    });

    // In production with Sentry:
    // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    //   Sentry.captureException(error);
    // }
  }
}
