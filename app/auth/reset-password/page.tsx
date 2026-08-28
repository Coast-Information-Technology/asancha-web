// File: app/auth/reset-password/page.tsx

/**
 * Asancha Reset Password Page
 *
 * The reset token is captured by the Next proxy and stored in a short-lived
 * HttpOnly cookie. This server component only exposes whether a token is
 * available; the token value never reaches the browser component.
 */

import { cookies } from "next/headers";

import { PASSWORD_RESET_TOKEN_COOKIE_NAME } from "@/src/features/auth/server/password-reset-token";

import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const hasResetToken = Boolean(
    cookieStore.get(PASSWORD_RESET_TOKEN_COOKIE_NAME)?.value,
  );

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

      <ResetPasswordForm hasResetToken={hasResetToken} />
    </section>
  );
}
