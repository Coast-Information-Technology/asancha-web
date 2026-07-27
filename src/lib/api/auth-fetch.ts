// File: src/lib/api/auth-fetch.ts

/**
 * Authenticated Fetch Helpers
 *
 * Purpose:
 * Provides convenience wrappers for authenticated frontend requests.
 *
 * Important notes:
 * - These helpers include browser credentials by default.
 * - They do not prove the user is authenticated.
 * - Backend API authentication, authorization, account status, policy,
 *   profile, verification, payment, and permission checks remain final.
 * - Do not store tokens in localStorage for permission decisions.
 */

import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  apiRequest,
  ApiClientRequestOptions,
  ApiRequestBody,
} from "./api-client";
import { AsanchaApiError } from "./api-error";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/src/features/auth/lib/auth-token-store";

const AUTH_REQUEST_HEADERS = {
  "X-Asancha-Client": "asancha-web",
} as const;

interface RefreshTokenResponseData {
  accessToken?: string | null;
  accessExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshExpiresAt?: string | null;
  sessionId?: string | null;
}

interface RefreshTokenEnvelope {
  success?: boolean;
  data?: RefreshTokenResponseData | null;
}

let pendingTokenRefresh: Promise<boolean> | null = null;

function buildAuthenticatedApiUrl(path: string | undefined): string {
  if (!path) {
    throw new Error("API route is missing for this request.");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `/api/backend${normalizedPath}`;
}

async function applyAuthHeadersAsync(headers: Headers): Promise<Headers> {
  Object.entries(AUTH_REQUEST_HEADERS).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });

  if (!headers.has("Authorization")) {
    const accessToken = getAccessToken();

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  return headers;
}

function isUnauthorizedError(error: unknown): boolean {
  return error instanceof AsanchaApiError && error.isUnauthorized();
}

function isRefreshTokenEnvelope(
  value: unknown,
): value is RefreshTokenEnvelope {
  return value !== null && typeof value === "object" && "success" in value;
}

async function refreshAuthTokens(): Promise<boolean> {
  if (pendingTokenRefresh) {
    return pendingTokenRefresh;
  }

  const refreshToken = getRefreshToken();
  pendingTokenRefresh = fetch("/api/auth/refresh", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken:
        typeof refreshToken === "string" && refreshToken.trim().length > 0
          ? refreshToken
          : null,
    }),
    credentials: "include",
  })
    .then(async (response) => {
      const body = (await response.json().catch(() => null)) as unknown;

      if (!response.ok || !isRefreshTokenEnvelope(body) || !body.success) {
        if (response.status === 401 || response.status === 403) {
          clearAuthTokens();
        }
        return false;
      }

      if (body.data) {
        setAuthTokens(body.data);
      }

      return Boolean(body.data?.accessToken);
    })
    .catch(() => false)
    .finally(() => {
      pendingTokenRefresh = null;
    });

  return pendingTokenRefresh;
}

async function retryAfterRefresh<TResponse>(
  request: () => Promise<TResponse>,
  error: unknown,
): Promise<TResponse> {
  if (!isUnauthorizedError(error)) {
    throw error;
  }

  const refreshed = await refreshAuthTokens();

  if (!refreshed) {
    throw error;
  }

  return request();
}

/**
 * Performs a raw authenticated fetch request.
 *
 * Use this only when a feature needs direct Response access.
 * Prefer authApiGet/authApiPost/authApiPatch helpers for normal API calls.
 */
export function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(init.headers)).then((headers) => {
      return fetch(buildAuthenticatedApiUrl(path), {
        ...init,
        headers,
        credentials: init.credentials ?? "include",
      });
    });

  return makeRequest().then(async (response) => {
    if (response.status !== 401) {
      return response;
    }

    const refreshed = await refreshAuthTokens();

    if (!refreshed) {
      return response;
    }

    return makeRequest();
  });
}

/**
 * Sends an authenticated request through the shared Asancha API client.
 */
export function authApiRequest<TResponse, TBody = ApiRequestBody>(
  path: string,
  options: ApiClientRequestOptions<TBody> = {},
): Promise<TResponse> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(options.headers)).then((headers) => {
      return apiRequest<TResponse, TBody>(buildAuthenticatedApiUrl(path), {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
    });

  return makeRequest().catch((error: unknown) =>
    retryAfterRefresh(makeRequest, error),
  );
}

/**
 * Sends an authenticated GET request.
 */
export function authApiGet<TResponse>(
  path: string,
  options: Omit<ApiClientRequestOptions, "method" | "body"> = {},
): Promise<TResponse> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(options.headers)).then((headers) => {
      return apiGet<TResponse>(buildAuthenticatedApiUrl(path), {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
    });

  return makeRequest().catch((error: unknown) =>
    retryAfterRefresh(makeRequest, error),
  );
}

/**
 * Sends an authenticated POST request.
 */
export function authApiPost<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(options.headers)).then((headers) => {
      return apiPost<TResponse, TBody>(buildAuthenticatedApiUrl(path), body, {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
    });

  return makeRequest().catch((error: unknown) =>
    retryAfterRefresh(makeRequest, error),
  );
}

/**
 * Sends an authenticated PUT request.
 */
export function authApiPut<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(options.headers)).then((headers) => {
      return apiPut<TResponse, TBody>(buildAuthenticatedApiUrl(path), body, {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
    });

  return makeRequest().catch((error: unknown) =>
    retryAfterRefresh(makeRequest, error),
  );
}

/**
 * Sends an authenticated PATCH request.
 */
export function authApiPatch<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(options.headers)).then((headers) => {
      return apiPatch<TResponse, TBody>(buildAuthenticatedApiUrl(path), body, {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
    });

  return makeRequest().catch((error: unknown) =>
    retryAfterRefresh(makeRequest, error),
  );
}

/**
 * Sends an authenticated DELETE request.
 */
export function authApiDelete<TResponse>(
  path: string,
  options: Omit<ApiClientRequestOptions, "method" | "body"> = {},
): Promise<TResponse> {
  const makeRequest = () =>
    applyAuthHeadersAsync(new Headers(options.headers)).then((headers) => {
      return apiDelete<TResponse>(buildAuthenticatedApiUrl(path), {
        ...options,
        credentials: options.credentials ?? "include",
        headers,
      });
    });

  return makeRequest().catch((error: unknown) =>
    retryAfterRefresh(makeRequest, error),
  );
}
