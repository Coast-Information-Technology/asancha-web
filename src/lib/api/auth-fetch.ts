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
import { buildApiUrl } from "./api-routes";
import { getAccessToken } from "@/src/features/auth/lib/auth-token-store";

const AUTH_REQUEST_HEADERS = {
  "X-Asancha-Client": "asancha-web",
} as const;

function applyAuthHeaders(headers: Headers): Headers {
  Object.entries(AUTH_REQUEST_HEADERS).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });

  const accessToken = getAccessToken();

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
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
  const headers = applyAuthHeaders(new Headers(init.headers));

  return fetch(buildApiUrl(path), {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
}

/**
 * Sends an authenticated request through the shared Asancha API client.
 */
export function authApiRequest<TResponse, TBody = ApiRequestBody>(
  path: string,
  options: ApiClientRequestOptions<TBody> = {},
): Promise<TResponse> {
  const headers = applyAuthHeaders(new Headers(options.headers));

  return apiRequest<TResponse, TBody>(path, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });
}

/**
 * Sends an authenticated GET request.
 */
export function authApiGet<TResponse>(
  path: string,
  options: Omit<ApiClientRequestOptions, "method" | "body"> = {},
): Promise<TResponse> {
  const headers = applyAuthHeaders(new Headers(options.headers));

  return apiGet<TResponse>(path, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });
}

/**
 * Sends an authenticated POST request.
 */
export function authApiPost<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  const headers = applyAuthHeaders(new Headers(options.headers));

  return apiPost<TResponse, TBody>(path, body, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });
}

/**
 * Sends an authenticated PUT request.
 */
export function authApiPut<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  const headers = applyAuthHeaders(new Headers(options.headers));

  return apiPut<TResponse, TBody>(path, body, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });
}

/**
 * Sends an authenticated PATCH request.
 */
export function authApiPatch<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  const headers = applyAuthHeaders(new Headers(options.headers));

  return apiPatch<TResponse, TBody>(path, body, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });
}

/**
 * Sends an authenticated DELETE request.
 */
export function authApiDelete<TResponse>(
  path: string,
  options: Omit<ApiClientRequestOptions, "method" | "body"> = {},
): Promise<TResponse> {
  const headers = applyAuthHeaders(new Headers(options.headers));

  return apiDelete<TResponse>(path, {
    ...options,
    credentials: options.credentials ?? "include",
    headers,
  });
}
