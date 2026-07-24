// File: app/verify-email/page.tsx

/**
 * Asancha Root Email Verification Callback Page
 *
 * Purpose:
 * Supports secure verification links that land at /verify-email?token=...
 * and passes the opaque token to the shared email verification status UI.
 *
 * Security note:
 * Verification tokens must never be rendered, logged, or persisted by the
 * frontend. Backend token validation, expiry, account-state checks, and audit
 * logging remain final.
 */

import type { Metadata } from "next";

import { EmailVerifyStatus } from "./_components/email-verify-status";

export const metadata: Metadata = {
  title: "Verify email | Asancha",
  description: "Verify your Asancha account email address.",
};

interface VerifyEmailPageProps {
  searchParams?: Promise<{
    token?: string | string[];
    userPublicId?: string | string[];
    user?: string | string[];
  }>;
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

/**
 * Renders the backend-compatible email verification callback page.
 */
export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = getSingleSearchParam(params?.token);
  const userPublicId =
    getSingleSearchParam(params?.userPublicId) ||
    getSingleSearchParam(params?.user);

  return <EmailVerifyStatus token={token} userPublicId={userPublicId} />;
}
