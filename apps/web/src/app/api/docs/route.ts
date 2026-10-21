// src/app/api/docs/route.ts
import { NextResponse } from "next/server";
import { openApiSpec } from "@/shared/config/openapi";

export async function GET() {
  return NextResponse.json(openApiSpec);
}
