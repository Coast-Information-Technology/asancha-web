// File: app/layout.tsx

/**
 * Asancha Root Layout
 *
 * Purpose:
 * Provides the root HTML shell for Asancha Web Public.
 *
 * Main responsibilities:
 * - Load global styles
 * - Define root metadata
 * - Provide accessible skip-link support
 * - Keep the public/user frontend separated from admin/staff concerns
 *
 * Important Asancha Web Public rule:
 * This layout is for asancha-web only.
 * Admin/staff routes, staff navigation, staff dashboards, and admin shell
 * concerns must not be added here.
 *
 * Security note:
 * Metadata and layout output must not expose backend secrets, admin/staff URLs,
 * private document URLs, MongoDB ObjectIds, API keys, webhook secrets,
 * private KYC notes, internal admin notes, or restricted provider details.
 */

import type { Metadata, Viewport } from "next";

import { appConfig } from "@/src/lib/env/env";

import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

const appName = appConfig.name;
const appUrl = appConfig.appUrl;

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description:
    "Asancha is a UK-focused property platform for public users, investors, property owners, property agents, property sourcers, service providers, and API partners.",
  applicationName: appName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Asancha",
    "property marketplace",
    "UK property",
    "property investment",
    "property sourcing",
    "property services",
    "API partners",
  ],
  authors: [
    {
      name: "Asancha",
    },
  ],
  creator: "Asancha",
  publisher: "Asancha",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: appUrl,
    siteName: appName,
    title: appName,
    description:
      "A public/user property platform for investors, property owners, property agents, property sourcers, service providers, and API partners.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * Renders the root HTML layout for Asancha Web Public.
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>

        <div className="asancha-app-root">
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
