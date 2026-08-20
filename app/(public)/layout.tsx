// File: app/(public)/layout.tsx

/**
 * Asancha Public Layout
 *
 * Purpose:
 * Provides the public website layout shell for Asancha Web Public pages.
 *
 * Main responsibilities:
 * - Render the public header
 * - Render the public footer
 * - Wrap public marketing, marketplace-preview, legal, support, and solution pages
 * - Keep public pages separate from auth, onboarding, dashboard, account, and protected workspaces
 *
 * Important Asancha Web Public rule:
 * This layout is for public-facing pages only.
 * It must not be used for authenticated dashboard, account, onboarding,
 * API partner workspace, admin, or staff screens.
 *
 * Accessibility note:
 * The root layout already provides the skip link and main landmark.
 * This public layout provides semantic page framing through header and footer.
 *
 * Security note:
 * Public navigation must not expose backend URLs, admin/staff URLs,
 * private document URLs, MongoDB ObjectIds, API keys, webhook secrets,
 * private KYC notes, internal admin notes, or protected user data.
 */

import { PublicFooter } from "@/src/components/layout/public-footer/public-footer";
import { PublicHeader } from "@/src/components/layout/public-header/public-header";

interface PublicLayoutProps {
  children: React.ReactNode;
}

/**
 * Renders the public-facing Asancha layout.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <PublicHeader />

      <div id="main-content" tabIndex={-1}>
        {children}
      </div>

      <PublicFooter />
    </>
  );
}
