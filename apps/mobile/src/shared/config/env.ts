// apps/mobile/src/shared/config/env.ts

export const ENV = {
  /**
   * Next.js Web backend API base URL
   * For physical devices or Android emulator, replace localhost with LAN IP (e.g. http://192.168.1.100:3000)
   */
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
  
  /**
   * App environment
   */
  APP_ENV: (process.env.EXPO_PUBLIC_APP_ENV || "development") as "development" | "staging" | "production",

  /**
   * API Version Prefix
   */
  API_PREFIX: "/api/v1",

  /**
   * Request Timeout in Milliseconds
   */
  TIMEOUT_MS: 15000,

  /**
   * App Version
   */
  APP_VERSION: "1.0.0",
} as const;
