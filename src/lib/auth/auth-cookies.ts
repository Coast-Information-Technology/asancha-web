// File: src/lib/auth/auth-cookies.ts

/**
 * Asancha Auth Cookie Helpers
 *
 * Purpose:
 * Provides cookie-name constants and lightweight cookie helpers for
 * Asancha Web Public frontend route guidance.
 *
 * Main responsibilities:
 * - Detect whether a browser or request appears to have an auth cookie
 * - Read non-sensitive client-visible cookie values where available
 * - Keep cookie values out of public logs and public UI
 *
 * Important Asancha Web Public rule:
 * Cookie presence is only a session hint.
 * It is not proof of authentication, role, verification, payment approval,
 * API partner approval, or resource permission.
 *
 * Security note:
 * Backend API authentication and authorization remain the final authority.
 */

export const AUTH_COOKIE_NAMES = [
  "asancha_access_token",
  "asancha_session",
  "access_token",
  "session",
] as const;

export const SESSION_HINT_COOKIE_NAME = "asancha_session_hint";

export type AuthCookieName = (typeof AUTH_COOKIE_NAMES)[number];

export interface CookieLookupSource {
  cookies?: {
    get?: (name: string) => { value?: string } | string | undefined;
  };
}

/**
 * Escapes a cookie name for safe use inside a regular expression.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Reads a cookie value from a raw cookie header string.
 */
export function getCookieFromHeader(
  cookieHeader: string | null | undefined,
  cookieName: string,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookiePattern = new RegExp(
    `(?:^|; )${escapeRegExp(cookieName)}=([^;]*)`,
  );

  const match = cookieHeader.match(cookiePattern);

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/**
 * Reads a cookie value from document.cookie in the browser.
 */
export function getBrowserCookie(cookieName: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  return getCookieFromHeader(document.cookie, cookieName);
}

/**
 * Reads a cookie value from a NextRequest-like cookie source.
 */
export function getCookieFromLookupSource(
  source: CookieLookupSource | null | undefined,
  cookieName: string,
): string | null {
  const cookieValue = source?.cookies?.get?.(cookieName);

  if (!cookieValue) {
    return null;
  }

  if (typeof cookieValue === "string") {
    return cookieValue;
  }

  return cookieValue.value ?? null;
}

/**
 * Checks whether a raw cookie header contains any known auth cookie.
 */
export function hasAuthCookieInHeader(
  cookieHeader: string | null | undefined,
): boolean {
  return AUTH_COOKIE_NAMES.some((cookieName) => {
    return Boolean(getCookieFromHeader(cookieHeader, cookieName));
  });
}

/**
 * Checks whether document.cookie contains any known auth cookie.
 */
export function hasBrowserAuthCookie(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  return hasAuthCookieInHeader(document.cookie);
}

/**
 * Checks whether a NextRequest-like cookie source contains any known auth cookie.
 */
export function hasAuthCookieInLookupSource(
  source: CookieLookupSource | null | undefined,
): boolean {
  return AUTH_COOKIE_NAMES.some((cookieName) => {
    return Boolean(getCookieFromLookupSource(source, cookieName));
  });
}

/**
 * Reads the client-visible session hint cookie.
 *
 * This value must never contain secrets or sensitive claims.
 */
export function getBrowserSessionHint(): string | null {
  return getBrowserCookie(SESSION_HINT_COOKIE_NAME);
}

/**
 * Clears the client-visible session hint cookie.
 *
 * This does not clear HttpOnly auth cookies.
 * Logout must still call the backend logout endpoint.
 */
export function clearBrowserSessionHint(): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_HINT_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/**
 * Returns safe auth cookie names for middleware and diagnostics.
 *
 * This returns names only, never cookie values.
 */
export function getAuthCookieNames(): readonly AuthCookieName[] {
  return AUTH_COOKIE_NAMES;
}
