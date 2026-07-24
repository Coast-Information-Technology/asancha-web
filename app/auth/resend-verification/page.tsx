"use client";

// File: app/auth/resend-verification/page.tsx

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
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";
import { authApi } from "@/src/features/auth/api/auth.api";
import { AUTH_SAFE_MESSAGES } from "@/src/features/auth/constants/auth.constants";

interface ResendVerificationFormErrors {
  email?: string;
  form?: string;
}

const RESEND_COOLDOWN_SECONDS = 120;
const RESEND_COOLDOWN_STORAGE_KEY = "asancha.resend-verification.cooldowns";

function getInitialEmail(searchParams: URLSearchParams): string {
  return searchParams.get("email")?.trim() ?? "";
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getCooldowns(): Record<string, number> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(RESEND_COOLDOWN_STORAGE_KEY) ?? "{}",
    ) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) => typeof value === "number" && Number.isFinite(value),
      ),
    ) as Record<string, number>;
  } catch {
    return {};
  }
}

function getCooldownRemainingSeconds(email: string): number {
  const expiresAt = getCooldowns()[normalizeEmail(email)] ?? 0;
  const remainingMs = expiresAt - Date.now();

  return Math.max(0, Math.ceil(remainingMs / 1000));
}

function setCooldown(email: string): number {
  const normalizedEmail = normalizeEmail(email);
  const expiresAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
  const cooldowns = getCooldowns();

  window.localStorage.setItem(
    RESEND_COOLDOWN_STORAGE_KEY,
    JSON.stringify({
      ...cooldowns,
      [normalizedEmail]: expiresAt,
    }),
  );

  return RESEND_COOLDOWN_SECONDS;
}

function formatRemainingTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Renders the verification email resend page.
 */
export default function ResendVerificationPage() {
  const searchParams = useSearchParams();
  const initialEmail = useMemo(() => getInitialEmail(searchParams), [searchParams]);
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<ResendVerificationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getCooldownRemainingSeconds(initialEmail),
  );

  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  const resendIsCoolingDown = remainingSeconds > 0;

  useEffect(() => {
    if (!resendIsCoolingDown) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds(getCooldownRemainingSeconds(normalizedEmail));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [normalizedEmail, resendIsCoolingDown]);

  function handleEmailChange(value: string): void {
    setEmail(value);
    setRemainingSeconds(getCooldownRemainingSeconds(value));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrors({ email: "Enter a valid email address." });
      setSuccessMessage(null);
      return;
    }

    const cooldownRemaining = getCooldownRemainingSeconds(normalizedEmail);

    if (cooldownRemaining > 0) {
      setRemainingSeconds(cooldownRemaining);
      setErrors({
        form: `Please wait ${formatRemainingTime(
          cooldownRemaining,
        )} before requesting another verification email.`,
      });
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
      setRemainingSeconds(setCooldown(normalizedEmail));
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
        Enter your account email and we will send a fresh verification link.
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <Input
          autoComplete="email"
          disabled={isSubmitting}
          errorMessage={errors.email}
          label="Email address"
          onChange={(event) => handleEmailChange(event.target.value)}
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
          disabled={resendIsCoolingDown}
          fullWidth
          isLoading={isSubmitting}
          loadingLabel="Sending verification email"
          type="submit"
        >
          {resendIsCoolingDown
            ? `Resend available in ${formatRemainingTime(remainingSeconds)}`
            : "Resend verification email"}
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
