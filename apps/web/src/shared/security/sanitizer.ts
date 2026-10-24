// apps/web/src/shared/security/sanitizer.ts
import DOMPurify from "isomorphic-dompurify";

export class InputSanitizer {
  /**
   * HTML Sanitization using DOMPurify
   */
  static sanitizeHtml(dirtyHtml: string): string {
    if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
    return DOMPurify.sanitize(dirtyHtml, {
      ALLOWED_TAGS: [
        "b", "i", "em", "strong", "a", "p", "ul", "ol", "li",
        "code", "pre", "span", "br", "h1", "h2", "h3", "h4", "blockquote"
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "title"],
    });
  }

  /**
   * Strip all HTML tags completely for plain text fields (names, titles, codes)
   */
  static stripHtml(dirtyText: string): string {
    if (!dirtyText || typeof dirtyText !== "string") return "";
    return DOMPurify.sanitize(dirtyText, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    }).trim();
  }

  /**
   * Path Traversal Prevention: cleanses file paths and names
   * Blocks ../, ..\, null bytes (%00), and leading root directory slashes
   */
  static sanitizePath(filePath: string): string {
    if (!filePath || typeof filePath !== "string") return "";

    return filePath
      .replace(/\0/g, "") // remove null bytes
      .replace(/\.\.(\/|\\)+/g, "") // remove ../ and ..\
      .replace(/^(\/|\\)+/, "") // remove leading slashes
      .replace(/[<>:"|?*]/g, "") // remove Windows reserved characters
      .trim();
  }

  /**
   * SQL parameter sanitization: strips potential SQL breaking quotes and comment sequences
   */
  static sanitizeSqlParam(param: string): string {
    if (!param || typeof param !== "string") return "";
    return param
      .replace(/'/g, "''") // escape single quotes
      .replace(/--/g, "") // remove line comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
      .replace(/;/g, ""); // remove statement delimiters
  }

  /**
   * Universal XSS & Input Sanitization for request payloads (objects, arrays, strings)
   * Recursively sanitizes every string property in a JSON body
   */
  static sanitizeBody<T>(data: T): T {
    if (data === null || data === undefined) return data;

    if (typeof data === "string") {
      // If it looks like HTML, sanitize it; otherwise strip potential XSS vectors
      if (/<[a-z][\s\S]*>/i.test(data)) {
        return this.sanitizeHtml(data) as unknown as T;
      }
      return this.stripHtml(data) as unknown as T;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeBody(item)) as unknown as T;
    }

    if (typeof data === "object") {
      const sanitizedObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        // Prevent prototype pollution
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          continue;
        }
        sanitizedObj[key] = this.sanitizeBody(value);
      }
      return sanitizedObj as T;
    }

    return data;
  }
}
