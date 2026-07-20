"use client";

// File: app/auth/reset-password/page.tsx

/**
 * Asancha Reset Password Page
 *
 * Purpose:
 * Provides a safe new-password screen for Asancha Web Public.
 *
 * Main responsibilities:
 * - Collect new password and confirmation password
 * - Avoid displaying reset token values
 * - Show safe completion messaging
 *
 * Security note:
 * Backend must validate reset token, expiry, password rules, token hash,
 * account status, and audit the reset outcome. The frontend must not expose
 * token values or raw backend errors.
 */

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { Input } from "@/src/components/ui/input/input";

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
}

/**
 * Renders the reset password page.
 */
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [completed, setCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ResetPasswordErrors = {};

    if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setCompleted(true);
  }

  return (
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        New password
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        Set a new password
      </h1>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Choose a new password for your Asancha account.
      </p>

      {completed ? (
        <div className="mt-8 rounded-lg border border-border bg-muted/80 p-5">
          <h2 className="text-lg font-bold text-foreground">
            Password reset submitted
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your password has been submitted. Sign in with your new password.
          </p>
          <Link
            className="mt-5 inline-flex text-sm font-bold text-primary hover:text-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href="/auth/sign-in"
          >
            Continue to sign in
          </Link>
        </div>
      ) : (
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <Input
            autoComplete="new-password"
            errorMessage={errors.password}
            label="New password"
            onChange={(event) => setPassword(event.target.value)}
            required
            rightElement={
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
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
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
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

          <Button fullWidth type="submit">
            Reset password
          </Button>
        </form>
      )}
    </section>
  );
}
