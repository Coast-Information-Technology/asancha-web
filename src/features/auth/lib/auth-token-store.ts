// File: src/features/auth/lib/auth-token-store.ts

/**
 * In-memory auth token store.
 *
 * The backend currently returns tokens in the login JSON response. Keep them
 * out of localStorage/sessionStorage and only retain them in browser memory so
 * authenticated client API calls can attach an Authorization header.
 */

interface AuthTokenState {
  accessToken: string | null;
  accessExpiresAt: string | null;
  refreshToken: string | null;
  refreshExpiresAt: string | null;
  sessionId: string | null;
}

const EMPTY_TOKEN_STATE: AuthTokenState = {
  accessToken: null,
  accessExpiresAt: null,
  refreshToken: null,
  refreshExpiresAt: null,
  sessionId: null,
};

let tokenState: AuthTokenState = EMPTY_TOKEN_STATE;

function isBrowserRuntime(): boolean {
  return typeof window !== "undefined";
}

export function setAuthTokens(tokens: Partial<AuthTokenState>): void {
  if (!isBrowserRuntime()) {
    return;
  }

  tokenState = {
    accessToken: tokens.accessToken ?? null,
    accessExpiresAt: tokens.accessExpiresAt ?? null,
    refreshToken: tokens.refreshToken ?? null,
    refreshExpiresAt: tokens.refreshExpiresAt ?? null,
    sessionId: tokens.sessionId ?? null,
  };
}

export function clearAuthTokens(): void {
  tokenState = EMPTY_TOKEN_STATE;
}

export function getAccessToken(): string | null {
  return tokenState.accessToken;
}

export function getRefreshToken(): string | null {
  return tokenState.refreshToken;
}
