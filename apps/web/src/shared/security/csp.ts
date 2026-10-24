// apps/web/src/shared/security/csp.ts
import crypto from "crypto";

export interface CspOptions {
  reportOnly?: boolean;
  extraConnectDomains?: string[];
  extraImageDomains?: string[];
}

export class CspManager {
  /**
   * Generates a cryptographically random base64 nonce for CSP script/style authorization
   */
  static generateNonce(): string {
    return crypto.randomBytes(16).toString("base64");
  }

  /**
   * Builds the Content Security Policy directive string
   */
  static buildCspHeader(nonce: string, options: CspOptions = {}): {
    headerName: string;
    headerValue: string;
  } {
    const isReportOnly = options.reportOnly ?? (process.env.CSP_REPORT_ONLY === "true");

    const connectDomains = [
      "'self'",
      "https://neon.tech",
      "https://*.neon.tech",
      "https://api.resend.com",
      "https://resend.com",
      "https://api.stripe.com",
      "https://stripe.com",
      "https://api.openai.com",
      "https://openai.com",
      ...(options.extraConnectDomains || []),
    ].join(" ");

    const imageDomains = [
      "'self'",
      "data:",
      "blob:",
      "https://images.unsplash.com",
      "https://lh3.googleusercontent.com",
      "https://avatars.githubusercontent.com",
      "https://*.supabase.co",
      "https://utfs.io",
      ...(options.extraImageDomains || []),
    ].join(" ");

    const directives = [
      "default-src 'self'",
      // Inline scripts require valid nonce; eval() is blocked by omitting 'unsafe-eval'
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: 'unsafe-inline'`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      `img-src ${imageDomains}`,
      `connect-src ${connectDomains}`,
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "block-all-mixed-content",
      "upgrade-insecure-requests",
      "report-uri /api/v1/security/csp-report",
    ];

    const headerName = isReportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
    const headerValue = directives.join("; ");

    return { headerName, headerValue };
  }
}
