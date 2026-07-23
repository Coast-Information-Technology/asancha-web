// File: app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";

import { setAuthSessionCookies } from "@/src/features/auth/server/auth-session-cookies";
import { API_ROUTES } from "@/src/lib/api/api-routes";

import {
  getEnvelopeData,
  proxyBackendAuthRequest,
  readJsonBody,
} from "../_lib/backend-auth-proxy";

interface BackendLoginData {
  accessToken?: string | null;
  accessExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshExpiresAt?: string | null;
  sessionId?: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const payload = (await request.json()) as unknown;
  const backendResponse = await proxyBackendAuthRequest(API_ROUTES.auth.login, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const body = await readJsonBody(backendResponse);
  const response = NextResponse.json(body, {
    status: backendResponse.status,
  });

  if (backendResponse.ok) {
    const data = getEnvelopeData<BackendLoginData>(body);

    if (data) {
      setAuthSessionCookies(response, data);
    }
  }

  return response;
}
