// File: app/api/backend/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  clearAuthSessionCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthSessionCookies,
} from "@/src/features/auth/server/auth-session-cookies";
import { API_ROUTES, buildApiUrl } from "@/src/lib/api/api-routes";

import {
  getEnvelopeData,
  proxyBackendAuthRequest,
  readJsonBody,
} from "../../auth/_lib/backend-auth-proxy";

interface BackendRefreshData {
  accessToken?: string | null;
  accessExpiresAt?: string | null;
  refreshToken?: string | null;
  refreshExpiresAt?: string | null;
  sessionId?: string | null;
}

const HOP_BY_HOP_HEADERS = new Set([
  "accept-encoding",
  "authorization",
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function createClientResponse(
  backendResponse: Response,
  responseBody: string,
): NextResponse {
  const headers = new Headers();
  const contentType = backendResponse.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  } else {
    headers.set("content-type", "application/json");
  }

  return new NextResponse(responseBody, {
    status: backendResponse.status,
    headers,
  });
}

function createBackendPath(request: NextRequest): string {
  const backendPath = request.nextUrl.pathname.replace(/^\/api\/backend/, "");

  return `${backendPath || "/"}${request.nextUrl.search}`;
}

function createProxyHeaders(
  request: NextRequest,
  accessToken: string | null,
  fallbackAuthorization: string | null,
) {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase()) && key !== "cookie") {
      headers.set(key, value);
    }
  });

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (!accessToken && fallbackAuthorization && !headers.has("Authorization")) {
    headers.set("Authorization", fallbackAuthorization);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (!headers.has("X-Asancha-Client")) {
    headers.set("X-Asancha-Client", "asancha-web");
  }

  return headers;
}

async function refreshAccessToken(
  request: NextRequest,
): Promise<BackendRefreshData | null> {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const refreshTokenValue =
    typeof refreshToken === "string" ? refreshToken.trim() : "";

  if (!refreshTokenValue) {
    return null;
  }

  const backendResponse = await proxyBackendAuthRequest(API_ROUTES.auth.refresh, {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });
  const responseBody = await readJsonBody(backendResponse);

  if (!backendResponse.ok) {
    return null;
  }

  return getEnvelopeData<BackendRefreshData>(responseBody);
}

async function forwardRequest(
  request: NextRequest,
  accessToken: string | null,
  fallbackAuthorization: string | null,
  body: ArrayBuffer | undefined,
): Promise<Response> {
  return fetch(buildApiUrl(createBackendPath(request)), {
    method: request.method,
    headers: createProxyHeaders(request, accessToken, fallbackAuthorization),
    body,
    cache: "no-store",
  });
}

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const requestBody =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  const fallbackAuthorization = request.headers.get("authorization");
  let backendResponse = await forwardRequest(
    request,
    accessToken,
    fallbackAuthorization,
    requestBody,
  );
  let refreshedTokens: BackendRefreshData | null = null;

  if (backendResponse.status === 401) {
    refreshedTokens = await refreshAccessToken(request);
    accessToken = refreshedTokens?.accessToken ?? null;

    if (accessToken) {
      backendResponse = await forwardRequest(
        request,
        accessToken,
        null,
        requestBody,
      );

      if (backendResponse.status === 401 && fallbackAuthorization) {
        backendResponse = await forwardRequest(
          request,
          null,
          fallbackAuthorization,
          requestBody,
        );
      }
    } else if (fallbackAuthorization) {
      backendResponse = await forwardRequest(
        request,
        null,
        fallbackAuthorization,
        requestBody,
      );
    }
  }

  const responseText = await backendResponse.text();
  const response = createClientResponse(backendResponse, responseText);

  if (refreshedTokens && backendResponse.ok) {
    setAuthSessionCookies(response, refreshedTokens);
  }

  if (backendResponse.status === 401) {
    clearAuthSessionCookies(response);
  }

  return response;
}

export function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export function PUT(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}
