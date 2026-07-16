// File: app/auth/google/page.tsx

/**
 * Asancha Google Auth Page
 *
 * Purpose:
 * Provides a safe Google sign-in handoff page for Asancha Web Public.
 *
 * Main responsibilities:
 * - Explain Google authentication handoff
 * - Avoid exposing OAuth secrets or provider internals
 * - Keep public/user auth separate from admin/staff auth
 *
 * Security note:
 * OAuth client secrets, provider payloads, tokens, and internal callback
 * details must never be exposed in this page.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Continue with Google | Asancha",
  description:
    "Continue to Asancha using Google authentication. OAuth handling is completed through the backend authentication flow.",
};

/**
 * Renders the Google auth handoff page.
 */
export default function GoogleAuthPage() {
  return (
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Google sign-in
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Continue with Google
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Google authentication will be handled through the approved backend
        authentication flow. OAuth secrets and provider payloads are never shown
        in the frontend.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/sign-in"
        >
          Back to sign in
        </Link>

        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-secondary bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/support"
        >
          Get help
        </Link>
      </div>
    </section>
  );
}
