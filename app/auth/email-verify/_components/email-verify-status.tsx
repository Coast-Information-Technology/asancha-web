"use client";

// File: app/auth/email-verify/_components/email-verify-status.tsx

/**
 * Asancha Email Verify Status Component
 *
 * Purpose:
 * Verifies an email-link token with the backend and displays safe completion
 * states to the user.
 *
 * Security note:
 * The verification token must not be displayed or stored. Raw backend errors
 * should not expose sensitive verification details.
 */

import Link from "next/link";
import { RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button/button";
import { authApi } from "@/src/features/auth/api/auth.api";
import {
  AUTH_PAGE_ROUTES,
  AUTH_SAFE_MESSAGES,
} from "@/src/features/auth/constants/auth.constants";

type VerificationState =
  | {
      status: "missing";
      message: string;
      nextPath: null;
    }
  | {
      status: "verifying";
      message: string;
      nextPath: null;
    }
  | {
      status: "verified";
      message: string;
      nextPath: string;
    }
  | {
      status: "error";
      message: string;
      nextPath: null;
    };

interface EmailVerifyStatusProps {
  token: string;
  userPublicId: string;
}

function createInitialState(token: string): VerificationState {
  if (!token) {
    return {
      status: "missing",
      message:
        "This verification link is missing a token. Request a new verification email and use the latest link.",
      nextPath: null,
    };
  }

  return {
    status: "verifying",
    message: "We are verifying your email address.",
    nextPath: null,
  };
}

function getSafeLocalPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return AUTH_PAGE_ROUTES.onboarding;
  }

  return value;
}

/**
 * Verifies the supplied email-token parameter and renders the current status.
 */
export function EmailVerifyStatus({
  token,
  userPublicId,
}: EmailVerifyStatusProps) {
  const [verificationState, setVerificationState] =
    useState<VerificationState>(() => createInitialState(token));

  async function verifyToken() {
    if (!token) {
      return;
    }

    setVerificationState({
      status: "verifying",
      message: "We are verifying your email address.",
      nextPath: null,
    });

    try {
      const result = await authApi.verifyEmail({
        token,
        userPublicId: userPublicId || undefined,
      });

      setVerificationState({
        status: "verified",
        message:
          "Your email address has been verified. You can continue your account setup.",
        nextPath: getSafeLocalPath(result.nextPath),
      });
    } catch (error) {
      setVerificationState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : AUTH_SAFE_MESSAGES.genericError,
        nextPath: null,
      });
    }
  }

  useEffect(() => {
    let isActive = true;

    async function verifyInitialToken() {
      if (!token) {
        return;
      }

      try {
        const result = await authApi.verifyEmail({
          token,
          userPublicId: userPublicId || undefined,
        });

        if (!isActive) {
          return;
        }

        setVerificationState({
          status: "verified",
          message:
            "Your email address has been verified. You can continue your account setup.",
          nextPath: getSafeLocalPath(result.nextPath),
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setVerificationState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : AUTH_SAFE_MESSAGES.genericError,
          nextPath: null,
        });
      }
    }

    void verifyInitialToken();

    return () => {
      isActive = false;
    };
  }, [token, userPublicId]);

  const isVerifying = verificationState.status === "verifying";
  const isVerified = verificationState.status === "verified";
  const isError = verificationState.status === "error";
  const isMissing = verificationState.status === "missing";

  return (
    <section className="rounded-lg border border-border bg-card/95 p-6 shadow-xl shadow-slate-950/10 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-wide text-primary">
        Email verification
      </p>

      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
        {isVerified ? "Email verified" : "Verify your email"}
      </h1>

      <div className="mt-8 rounded-lg border border-border bg-muted/80 p-5">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background text-primary"
            aria-hidden="true"
          >
            {isVerified ? (
              <ShieldCheck size={20} strokeWidth={2.5} />
            ) : isError || isMissing ? (
              <TriangleAlert size={20} strokeWidth={2.5} />
            ) : (
              <RefreshCw className="animate-spin" size={20} strokeWidth={2.5} />
            )}
          </span>

          <div>
            <h2 className="text-lg font-bold text-foreground">
              {isVerifying
                ? "Checking verification link"
                : isVerified
                  ? "Verification complete"
                  : "Verification could not be completed"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {verificationState.message}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {isVerified ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary/20"
            href={verificationState.nextPath}
          >
            Continue
          </Link>
        ) : null}

        {isError ? (
          <Button
            isLoading={isVerifying}
            loadingLabel="Verifying"
            onClick={verifyToken}
            type="button"
          >
            Try again
          </Button>
        ) : null}

        {isMissing || isError ? (
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-secondary bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
            href={AUTH_PAGE_ROUTES.verifyEmail}
          >
            Resend verification email
          </Link>
        ) : null}
      </div>
    </section>
  );
}
