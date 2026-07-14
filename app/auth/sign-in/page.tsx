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
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";
import { useAuthSession } from "@/src/features/auth/hooks/use-auth-session";

interface SignInErrors {
  email?: string;
  password?: string;
  form?: string;
}

/**
 * Returns a local-only post-authentication redirect path.
 */
function getSafeRedirectPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

/**
 * Renders the public sign-in page.
 */
export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuthSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignInErrors = {};
    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (password.length < 1) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn({
        email: normalizedEmail,
        password,
      });

      const destination =
        getSafeRedirectPath(searchParams.get("redirect")) ??
        getSafeRedirectPath(searchParams.get("next")) ??
        getSafeRedirectPath(searchParams.get("returnTo")) ??
        getSafeRedirectPath(result.nextPath) ??
        "/dashboard";

      router.replace(destination);
      router.refresh();
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "We could not sign you in. Please check your details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          errorMessage={errors.email}
          label="Email address"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />

        <Input
          autoComplete="current-password"
          disabled={isSubmitting}
          errorMessage={errors.password}
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />

        {errors.form ? (
          <p
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}

        <Button
          fullWidth
          isLoading={isSubmitting}
          loadingLabel="Signing in"
          type="submit"
        >
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
