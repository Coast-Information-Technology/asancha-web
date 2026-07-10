"use client";

// File: app/auth/verify-email/page.tsx

/**
 * Asancha Verify Email Page
 *
 * Purpose:
 * Provides a safe email verification screen for Asancha Web Public.
 *
 * Main responsibilities:
 * - Explain email verification requirement
 * - Avoid displaying verification token values
 * - Guide users to onboarding after verification
 *
 * Important Asancha Web Public rule:
 * Email verification comes before general profile setup.
 *
 * Security note:
 * Backend must validate verification tokens, expiry, account state, and audit
 * verification outcomes. The frontend must not expose tokens or raw errors.
 */

import Link from "next/link";

import { Button } from "@/src/components/ui/button/button";

/**
 * Renders the email verification page.
 */
export default function VerifyEmailPage() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Email verification
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Verify your email address
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Open the verification link sent to your email. After verification, you
        can continue to general profile setup and role-specific onboarding.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-muted p-5">
        <h2 className="text-lg font-bold text-foreground">
          Keep your account safe
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Do not share verification links, reset links, passwords, or access
          tokens. Asancha support will not ask for them.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/onboarding/general-profile"
        >
          Continue to profile setup
        </Link>

        <Button type="button" variant="secondary">
          Resend verification email
        </Button>
      </div>
    </section>
  );
}
