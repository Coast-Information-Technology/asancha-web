// File: app/auth/google/callback/page.tsx

/**
 * Asancha Google Callback Page
 *
 * Purpose:
 * Provides a safe Google OAuth callback status screen for Asancha Web Public.
 *
 * Main responsibilities:
 * - Show safe callback processing guidance
 * - Avoid exposing tokens, provider data, or raw OAuth errors
 * - Guide users back to sign-in if the callback cannot continue
 *
 * Security note:
 * OAuth code exchange, token storage, account linking, and audit logging must
 * be handled by the backend. This page must not expose tokens or provider
 * secrets.
 */

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Google Authentication Callback | Asancha",
  description:
    "Google authentication callback status for Asancha public users.",
};

/**
 * Renders the Google callback status page.
 */
export default function GoogleCallbackPage() {
  return (
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Authentication callback
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Completing Google sign-in
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        We are finishing your Google sign-in. If nothing happens, return to
        sign in and try again.
      </p>

      <Link
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
        href="/auth/sign-in"
      >
        Back to sign in
      </Link>
    </section>
  );
}
