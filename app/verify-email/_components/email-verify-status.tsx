// File: app/verify-email/_components/email-verify-status.tsx

/**
 * Asancha Email Verify Status Component
 *
 * Purpose:
 * Displays the safe result after the server consumes an email-verification
 * token and removes it from the browser URL.
 *
 * Security note:
 * The verification token must not be displayed or stored. Raw backend errors
 * should not expose sensitive verification details.
 */

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MailCheck,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { AUTH_PAGE_ROUTES } from "@/src/features/auth/constants/auth.constants";

export type EmailVerificationDisplayStatus = "missing" | "verified" | "error";

interface EmailVerifyStatusProps {
  status: EmailVerificationDisplayStatus;
}

/**
 * Renders the email-verification result without receiving the token.
 */
export function EmailVerifyStatus({ status }: EmailVerifyStatusProps) {
  const isVerified = status === "verified";
  const isError = status === "error";
  const isMissing = status === "missing";
  const statusLabel = isVerified ? "Email verified" : "Action needed";
  const message = isVerified
    ? "Your email is verified. You can now sign in to Asancha."
    : isError
      ? "We could not verify this link. It may be invalid, expired, or already used."
      : "This verification link is incomplete. Request a new email and use the latest link.";
  const statusTone = isVerified
    ? "border-primary/30 bg-primary/10 text-primary"
    : isError || isMissing
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-border bg-muted text-muted-foreground";

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl shadow-slate-950/15">
      <div className="border-b border-border bg-muted/45 px-6 py-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            Email verification
          </p>
          <span
            className={`inline-flex min-h-8 items-center gap-2 rounded-full border px-3 text-xs font-extrabold ${statusTone}`}
          >
            {isVerified ? (
              <CheckCircle2 aria-hidden="true" size={14} strokeWidth={2.6} />
            ) : (
              <TriangleAlert aria-hidden="true" size={14} strokeWidth={2.6} />
            )}
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-7 lg:grid-cols-[auto_1fr] lg:items-start">
          <span
            aria-hidden="true"
            className={`grid h-16 w-16 place-items-center rounded-2xl border ${
              isVerified
                ? "border-primary/25 bg-primary/10 text-primary"
                : isError || isMissing
                  ? "border-destructive/25 bg-destructive/10 text-destructive"
                  : "border-border bg-muted text-primary"
            }`}
          >
            {isVerified ? (
              <MailCheck size={30} strokeWidth={2.4} />
            ) : (
              <TriangleAlert size={30} strokeWidth={2.4} />
            )}
          </span>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-card-foreground sm:text-4xl">
              {isVerified
                ? "Your email is verified"
                : "We could not verify this link"}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {message}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {isVerified ? (
                <Link
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  href={AUTH_PAGE_ROUTES.signIn}
                >
                  Continue to sign in
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2.5} />
                </Link>
              ) : null}

              {isMissing || isError ? (
                <Link
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground hover:border-primary hover:bg-accent hover:text-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                  href={AUTH_PAGE_ROUTES.resendVerification}
                >
                  Resend verification email
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
          {[
            {
              title: "Account access",
              copy: isVerified
                ? "Use your email and password to sign in."
                : "Use the latest verification email from Asancha.",
            },
            {
              title: "Profile setup",
              copy: "After sign in, complete the profile details needed for your workspace.",
            },
            {
              title: "Dashboard",
              copy: "Your role dashboard opens with your next actions and account status.",
            },
          ].map((item, index) => (
            <div
              className="rounded-xl border border-border bg-background/70 p-4"
              key={item.title}
            >
              <span className="text-xs font-extrabold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-2 text-sm font-extrabold text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.copy}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ShieldCheck aria-hidden="true" size={15} strokeWidth={2.5} />
          Verification links are checked securely and the token is never shown
          on this page.
        </div>
      </div>
    </section>
  );
}
