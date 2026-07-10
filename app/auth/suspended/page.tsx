// File: app/auth/suspended/page.tsx

/**
 * Asancha Suspended Account Page
 *
 * Purpose:
 * Provides a safe public-user account suspended screen.
 *
 * Main responsibilities:
 * - Explain that account access is restricted
 * - Provide safe support guidance
 * - Avoid exposing internal suspension notes or staff decisions
 *
 * Security note:
 * Suspension reason details, internal admin notes, review notes, and audit logs
 * must not be exposed publicly.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account Suspended | Asancha",
  description:
    "Your Asancha account access is restricted. Contact support for safe guidance.",
};

/**
 * Renders the suspended account page.
 */
export default function SuspendedPage() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-destructive">
        Account restricted
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Your account cannot continue right now.
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Your account access may be suspended or restricted. Contact Asancha
        support for safe guidance. Internal review notes and staff-only
        decisions are not shown on this page.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/support"
        >
          Contact support
        </Link>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-secondary bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
