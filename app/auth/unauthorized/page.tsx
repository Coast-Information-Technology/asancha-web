// File: app/auth/unauthorized/page.tsx

/**
 * Asancha Unauthorized Page
 *
 * Purpose:
 * Provides a safe unauthorized-access screen for Asancha Web Public.
 *
 * Main responsibilities:
 * - Explain that the requested action or page is not available
 * - Avoid confirming private resource existence
 * - Provide safe navigation back to allowed routes
 *
 * Security note:
 * This page must not reveal whether a private resource exists, why a precise
 * permission failed, or any internal authorization rules.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unauthorized | Asancha",
  description:
    "The requested Asancha page or action is not available to your current account state.",
};

/**
 * Renders the unauthorized page.
 */
export default function UnauthorizedPage() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Access unavailable
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        You cannot access that page right now.
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        This may be because you are not signed in, your profile is incomplete,
        verification is pending, payment review is required, API partner access
        has not been approved, or the page is not available to your current
        account state.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/sign-in"
        >
          Sign in
        </Link>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-secondary bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/support"
        >
          Contact support
        </Link>
      </div>
    </section>
  );
}
