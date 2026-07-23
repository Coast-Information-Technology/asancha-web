// File: src/features/auth/server/auth-session-cookies.ts

import type { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE_NAME = "asancha_access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "asancha_refresh_token";
export const SESSION_COOKIE_NAME = "asancha_session";
export const SESSION_HINT_COOKIE_NAME = "asancha_session_hint";

interface BackendAuthTokenPayload {
  accessToken?: string | null;
  accessExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshExpiresAt?: string | null;
  sessionId?: string | null;
}

const COOKIE_PATH = "/";

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

function getCookieMaxAge(expiresAt: string | null | undefined): number | undefined {
  if (!expiresAt) {
    return undefined;
  }

  const expiresInMs = Date.parse(expiresAt) - Date.now();

  if (!Number.isFinite(expiresInMs) || expiresInMs <= 0) {
    return undefined;
  }

  return Math.floor(expiresInMs / 1000);
}

export function setAuthSessionCookies(
  response: NextResponse,
  tokens: BackendAuthTokenPayload,
): void {
  const secure = isProductionRuntime();

  if (tokens.accessToken) {
    response.cookies.set(ACCESS_TOKEN_COOKIE_NAME, tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: COOKIE_PATH,
      maxAge: getCookieMaxAge(tokens.accessExpiresAt),
    });
  }

  if (tokens.refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE_NAME, tokens.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: COOKIE_PATH,
      maxAge: getCookieMaxAge(tokens.refreshExpiresAt),
    });
  }

  if (tokens.sessionId) {
    response.cookies.set(SESSION_COOKIE_NAME, tokens.sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: COOKIE_PATH,
      maxAge: getCookieMaxAge(tokens.refreshExpiresAt),
    });
  }

  response.cookies.set(SESSION_HINT_COOKIE_NAME, "authenticated", {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: COOKIE_PATH,
    maxAge: getCookieMaxAge(tokens.refreshExpiresAt) ?? 60 * 60,
  });
}

export function clearAuthSessionCookies(response: NextResponse): void {
  for (const cookieName of [
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    SESSION_COOKIE_NAME,
    SESSION_HINT_COOKIE_NAME,
  ]) {
    response.cookies.set(cookieName, "", {
      httpOnly: cookieName !== SESSION_HINT_COOKIE_NAME,
      sameSite: "lax",
      secure: isProductionRuntime(),
      path: COOKIE_PATH,
      maxAge: 0,
    });
  }
}
