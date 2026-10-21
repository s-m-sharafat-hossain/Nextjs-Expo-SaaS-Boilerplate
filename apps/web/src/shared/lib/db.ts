// src/shared/lib/db.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/**
 * Common Singleton Prisma Client for Next.js App Router
 * Optimized for serverless PostgreSQL connection pooling (Neon, Supabase PgBouncer)
 */
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export const prisma = db;

/**
 * Helper to check database connectivity and latency (Supabase / Neon / Postgres)
 */
export async function testDatabaseConnection(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = performance.now();
  try {
    await db.$queryRaw`SELECT 1`;
    const latencyMs = Math.round(performance.now() - start);
    return { connected: true, latencyMs };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    return { connected: false, latencyMs: 0, error: message };
  }
}
