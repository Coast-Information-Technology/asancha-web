// File: app/api/auth/session/route.ts

import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthSessionCookies,
} from "@/src/features/auth/server/auth-session-cookies";
import { API_ROUTES } from "@/src/lib/api/api-routes";
import {
  getDashboardPathForBusinessProfile,
  isBusinessProfileType,
  type BusinessProfileType,
} from "@/src/lib/auth/role-guards";

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

interface BackendGeneralProfileSummary {
  profileCompletionStatus: "not_started" | "in_progress" | "completed";
  activeBusinessProfileType: BusinessProfileType | null;
}

interface BackendActiveBusinessProfileSummary {
  activeBusinessProfile: {
    profileType: BusinessProfileType;
  } | null;
}

interface PublicAuthSessionAction {
  authenticated: boolean;
  dashboardHref: string | null;
}

function createSessionResponse(
  data: PublicAuthSessionAction,
  status = 200,
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      message: "OK",
      data,
      error: null,
    },
    { status },
  );
}

function getDashboardHrefForProfileType(
  profileType: BusinessProfileType | null | undefined,
): string | null {
  if (!profileType || !isBusinessProfileType(profileType)) {
    return null;
  }

  return getDashboardPathForBusinessProfile(profileType);
}

async function refreshAccessToken(
  request: NextRequest,
): Promise<{ accessToken: string | null; responseCookies?: BackendRefreshData }> {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME)?.value;
  const refreshTokenValue =
    typeof refreshToken === "string" ? refreshToken.trim() : "";

  if (!refreshTokenValue) {
    return { accessToken: null };
  }

  const backendResponse = await proxyBackendAuthRequest(API_ROUTES.auth.refresh, {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });
  const body = await readJsonBody(backendResponse);
  const data = getEnvelopeData<BackendRefreshData>(body);

  if (!backendResponse.ok || !data?.accessToken) {
    return { accessToken: null };
  }

  return {
    accessToken: data.accessToken,
    responseCookies: data,
  };
}

async function fetchWithBearer(path: string, accessToken: string) {
  return proxyBackendAuthRequest(path, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

async function resolveDashboardHref(accessToken: string): Promise<string> {
  const profileResponse = await fetchWithBearer(API_ROUTES.profiles.me, accessToken);

  if (profileResponse.ok) {
    const profileBody = await readJsonBody(profileResponse);
    const profile = getEnvelopeData<BackendGeneralProfileSummary>(profileBody);

    if (profile?.profileCompletionStatus !== "completed") {
      return "/onboarding/general-profile";
    }

    const activeProfileResponse = await fetchWithBearer(
      API_ROUTES.profiles.activeBusinessProfile,
      accessToken,
    );
    let resolvedProfileType: BusinessProfileType | null = null;

    if (activeProfileResponse.ok) {
      const activeProfileBody = await readJsonBody(activeProfileResponse);
      const activeProfile =
        getEnvelopeData<BackendActiveBusinessProfileSummary>(activeProfileBody);
      resolvedProfileType =
        activeProfile?.activeBusinessProfile?.profileType ?? null;
      const activeProfileHref =
        getDashboardHrefForProfileType(resolvedProfileType);

      if (activeProfileHref && resolvedProfileType) {
        return activeProfileHref;
      }
    }

    resolvedProfileType = profile?.activeBusinessProfileType ?? null;
    const profileDashboardHref =
      getDashboardHrefForProfileType(resolvedProfileType);

    if (profileDashboardHref && resolvedProfileType) {
      return profileDashboardHref;
    }
  }

  return "/dashboard";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  let accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)?.value ?? null;
  let refreshedTokens: BackendRefreshData | undefined;

  if (!accessToken) {
    const refreshResult = await refreshAccessToken(request);

    accessToken = refreshResult.accessToken;
    refreshedTokens = refreshResult.responseCookies;
  }

  if (!accessToken) {
    return createSessionResponse({
      authenticated: false,
      dashboardHref: null,
    });
  }

  let dashboardHref = await resolveDashboardHref(accessToken);

  if (dashboardHref === "/dashboard") {
    const refreshResult = await refreshAccessToken(request);

    if (refreshResult.accessToken) {
      accessToken = refreshResult.accessToken;
      refreshedTokens = refreshResult.responseCookies;
      dashboardHref = await resolveDashboardHref(accessToken);
    }
  }

  const response = createSessionResponse({
    authenticated: true,
    dashboardHref,
  });

  if (refreshedTokens) {
    setAuthSessionCookies(response, refreshedTokens);
  }

  return response;
}
