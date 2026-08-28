"use client";

// File: app/auth/reset-password/reset-password-form.tsx

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";
import { signupPasswordSchema } from "@/src/features/auth/schemas/sign-up.schema";
import { getSafeMessageFromUnknown } from "@/src/lib/api/api-response";

const PASSWORD_RESET_COMPLETE_ROUTE = "/auth/reset-password/complete";

interface ResetPasswordFormProps {
  hasResetToken: boolean;
}

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
}

/**
 * Collects and submits a new password without exposing the reset token to
 * browser JavaScript.
 */
export function ResetPasswordForm({ hasResetToken }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [formMessage, setFormMessage] = useState<string>();
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ResetPasswordErrors = {};
    const passwordResult = signupPasswordSchema.safeParse(password);

    if (!passwordResult.success) {
      nextErrors.password = passwordResult.error.issues[0]?.message;
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your new password.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    setFormMessage(undefined);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(PASSWORD_RESET_COMPLETE_ROUTE, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });
      const responseBody = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        throw new Error(
          getSafeMessageFromUnknown(
            responseBody,
            "We could not reset your password. Request a new reset link and try again.",
          ),
        );
      }

      setPassword("");
      setConfirmPassword("");
      setCompleted(true);
    } catch (error) {
      setFormMessage(
        error instanceof Error
          ? error.message
          : "We could not reset your password. Request a new reset link and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!hasResetToken) {
    return (
      <div className="mt-8 rounded-lg border border-border bg-muted/80 p-5">
        <h2 className="text-lg font-bold text-foreground">
          This reset link is unavailable
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The link may be incomplete, expired, or already used. Request a new
          password reset email to continue.
        </p>
        <Link
          className="mt-5 inline-flex text-sm font-bold text-primary underline-offset-4 hover:text-primary-hover hover:underline focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/forgot-password"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div
        aria-live="polite"
        className="mt-8 rounded-lg border border-border bg-muted/80 p-5"
      >
        <h2 className="text-lg font-bold text-foreground">Password updated</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Your password has been changed. Sign in with your new password to
          continue.
        </p>
        <Link
          className="mt-5 inline-flex text-sm font-bold text-primary underline-offset-4 hover:text-primary-hover hover:underline focus:outline-none focus:ring-4 focus:ring-primary/20"
          href="/auth/sign-in"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <Input
        autoComplete="new-password"
        disabled={isSubmitting}
        errorMessage={errors.password}
        label="New password"
        onChange={(event) => setPassword(event.target.value)}
        required
        rightElement={
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
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

      <Input
        autoComplete="new-password"
        disabled={isSubmitting}
        errorMessage={errors.confirmPassword}
        label="Confirm new password"
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
        rightElement={
          <button
            aria-label={
              showConfirmPassword
                ? "Hide password confirmation"
                : "Show password confirmation"
            }
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
            disabled={isSubmitting}
            onClick={() => setShowConfirmPassword((current) => !current)}
            type="button"
          >
            {showConfirmPassword ? (
              <EyeOff aria-hidden="true" size={17} strokeWidth={2.5} />
            ) : (
              <Eye aria-hidden="true" size={17} strokeWidth={2.5} />
            )}
          </button>
        }
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
      />

      <p className="text-xs leading-5 text-muted-foreground">
        Use at least 12 characters, including uppercase and lowercase letters, a
        number, and a special character.
      </p>

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
        loadingLabel="Resetting password"
        type="submit"
      >
        Reset password
      </Button>
    </form>
  );
}
