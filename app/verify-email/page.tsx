// File: app/verify-email/page.tsx

/**
 * Asancha Root Email Verification Callback Page
 *
 * Purpose:
 * Displays the safe result after the server proxy consumes a verification
 * token and redirects away from the token-bearing URL.
 *
 * Security note:
 * Verification tokens must never be rendered, logged, or persisted by the
 * frontend. Backend token validation, expiry, account-state checks, and audit
 * logging remain final.
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  EmailVerifyStatus,
  type EmailVerificationDisplayStatus,
} from "./_components/email-verify-status";

export const metadata: Metadata = {
  title: "Verify email | Asancha",
  description: "Verify your Asancha account email address.",
  referrer: "no-referrer",
  robots: {
    index: false,
    follow: false,
  },
};

const EMAIL_VERIFICATION_RESULT_COOKIE_NAME =
  "asancha_email_verification_result";

/**
 * Renders the backend-compatible email verification callback page.
 */
export default async function VerifyEmailPage() {
  const cookieStore = await cookies();
  const requestedStatus = cookieStore.get(
    EMAIL_VERIFICATION_RESULT_COOKIE_NAME,
  )?.value;
  const status: EmailVerificationDisplayStatus =
    requestedStatus === "verified" ||
    requestedStatus === "already_used" ||
    requestedStatus === "error"
      ? requestedStatus
      : "missing";

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      id="main-content"
      tabIndex={-1}
    >
      <EmailVerifyStatus status={status} />
    </main>
  );
}
