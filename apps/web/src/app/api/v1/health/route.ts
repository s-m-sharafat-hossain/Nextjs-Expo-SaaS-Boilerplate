// src/app/api/v1/health/route.ts
import { testDatabaseConnection } from "@/shared/lib/db";
import { ApiResponse } from "@/shared/utils/api-response";
import { siteConfig } from "@shared/config";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const dbStatus = await testDatabaseConnection();

  const healthData = {
    app: siteConfig.name,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    database: {
      provider: "PostgreSQL (Supabase / Neon)",
      status: dbStatus.connected ? "HEALTHY" : "DISCONNECTED (Demo Mode)",
      latency: `${dbStatus.latencyMs}ms`,
      error: dbStatus.error || null,
    },
    paymentGateways: {
      default: siteConfig.payment.defaultGateway,
      enabled: siteConfig.payment.enabledGateways,
    },
  };

  if (!dbStatus.connected) {
    return ApiResponse.success(
      healthData,
      "Application is running in Portfolio Instant Demo mode (PostgreSQL offline or pending configuration)"
    );
  }

  return ApiResponse.success(healthData, "Database and API services healthy");
}
