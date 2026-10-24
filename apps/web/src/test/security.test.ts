// apps/web/src/test/security.test.ts
import { describe, it, expect } from "vitest";
import { CsrfProtection } from "@/shared/security/csrf";
import { CspManager } from "@/shared/security/csp";
import { SecurityValidator } from "@/shared/security/validation";
import { InputSanitizer } from "@/shared/security/sanitizer";
import { DataProtection } from "@/shared/security/encryption";
import { WebhookSecurity } from "@/shared/security/webhook";
import { RATE_LIMIT_TIERS } from "@/shared/security/rate-limiter";

describe("Phase 1: Critical Security Suite", () => {
  describe("1. Rate Limiter Configuration", () => {
    it("should export correct tiered rate limits", () => {
      expect(RATE_LIMIT_TIERS.FREE).toBe(100);
      expect(RATE_LIMIT_TIERS.PRO).toBe(500);
      expect(RATE_LIMIT_TIERS.ENTERPRISE).toBe(2000);
      expect(RATE_LIMIT_TIERS.DDOS_MAX_FAILED).toBe(1000);
    });
  });

  describe("2. CSRF Double-Submit Protection", () => {
    it("should generate a valid HMAC-signed CSRF token", () => {
      const { token, rawSecret } = CsrfProtection.generateToken();
      expect(token).toBeDefined();
      expect(rawSecret).toBeDefined();
      expect(token).toContain(".");
      expect(CsrfProtection.verifyToken(token)).toBe(true);
    });

    it("should reject tampered CSRF tokens", () => {
      const { token } = CsrfProtection.generateToken();
      const tampered = token.replace(/a/g, "b");
      expect(CsrfProtection.verifyToken(tampered)).toBe(false);
      expect(CsrfProtection.verifyToken("invalid-token-string")).toBe(false);
    });
  });

  describe("3. Content Security Policy & Nonce Generator", () => {
    it("should generate unique base64 nonces", () => {
      const nonce1 = CspManager.generateNonce();
      const nonce2 = CspManager.generateNonce();
      expect(nonce1).not.toBe(nonce2);
      expect(nonce1.length).toBeGreaterThan(16);
    });

    it("should build strict CSP headers with domain whitelisting and block eval", () => {
      const nonce = CspManager.generateNonce();
      const { headerName, headerValue } = CspManager.buildCspHeader(nonce);

      expect(headerName).toBe("Content-Security-Policy");
      expect(headerValue).toContain(`'nonce-${nonce}'`);
      expect(headerValue).toContain("https://neon.tech");
      expect(headerValue).toContain("https://api.stripe.com");
      expect(headerValue).toContain("https://api.openai.com");
      expect(headerValue).toContain("frame-ancestors 'none'");
      expect(headerValue).not.toContain("'unsafe-eval'");
    });
  });

  describe("4. Input Validation & Injection Prevention", () => {
    it("should validate file uploads with strict MIME whitelist and size boundaries", () => {
      const validImage = SecurityValidator.validateFileUpload({
        mimeType: "image/png",
        sizeBytes: 1024 * 1024,
      });
      expect(validImage.valid).toBe(true);

      const invalidMime = SecurityValidator.validateFileUpload({
        mimeType: "application/x-msdownload",
        sizeBytes: 1024,
      });
      expect(invalidMime.valid).toBe(false);

      const oversizedFile = SecurityValidator.validateFileUpload({
        mimeType: "image/jpeg",
        sizeBytes: 15 * 1024 * 1024, // 15MB > 10MB limit
      });
      expect(oversizedFile.valid).toBe(false);
    });

    it("should validate safe URL protocols strictly", () => {
      expect(SecurityValidator.validateUrl("https://example.com").valid).toBe(true);
      expect(SecurityValidator.validateUrl("http://localhost:3000").valid).toBe(true);
      expect(SecurityValidator.validateUrl("javascript:alert(1)").valid).toBe(false);
      expect(SecurityValidator.validateUrl("data:text/html;base64,PHNjcmlwdD4=").valid).toBe(false);
    });

    it("should detect SQL injection signatures", () => {
      expect(SecurityValidator.detectSqlInjection("admin' OR 1=1 --")).toBe(true);
      expect(SecurityValidator.detectSqlInjection("DROP TABLE users;")).toBe(true);
      expect(SecurityValidator.detectSqlInjection("John Doe")).toBe(false);
    });

    it("should detect NoSQL operator injection in objects", () => {
      expect(SecurityValidator.detectNoSqlInjection({ $where: "sleep(5000)" })).toBe(true);
      expect(SecurityValidator.detectNoSqlInjection({ user: { $gt: "" } })).toBe(true);
      expect(SecurityValidator.detectNoSqlInjection({ name: "Alice", age: 30 })).toBe(false);
    });

    it("should detect command injection metacharacters", () => {
      expect(SecurityValidator.detectCommandInjection("cat /etc/passwd; ls")).toBe(true);
      expect(SecurityValidator.detectCommandInjection("echo `whoami`")).toBe(true);
      expect(SecurityValidator.detectCommandInjection("standard text input")).toBe(false);
    });
  });

  describe("5. Input Sanitizer & Path Traversal", () => {
    it("should sanitize dangerous HTML using DOMPurify", () => {
      const malicious = '<img src=x onerror="alert(1)"><b>Hello</b>';
      const clean = InputSanitizer.sanitizeHtml(malicious);
      expect(clean).not.toContain("onerror");
      expect(clean).toContain("<b>Hello</b>");
    });

    it("should strip path traversal sequences and null bytes", () => {
      expect(InputSanitizer.sanitizePath("../../etc/passwd")).toBe("etc/passwd");
      expect(InputSanitizer.sanitizePath("..\\..\\windows\\system32")).toBe("windows\\system32");
      expect(InputSanitizer.sanitizePath("safe_file.png\0.exe")).toBe("safe_file.png.exe");
    });

    it("should recursively sanitize JSON body payloads", () => {
      const payload = {
        name: "<b>Clean Name</b>",
        comment: "<script>alert(1)</script>Safe comment",
        nested: {
          tag: "<b>Valid Tag</b>",
        },
      };
      const sanitized = InputSanitizer.sanitizeBody(payload);
      expect(sanitized.comment).not.toContain("<script>");
      expect(sanitized.nested.tag).toBe("<b>Valid Tag</b>");
    });
  });

  describe("6. Data Protection (AES-256-GCM, Masking, PII)", () => {
    it("should encrypt and decrypt sensitive fields with AES-256-GCM", () => {
      const secret = "HighlySensitiveSSN-123-45-6789";
      const cipher = DataProtection.encrypt(secret);
      expect(cipher).not.toBe(secret);
      expect(cipher).toContain(":");

      const decrypted = DataProtection.decrypt(cipher);
      expect(decrypted).toBe(secret);
    });

    it("should mask sensitive identifiers in logs", () => {
      expect(DataProtection.maskEmail("john.doe@gmail.com")).toBe("j***@gmail.com");
      expect(DataProtection.maskPhone("+1-555-123-4567")).toBe("***-***-4567");
      expect(DataProtection.maskCreditCard("4111222233334444")).toBe("****-****-****-4444");
      expect(DataProtection.maskSsn("123-45-6789")).toBe("***-**-6789");
    });

    it("should detect PII patterns", () => {
      expect(DataProtection.detectPii("My SSN is 123-45-6789").hasPii).toBe(true);
      expect(DataProtection.detectPii("Contact me at test@example.com").hasPii).toBe(true);
      expect(DataProtection.detectPii("Just normal text").hasPii).toBe(false);
    });
  });

  describe("7. Webhook Security & Signatures", () => {
    it("should generate and verify HMAC SHA-256 webhook signatures", () => {
      const payload = JSON.stringify({ event: "booking.confirmed", amount: 150 });
      const secret = "super-secret-webhook-key";

      const signature = WebhookSecurity.generateSignature(payload, secret);
      expect(signature).toBeDefined();

      const isValid = WebhookSecurity.verifySignature(payload, signature, secret);
      expect(isValid).toBe(true);

      const isInvalid = WebhookSecurity.verifySignature(payload, "invalid_sig", secret);
      expect(isInvalid).toBe(false);
    });

    it("should protect against replay attacks with UUID deduplication", () => {
      const webhookId = "wh_unique_test_12345";
      const check1 = WebhookSecurity.checkReplayProtection(webhookId);
      expect(check1.valid).toBe(true);

      // Second attempt with same ID should be rejected
      const check2 = WebhookSecurity.checkReplayProtection(webhookId);
      expect(check2.valid).toBe(false);
      expect(check2.reason).toContain("Duplicate webhook");
    });
  });
});
