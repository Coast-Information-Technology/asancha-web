// File: app/layout.tsx

/**
 * Asancha Root Layout
 *
 * Purpose:
 * Provides the root HTML shell for Asancha Web Public.
 *
 * Main responsibilities:
 * - Load global styles
 * - Define root metadata and viewport settings
 * - Provide accessible skip-link support
 * - Wrap the public app with global UI providers
 * - Keep the public/user frontend separated from admin/staff concerns
 *
 * Important Asancha Web Public rule:
 * This layout is for asancha-web only.
 * Admin/staff routes, staff navigation, staff dashboards, and admin shell
 * concerns must not be added here.
 *
 * Accessibility note:
 * The root layout provides a skip link to support keyboard and screen-reader
 * users across public, auth, onboarding, dashboard, and account routes.
 *
 * Security note:
 * Metadata and layout output must not expose backend secrets, admin/staff URLs,
 * private document URLs, MongoDB ObjectIds, API keys, webhook secrets,
 * private KYC notes, internal admin notes, or restricted provider details.
 */

import type { Metadata, Viewport } from "next";

import { ToastProvider } from "@/src/components/ui/toast/toast";
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
    "Asancha is a UK-focused property platform for investors, property owners, property agents, property sourcers, service providers, and approved API partners.",
  applicationName: appName,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Asancha",
    "UK property platform",
    "property marketplace",
    "property investment",
    "property sourcing",
    "property owners",
    "property agents",
    "service providers",
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
      "A public/user property platform for investors, property owners, property agents, property sourcers, service providers, and approved API partners.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
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

        <ToastProvider>
          <div className="asancha-app-root">
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
