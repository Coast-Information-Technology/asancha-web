// File: app/api/auth/_lib/backend-session-refresh.ts

import { API_ROUTES } from "@/src/lib/api/api-routes";

import {
  getEnvelopeData,
  proxyBackendAuthRequest,
  readJsonBody,
} from "./backend-auth-proxy";

export interface BackendRefreshData {
  accessToken?: string | null;
  accessExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshExpiresAt?: string | null;
  sessionId?: string | null;
}

/**
 * - "success": backend accepted the refresh token and returned new tokens.
 * - "rejected": backend explicitly rejected the refresh token (401/403).
 *   Only this outcome should clear the session cookies.
 * - "unavailable": transient failure (network, 5xx, malformed body). The
 *   refresh token may still be valid, so cookies must be left alone.
 */
export type BackendRefreshResult =
  | {
      status: "success";
      tokens: BackendRefreshData;
      body: unknown;
      httpStatus: number;
    }
  | { status: "rejected"; body: unknown; httpStatus: number }
  | { status: "unavailable"; body: unknown; httpStatus: number };

interface PendingRefresh {
  token: string;
  promise: Promise<BackendRefreshResult>;
}

interface RecentRefresh {
  token: string;
  result: BackendRefreshResult;
  completedAt: number;
}

// The backend rotates refresh tokens, so a token is single-use. Concurrent
// requests share one in-flight refresh, and requests that arrive just after a
// rotation (still carrying the consumed token) reuse the recent result instead
// of burning a doomed refresh attempt that would log the user out.
const RECENT_REFRESH_TTL_MS = 30_000;

let pendingRefresh: PendingRefresh | null = null;
let recentRefresh: RecentRefresh | null = null;

async function performBackendRefresh(
  refreshToken: string,
): Promise<BackendRefreshResult> {
  const backendResponse = await proxyBackendAuthRequest(
    API_ROUTES.auth.refresh,
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    },
  );
  const body = await readJsonBody(backendResponse);

  if (backendResponse.ok) {
    const tokens = getEnvelopeData<BackendRefreshData>(body);

    if (tokens?.accessToken) {
      return {
        status: "success",
        tokens,
        body,
        httpStatus: backendResponse.status,
      };
    }

    return { status: "unavailable", body, httpStatus: backendResponse.status };
  }

  const isRejected =
    backendResponse.status === 401 || backendResponse.status === 403;

  return {
    status: isRejected ? "rejected" : "unavailable",
    body,
    httpStatus: backendResponse.status,
  };
}

export function refreshBackendSession(
  refreshToken: string,
): Promise<BackendRefreshResult> {
  if (pendingRefresh?.token === refreshToken) {
    return pendingRefresh.promise;
  }

  if (
    recentRefresh?.token === refreshToken &&
    Date.now() - recentRefresh.completedAt < RECENT_REFRESH_TTL_MS
  ) {
    return Promise.resolve(recentRefresh.result);
  }

  const promise = performBackendRefresh(refreshToken)
    .then((result) => {
      if (result.status === "success") {
        recentRefresh = { token: refreshToken, result, completedAt: Date.now() };
      }

      return result;
    })
    .finally(() => {
      if (pendingRefresh?.promise === promise) {
        pendingRefresh = null;
      }
    });

  pendingRefresh = { token: refreshToken, promise };

  return promise;
}
