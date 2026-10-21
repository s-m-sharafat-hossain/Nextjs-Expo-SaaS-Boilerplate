// src/test/utils.test.ts
import { describe, it, expect } from "vitest";
import { sanitizeHtml, timingSafeEqual } from "@/shared/lib/security";

describe("Security Utils", () => {
  describe("sanitizeHtml", () => {
    it("should remove script tags", () => {
      const input = '<script>alert("xss")</script>Hello';
      const output = sanitizeHtml(input);
      expect(output).toBe("Hello");
    });

    it("should remove iframe tags", () => {
      const input = '<iframe src="evil.com"></iframe>Content';
      const output = sanitizeHtml(input);
      expect(output).toBe("Content");
    });

    it("should remove javascript: protocol", () => {
      const input = '<a href="javascript:alert(1)">Click</a>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain("javascript:");
    });

    it("should remove event handlers", () => {
      const input = '<div onclick="alert(1)">Click</div>';
      const output = sanitizeHtml(input);
      expect(output).not.toContain("onclick");
    });

    it("should return empty string for null input", () => {
      const output = sanitizeHtml(null as any);
      expect(output).toBe("");
    });
  });

  describe("timingSafeEqual", () => {
    it("should return true for equal strings", () => {
      const result = timingSafeEqual("password123", "password123");
      expect(result).toBe(true);
    });

    it("should return false for different strings", () => {
      const result = timingSafeEqual("password123", "password124");
      expect(result).toBe(false);
    });

    it("should return false for different length strings", () => {
      const result = timingSafeEqual("password", "password123");
      expect(result).toBe(false);
    });
  });
});
