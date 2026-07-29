"use client";

// File: app/auth/forgot-password/page.tsx

/**
 * Asancha Forgot Password Page
 *
 * Purpose:
 * Provides a safe password reset request screen for Asancha Web Public.
 *
 * Main responsibilities:
 * - Collect email address
 * - Show generic success messaging
 * - Avoid account enumeration
 *
 * Security note:
 * Password reset tokens must be generated, hashed, expired, and verified by
 * the backend. The frontend must not reveal whether an account exists.
 */

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";
import { authApi } from "@/src/features/auth/api/auth.api";
import { AUTH_SAFE_MESSAGES } from "@/src/features/auth/constants/auth.constants";

/**
 * Renders the forgot password page.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [formMessage, setFormMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage("Enter a valid email address.");
      setFormMessage(undefined);
      return;
    }

    setErrorMessage(undefined);
    setFormMessage(undefined);
    setIsSubmitting(true);

    try {
      const result = await authApi.forgotPassword({
        email: normalizedEmail,
      });

      setFormMessage(
        result.message || AUTH_SAFE_MESSAGES.forgotPasswordAccepted,
      );
      setSubmitted(true);
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : AUTH_SAFE_MESSAGES.genericError,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Password reset
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Reset your password
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        We will email you a link to reset your password.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-lg border border-border bg-muted/80 p-5">
          <h2 className="text-lg font-bold text-foreground">
            Check your inbox
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {formMessage ||
              "If we find an account for that email, a reset link will arrive shortly. Check your spam folder if it does not appear."}
          </p>
          <Link
            className="mt-5 inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/auth/sign-in"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            autoComplete="email"
            disabled={isSubmitting}
            errorMessage={errorMessage}
            label="Email address"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          {formMessage ? (
            <p
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive"
              role="alert"
            >
              {formMessage}
            </p>
          ) : null}

          <Button
            fullWidth
            isLoading={isSubmitting}
            loadingLabel="Sending reset instructions"
            type="submit"
          >
            Send reset instructions
          </Button>

          <Link
            className="inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/auth/sign-in"
          >
            Back to sign in
          </Link>
        </form>
      )}
    </section>
  );
}
