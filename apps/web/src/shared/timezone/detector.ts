// apps/web/src/shared/timezone/detector.ts

export const COMMON_TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: "+00:00" },
  { value: "America/New_York", label: "New York (EST/EDT)", offset: "-05:00" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)", offset: "-06:00" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", offset: "-08:00" },
  { value: "Europe/London", label: "London (GMT/BST)", offset: "+00:00" },
  { value: "Europe/Paris", label: "Paris / Berlin (CET/CEST)", offset: "+01:00" },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "+04:00" },
  { value: "Asia/Dhaka", label: "Dhaka (BST)", offset: "+06:00" },
  { value: "Asia/Kolkata", label: "India (IST)", offset: "+05:30" },
  { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "+08:00" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "+09:00" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", offset: "+10:00" },
];

export class TimezoneManager {
  /**
   * Auto-detect client timezone from browser environment
   */
  static detectBrowserTimezone(): string {
    if (typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      } catch {
        return "UTC";
      }
    }
    return "UTC";
  }

  /**
   * Format date into user's designated timezone
   */
  static formatDate(
    date: Date | string | number,
    timezone?: string,
    options?: Intl.DateTimeFormatOptions
  ): string {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    const tz = timezone || this.detectBrowserTimezone();

    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: tz,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...options,
    };

    try {
      return new Intl.DateTimeFormat("en-US", defaultOptions).format(d);
    } catch {
      return d.toLocaleString();
    }
  }

  /**
   * Formats relative time ("2 hours ago", "in 3 days", "just now")
   */
  static formatRelative(date: Date | string | number, locale = "en"): string {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    const diffSec = Math.round((d.getTime() - Date.now()) / 1000);

    const absSec = Math.abs(diffSec);
    if (absSec < 45) return "Just now";

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (absSec < 3600) {
      return rtf.format(Math.round(diffSec / 60), "minute");
    }
    if (absSec < 86400) {
      return rtf.format(Math.round(diffSec / 3600), "hour");
    }
    if (absSec < 2592000) {
      return rtf.format(Math.round(diffSec / 86400), "day");
    }
    return rtf.format(Math.round(diffSec / 2592000), "month");
  }
}
