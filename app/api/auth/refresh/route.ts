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

interface RefreshRequestBody {
  refreshToken?: string | null;
}

async function readRefreshTokenFromBody(
  request: NextRequest,
): Promise<string> {
  try {
    const body = (await request.json()) as RefreshRequestBody;
    const refreshToken =
      typeof body?.refreshToken === "string" ? body.refreshToken.trim() : "";

    return refreshToken;
  } catch {
    return "";
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const refreshTokenValue =
    typeof refreshToken === "string" && refreshToken.trim().length > 0
      ? refreshToken.trim()
      : await readRefreshTokenFromBody(request);

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
