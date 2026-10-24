// apps/web/src/app/api/v2/health/route.ts
import { NextResponse } from "next/server";
import { siteConfig } from "@shared/config";

export async function GET() {
  const v2HealthData = {
    apiVersion: "2.0.0-preview",
    app: siteConfig.name,
    status: "HEALTHY",
    features: {
      zeroTrustSecurity: true,
      oauth2Server: true,
      gdprPortability: true,
      ddosShield: true,
      upstashRateLimiter: true,
    },
    deprecationNotice: {
      v1DeprecationDate: "2026-12-31",
      v1SunsetDate: "2027-06-30",
      migrationGuide: "/docs#migration-v2",
    },
    timestamp: new Date().toISOString(),
  };

  const response = NextResponse.json({
    success: true,
    statusCode: 200,
    message: "MasterFlow SaaS API v2 (Next-Gen Preview)",
    data: v2HealthData,
  });

  // Enterprise API deprecation standard headers (RFC 8594)
  response.headers.set("Deprecation", "@2026-12-31");
  response.headers.set("Sunset", "Wed, 30 Jun 2027 23:59:59 GMT");
  response.headers.set("Link", '</docs#migration-v2>; rel="deprecation"; type="text/html"');

  return response;
}
