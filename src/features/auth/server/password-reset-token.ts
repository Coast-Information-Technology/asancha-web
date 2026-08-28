// File: src/features/auth/server/password-reset-token.ts

/**
 * Server-side password reset token settings.
 *
 * The opaque reset token is captured from the emailed link, moved into a
 * short-lived HttpOnly cookie, and never exposed to the reset form's client
 * component.
 */
export const PASSWORD_RESET_ROUTE = "/auth/reset-password";

export const PASSWORD_RESET_TOKEN_COOKIE_NAME = "asancha_password_reset_token";

export const PASSWORD_RESET_TOKEN_MAX_AGE_SECONDS = 30 * 60;
