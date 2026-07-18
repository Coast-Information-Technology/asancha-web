"use client";

// File: app/auth/verify-email/page.tsx

/**
 * Asancha Verification Email Resend Page
 *
 * Purpose:
 * Provides a safe verification email resend screen for Asancha Web Public.
 *
 * Main responsibilities:
 * - Collect the email address that needs a new verification message
 * - Call the backend resend-verification endpoint
 * - Show generic success messaging to avoid account enumeration
 *
 * Important Asancha Web Public rule:
 * Email verification comes before general profile setup.
 *
 * Security note:
 * Backend must decide whether an account is eligible for a new verification
 * message. The frontend must not reveal whether an account exists.
 */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";
import { authApi } from "@/src/features/auth/api/auth.api";
import { AUTH_SAFE_MESSAGES } from "@/src/features/auth/constants/auth.constants";

interface VerifyEmailFormErrors {
  email?: string;
  form?: string;
}

function getInitialEmail(searchParams: URLSearchParams): string {
  return searchParams.get("email")?.trim() ?? "";
}

/**
 * Renders the verification email resend page.
 */
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => getInitialEmail(searchParams));
  const [errors, setErrors] = useState<VerifyEmailFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrors({ email: "Enter a valid email address." });
      setSuccessMessage(null);
      return;
    }

    setErrors({});
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await authApi.resendVerification({
        email: normalizedEmail,
      });

      setSuccessMessage(
        result.message || AUTH_SAFE_MESSAGES.resendVerificationAccepted,
      );
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : AUTH_SAFE_MESSAGES.genericError,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Email verification
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Resend your verification email
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Enter the email address you used to create your account. If the account
        is eligible, Asancha will send a new verification link.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-muted/80 p-5">
        <h2 className="text-lg font-bold text-foreground">
          Keep your account safe
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Do not share verification links, reset links, passwords, or access
          tokens. Asancha support will not ask for them.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          errorMessage={errors.email}
          label="Email address"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />

        {errors.form ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}

        {successMessage ? (
          <p
            className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-foreground"
            role="status"
          >
            {successMessage}
          </p>
        ) : null}

        <Button
          fullWidth
          isLoading={isSubmitting}
          loadingLabel="Sending verification email"
          type="submit"
        >
          Resend verification email
        </Button>

        <Link
          className="inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/sign-in"
        >
          Back to sign in
        </Link>
      </form>
    </section>
  );
}
