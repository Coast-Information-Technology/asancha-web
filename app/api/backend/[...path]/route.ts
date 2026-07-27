// File: app/api/backend/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  clearAuthSessionCookies,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthSessionCookies,
} from "@/src/features/auth/server/auth-session-cookies";
import { buildApiUrl } from "@/src/lib/api/api-routes";

import {
  BackendRefreshData,
  refreshBackendSession,
} from "../../auth/_lib/backend-session-refresh";

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
  const initialAccessToken =
    request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  const fallbackAuthorization = request.headers.get("authorization");
  let backendResponse = await forwardRequest(
    request,
    initialAccessToken,
    fallbackAuthorization,
    requestBody,
  );
  let refreshedTokens: BackendRefreshData | null = null;
  let refreshRejected = false;

  if (backendResponse.status === 401) {
    const refreshToken = request.cookies
      .get(REFRESH_TOKEN_COOKIE_NAME)
      ?.value?.trim();

    if (refreshToken) {
      const refreshResult = await refreshBackendSession(refreshToken);

      if (refreshResult.status === "success") {
        refreshedTokens = refreshResult.tokens;
        backendResponse = await forwardRequest(
          request,
          refreshedTokens.accessToken ?? null,
          null,
          requestBody,
        );
      } else if (refreshResult.status === "rejected") {
        refreshRejected = true;
      }
    } else if (fallbackAuthorization && initialAccessToken) {
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

  if (refreshedTokens) {
    setAuthSessionCookies(response, refreshedTokens);
  }

  if (refreshRejected) {
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
