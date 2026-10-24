// apps/web/next.config.mjs
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@t3-oss/env-nextjs"],

  // Image optimization domains for avatars, receipts, and listings
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://*.supabase.co https://utfs.io",
              "connect-src 'self' https://neon.tech https://*.neon.tech https://api.resend.com https://resend.com https://api.stripe.com https://stripe.com https://api.openai.com https://openai.com",
              "frame-ancestors 'none'",
              "block-all-mixed-content",
              "upgrade-insecure-requests",
              "report-uri /api/v1/security/csp-report",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
