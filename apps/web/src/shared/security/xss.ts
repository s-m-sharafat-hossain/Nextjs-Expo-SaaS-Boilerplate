// apps/web/src/shared/security/xss.ts
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes untrusted user HTML or Markdown input to eliminate XSS injection vectors
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "code", "pre", "span", "br"],
    ALLOWED_ATTR: ["href", "target", "rel", "class"],
  });
}

/**
 * Strips all HTML tags entirely for plain-text storage and display
 */
export function stripAllHtml(dirtyText: string): string {
  if (!dirtyText || typeof dirtyText !== "string") return "";
  return DOMPurify.sanitize(dirtyText, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}
