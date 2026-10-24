import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@shared/config";
import { CookieConsent } from "@/shared/components/CookieConsent";
import { FeedbackModal } from "@/shared/components/FeedbackModal";
import { OnboardingTour } from "@/shared/components/OnboardingTour";
import { ChatWidget } from "@/shared/components/ChatWidget";
import { ServiceWorkerRegister } from "@/shared/components/ServiceWorkerRegister";
import { ThemeProvider } from "@/shared/design/theme-provider";

import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.description}`,
  description: siteConfig.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") || undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {nonce && <meta name="csp-nonce" content={nonce} />}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="master-boilerplate-theme">
          {children}
          <CookieConsent />
          <FeedbackModal />
          <OnboardingTour />
          <ChatWidget />
          <ServiceWorkerRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
