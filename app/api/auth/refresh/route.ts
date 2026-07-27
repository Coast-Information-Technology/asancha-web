// File: app/api/auth/refresh/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  clearAuthSessionCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthSessionCookies,
} from "@/src/features/auth/server/auth-session-cookies";

import { refreshBackendSession } from "../_lib/backend-session-refresh";

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

  const refreshResult = await refreshBackendSession(refreshTokenValue);
  const response = NextResponse.json(refreshResult.body, {
    status: refreshResult.httpStatus,
  });

  if (refreshResult.status === "success") {
    setAuthSessionCookies(response, refreshResult.tokens);
  } else if (refreshResult.status === "rejected") {
    clearAuthSessionCookies(response);
  }

  return response;
}
