// src/shared/utils/metadata.ts
// Dynamic SEO metadata generator for Next.js App Router
import type { Metadata } from "next";
import { siteConfig } from "@shared/config";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface PageMetaOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Generate full Metadata object for any page.
 * Usage: export const metadata = generateMetadata({ title: "Dashboard", path: "/dashboard" })
 */
export function generateMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: PageMetaOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDesc = description ?? siteConfig.description;
  const url = `${BASE_URL}${path}`;
  const ogImage = image ?? `${BASE_URL}/og-default.png`;

  return {
    title: pageTitle,
    description: pageDesc,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
