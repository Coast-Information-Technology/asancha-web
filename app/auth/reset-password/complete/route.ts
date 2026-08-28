// File: app/auth/reset-password/complete/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  PASSWORD_RESET_TOKEN_COOKIE_NAME,
  PASSWORD_RESET_ROUTE,
} from "@/src/features/auth/server/password-reset-token";
import { API_ROUTES } from "@/src/lib/api/api-routes";
import { isRecord } from "@/src/lib/api/api-response";

import {
  proxyBackendAuthRequest,
  readJsonBody,
} from "@/app/api/auth/_lib/backend-auth-proxy";

function clearResetToken(response: NextResponse): void {
  response.cookies.set(PASSWORD_RESET_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: PASSWORD_RESET_ROUTE,
    maxAge: 0,
  });
}

function createErrorResponse(message: string, status: number): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      message,
      data: null,
      error: {
        code: "PASSWORD_RESET_FAILED",
        message,
      },
      meta: {
        path: PASSWORD_RESET_ROUTE,
        statusCode: status,
      },
    },
    { status },
  );
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies
    .get(PASSWORD_RESET_TOKEN_COOKIE_NAME)
    ?.value.trim();

  if (!token) {
    return createErrorResponse(
      "This reset link is incomplete or has expired. Request a new reset email.",
      400,
    );
  }

  const requestBody = (await request.json().catch(() => null)) as unknown;
  const password =
    isRecord(requestBody) && typeof requestBody.password === "string"
      ? requestBody.password
      : "";

  if (!password) {
    return createErrorResponse("Enter a new password.", 400);
  }

  const backendResponse = await proxyBackendAuthRequest(
    API_ROUTES.auth.resetPassword,
    {
      method: "POST",
      body: JSON.stringify({ token, password }),
    },
  );
  const body = await readJsonBody(backendResponse);
  const response = NextResponse.json(body, {
    status: backendResponse.status,
  });

  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");

  if (backendResponse.ok) {
    clearResetToken(response);
  }

  return response;
}
