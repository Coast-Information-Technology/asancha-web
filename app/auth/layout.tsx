// File: app/auth/layout.tsx

/**
 * Asancha Auth Layout
 *
 * Purpose:
 * Provides a focused authentication layout for Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep auth pages separate from public marketing pages
 * - Provide a simple accessible auth shell
 * - Link users safely back to the public website
 * - Avoid admin/staff navigation or staff login assumptions
 *
 * Important Asancha Web Public rule:
 * Public users must not register as staff.
 * Guest is anonymous only.
 * API partner access is controlled and separate from ordinary signup.
 *
 * Security note:
 * This layout must not expose backend URLs, admin/staff URLs, tokens,
 * API keys, private KYC notes, internal admin notes, or ObjectIds.
 */

import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Renders the auth layout shell.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="asancha-page-container flex min-h-16 items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-3 rounded-md font-extrabold text-foreground focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/"
          >
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"
            >
              A
            </span>
            <span>Asancha</span>
          </Link>

          <Link
            className="rounded-md px-3 py-2 text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/support"
          >
            Need help?
          </Link>
        </div>
      </header>

      <main className="asancha-page-container grid min-h-[calc(100vh-4rem)] place-items-center py-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
