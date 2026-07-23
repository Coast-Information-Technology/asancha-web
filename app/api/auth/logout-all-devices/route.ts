// File: app/api/auth/logout-all-devices/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  clearAuthSessionCookies,
} from "@/src/features/auth/server/auth-session-cookies";
import { API_ROUTES } from "@/src/lib/api/api-routes";

import { proxyBackendAuthRequest, readJsonBody } from "../_lib/backend-auth-proxy";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const accessToken =
    request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headers = new Headers();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const backendResponse = await proxyBackendAuthRequest(API_ROUTES.auth.logout, {
    method: "POST",
    headers,
    body: JSON.stringify({ allDevices: true }),
  }).catch(() => null);
  const body = backendResponse
    ? await readJsonBody(backendResponse)
    : {
        success: true,
        message: "Signed out from all devices",
        data: { signedOut: true },
      };
  const response = NextResponse.json(body, {
    status: backendResponse?.status ?? 200,
  });

  clearAuthSessionCookies(response);

  return response;
}
