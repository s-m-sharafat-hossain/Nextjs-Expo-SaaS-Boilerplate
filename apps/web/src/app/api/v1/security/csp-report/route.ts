// apps/web/src/app/api/v1/security/csp-report/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();
    console.warn("🛡️ [CSP Violation Detected]:", JSON.stringify(report, null, 2));
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
