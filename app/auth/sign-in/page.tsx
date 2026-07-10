"use client";

// File: app/auth/sign-in/page.tsx

/**
 * Asancha Sign-In Page
 *
 * Purpose:
 * Provides public-user sign-in for Asancha Web Public.
 *
 * Main responsibilities:
 * - Collect email and password
 * - Provide safe links to signup and password reset
 * - Avoid exposing raw backend errors
 *
 * Security note:
 * Backend authentication, account status, lock/suspension checks,
 * session creation, token handling, and audit logging remain final.
 */

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";

interface SignInErrors {
  email?: string;
  password?: string;
}

/**
 * Renders the public sign-in page.
 */
export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const [safeMessage, setSafeMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignInErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < 1) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSafeMessage(
      "Sign-in will be connected to the backend auth API when the auth feature API layer is added.",
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Welcome back
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Sign in to Asancha
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Access your account, onboarding, dashboard, documents, payments,
        bookings, conversations, notifications, and approved API partner
        workspace.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          errorMessage={errors.email}
          label="Email address"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />

        <Input
          autoComplete="current-password"
          errorMessage={errors.password}
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />

        {safeMessage ? (
          <p className="rounded-xl border border-border bg-muted p-4 text-sm leading-6 text-muted-foreground">
            {safeMessage}
          </p>
        ) : null}

        <Button fullWidth type="submit">
          Sign in
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:justify-between">
        <Link
          className="font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/forgot-password"
        >
          Forgot password?
        </Link>

        <Link
          className="font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/sign-up"
        >
          Create account
        </Link>
      </div>
    </section>
  );
}
