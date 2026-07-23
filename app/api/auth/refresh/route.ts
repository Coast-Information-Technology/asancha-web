// File: app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  clearAuthSessionCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthSessionCookies,
} from "@/src/features/auth/server/auth-session-cookies";
import { API_ROUTES } from "@/src/lib/api/api-routes";

import {
  getEnvelopeData,
  proxyBackendAuthRequest,
  readJsonBody,
} from "../_lib/backend-auth-proxy";

interface BackendRefreshData {
  accessToken?: string | null;
  accessExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshExpiresAt?: string | null;
  sessionId?: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const refreshTokenValue =
    typeof refreshToken === "string" ? refreshToken.trim() : "";

  if (!refreshTokenValue) {
    const response = NextResponse.json(
      {
        success: false,
        message: "Session refresh is unavailable.",
        data: null,
        error: {
          code: "missing_refresh_token",
          message: "Session refresh is unavailable.",
        },
      },
      { status: 401 },
    );

    clearAuthSessionCookies(response);

    return response;
  }

  const backendResponse = await proxyBackendAuthRequest(API_ROUTES.auth.refresh, {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });
  const body = await readJsonBody(backendResponse);
  const response = NextResponse.json(body, {
    status: backendResponse.status,
  });

  if (backendResponse.ok) {
    const data = getEnvelopeData<BackendRefreshData>(body);

    if (data) {
      setAuthSessionCookies(response, data);
    }
  } else {
    clearAuthSessionCookies(response);
  }

  return response;
}
