// File: app/auth/email-verify/page.tsx

/**
 * Asancha Email Verification Callback Page
 *
 * Purpose:
 * Receives verification links from email messages and passes the opaque token
 * to the backend verification endpoint.
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

interface EmailVerifyPageProps {
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
 * Renders the email verification callback page.
 */
export default async function EmailVerifyPage({
  searchParams,
}: EmailVerifyPageProps) {
  const params = await searchParams;
  const token = getSingleSearchParam(params?.token);
  const userPublicId =
    getSingleSearchParam(params?.userPublicId) ||
    getSingleSearchParam(params?.user);

  return <EmailVerifyStatus token={token} userPublicId={userPublicId} />;
}
