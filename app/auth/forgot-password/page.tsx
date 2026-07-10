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

/**
 * Renders the forgot password page.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setErrorMessage(undefined);
    setSubmitted(true);
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Password reset
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Reset your password
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Enter your email address. If an account can receive a reset link,
        Asancha will send reset instructions.
      </p>

      {submitted ? (
        <div className="mt-8 rounded-2xl border border-border bg-muted p-5">
          <h2 className="text-lg font-bold text-foreground">
            Check your email
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            If the email is eligible, reset instructions will be sent. Do not
            share reset links or tokens with anyone.
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
            errorMessage={errorMessage}
            label="Email address"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          <Button fullWidth type="submit">
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
