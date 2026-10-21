// src/shared/lib/security.ts
import { NextResponse } from "next/server";

/**
 * XSS Sanitizer: Strips unsafe HTML tags, scripts, and javascript: event attributes
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") return "";
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:[^"']*/gi, "")
    .trim();
}

/**
 * Generate CORS headers for external embeds (such as chatbot widget)
 */
export function corsHeaders(origin: string = "*"): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-widget-token",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Handle preflight OPTIONS request with CORS
 */
export function handleCorsPreflight(origin: string = "*") {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

/**
 * Constant-time comparison to prevent timing attacks on secrets
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
