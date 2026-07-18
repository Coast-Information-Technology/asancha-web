// File: middleware.ts

/**
 * Asancha Web Middleware
 *
 * Purpose:
 * Provides frontend route guidance for the public/user Asancha web app.
 *
 * Main responsibilities:
 * - Redirect unauthenticated users away from protected public-user routes
 * - Redirect authenticated users away from guest-preferred auth routes
 * - Prevent admin/staff route patterns from being used inside asancha-web
 * - Preserve the intended destination through a safe redirect query parameter
 *
 * Security note:
 * This middleware is only a frontend navigation guard.
 * It must not be treated as the final security layer.
 * Backend API authentication, authorization, account status, profile status,
 * verification status, policy checks, payment checks, API partner approval,
 * and resource-level permissions remain the final source of enforcement.
 */

import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAMES = [
  "asancha_access_token",
  "asancha_session",
  "access_token",
  "session",
] as const;

const GUEST_PREFERRED_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
] as const;

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/account",
  "/documents",
  "/verification",
  "/payments",
  "/reservations",
  "/bookings",
  "/conversations",
  "/notifications",
  "/recommendations",
] as const;

const PROTECTED_API_PARTNER_ROUTE_PREFIXES = [
  "/api-partner/dashboard",
  "/api-partner/client",
  "/api-partner/keys",
  "/api-partner/usage",
  "/api-partner/webhooks",
  "/api-partner/docs",
  "/api-partner/billing",
  "/api-partner/payments",
  "/api-partner/support",
] as const;

const FORBIDDEN_PUBLIC_APP_ROUTE_PREFIXES = ["/admin", "/staff"] as const;

/**
 * Checks whether the request contains one of the supported auth cookies.
 *
 * This does not verify token validity.
 * Backend verification remains required for protected API actions.
 */
function hasAuthCookie(request: NextRequest): boolean {
  return AUTH_COOKIE_NAMES.some((cookieName) => {
    const cookieValue = request.cookies.get(cookieName)?.value;

    return Boolean(cookieValue);
  });
}

/**
 * Checks whether the current pathname matches a route prefix exactly
 * or starts with that route prefix as a nested path.
 */
function startsWithAny(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

/**
 * Checks whether the current pathname is a guest-preferred route.
 *
 * Authenticated users should normally be redirected away from these routes.
 */
function isGuestPreferredRoute(pathname: string): boolean {
  return GUEST_PREFERRED_ROUTES.some((route) => pathname === route);
}

/**
 * Creates a URL object for a local redirect target.
 */
function createRedirectUrl(request: NextRequest, targetPath: string): URL {
  return new URL(targetPath, request.url);
}

/**
 * Creates the sign-in redirect URL and preserves the intended destination.
 */
function createSignInRedirect(request: NextRequest): URL {
  const signInUrl = createRedirectUrl(request, "/auth/sign-in");
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (currentPath && currentPath !== "/auth/sign-in") {
    signInUrl.searchParams.set("redirect", currentPath);
  }

  return signInUrl;
}

/**
 * Handles frontend route guidance for public-user routes.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasAuthCookie(request);

  const isForbiddenPublicAppRoute = startsWithAny(
    pathname,
    FORBIDDEN_PUBLIC_APP_ROUTE_PREFIXES,
  );

  if (isForbiddenPublicAppRoute) {
    return NextResponse.redirect(
      createRedirectUrl(request, "/auth/unauthorized"),
    );
  }

  const isProtectedRoute =
    startsWithAny(pathname, PROTECTED_ROUTE_PREFIXES) ||
    startsWithAny(pathname, PROTECTED_API_PARTNER_ROUTE_PREFIXES);

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(createSignInRedirect(request));
  }

  if (isAuthenticated && isGuestPreferredRoute(pathname)) {
    return NextResponse.redirect(createRedirectUrl(request, "/dashboard"));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on app routes, but ignore:
     * - API routes
     * - Next.js internals
     * - static assets
     * - common public files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
