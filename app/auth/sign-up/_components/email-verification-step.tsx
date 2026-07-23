"use client";

// File: app/auth/sign-up/_components/email-verification-step.tsx

/**
 * Asancha Email Verification Step
 *
 * Purpose:
 * Shows a safe email verification instruction screen after signup submission.
 *
 * Main responsibilities:
 * - Explain that email verification comes before profile setup
 * - Provide safe next-step links
 * - Avoid exposing verification tokens or raw backend errors
 *
 * Security note:
 * Verification tokens must never be rendered or logged in the frontend.
 * Backend token validation, expiry, and audit logging remain final.
 */

import Link from "next/link";

import { Button } from "@/src/components/ui/button/button";

interface EmailVerificationStepProps {
  email: string;
  onStartOver: () => void;
}

/**
 * Renders the email verification instruction step.
 */
export function EmailVerificationStep({
  email,
  onStartOver,
}: EmailVerificationStepProps) {
  const resendVerificationHref = `/auth/resend-verification?email=${encodeURIComponent(
    email,
  )}`;

  return (
    <section aria-labelledby="email-verification-heading">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-primary">
          Check your email
        </p>

        <h2
          className="mt-3 text-2xl font-extrabold text-card-foreground"
          id="email-verification-heading"
        >
          Verify your email to continue.
        </h2>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We sent a verification link to{" "}
          <strong className="text-foreground">{email}</strong>. Open the link
          to verify your email, then sign in to open your dashboard.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href={resendVerificationHref}
          >
            Resend verification email
          </Link>

          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-secondary bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/auth/sign-in"
          >
            Sign in
          </Link>

          <Button onClick={onStartOver} type="button" variant="ghost">
            Start over
          </Button>
        </div>
      </div>
    </section>
  );
}
