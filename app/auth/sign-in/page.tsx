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
import { Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
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
  const { signIn } = useAuthSession({ loadOnMount: false });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Welcome back
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Sign in to Asancha
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Continue into your dashboard, onboarding, documents, bookings,
        payments, and account workspace.
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
          rightElement={
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
              disabled={isSubmitting}
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" size={17} strokeWidth={2.5} />
              ) : (
                <Eye aria-hidden="true" size={17} strokeWidth={2.5} />
              )}
            </button>
          }
          type={showPassword ? "text" : "password"}
          value={password}
        />

        {errors.form ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm leading-6 text-destructive"
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

      <div className="mt-5 grid gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/google"
        >
          <Mail aria-hidden="true" size={16} strokeWidth={2.5} />
          Continue with Google
        </Link>
      </div>

      <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <Link
          className="inline-flex items-center gap-2 rounded-md px-1 font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/forgot-password"
        >
          <KeyRound aria-hidden="true" size={15} strokeWidth={2.5} />
          Forgot password?
        </Link>

        <Link
          className="inline-flex items-center gap-2 rounded-md px-1 font-bold !text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20 sm:justify-end"
          href="/auth/sign-up"
        >
          <ShieldCheck aria-hidden="true" size={15} strokeWidth={2.5} />
          Create account
        </Link>
      </div>
    </section>
  );
}
