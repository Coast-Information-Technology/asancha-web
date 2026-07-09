// File: src/lib/auth/auth-guards.ts

/**
 * Asancha Public Auth Route Guards
 *
 * Purpose:
 * Provides public/user frontend route classification and redirect helpers
 * for Asancha Web Public.
 *
 * Main responsibilities:
 * - Identify public, guest-preferred, auth, onboarding, protected,
 *   API partner, and forbidden public-app route groups
 * - Preserve safe redirect destinations
 * - Provide frontend route guidance based on public session state
 *
 * Important Asancha Web Public rule:
 * This file must not model admin/staff roles or permissions.
 * The public app only blocks admin/staff path patterns as forbidden
 * public-app routes and redirects safely to /auth/unauthorized.
 *
 * Security note:
 * These guards support frontend UX only.
 * Backend API enforcement remains final for all sensitive actions.
 */

import {
  AuthRedirectDecision,
  AuthSession,
  DashboardState,
  canSessionUsePublicApp,
  isAuthenticatedSession,
  resolvePostSignInDestination,
} from "./auth-session";

export const PUBLIC_ROUTE_PREFIXES = [
  "/",
  "/about",
  "/how-it-works",
  "/marketplace",
  "/solutions",
  "/api-partners",
  "/pricing",
  "/contact",
  "/support",
  "/faqs",
  "/legal",
  "/cookies",
] as const;

export const GUEST_PREFERRED_ROUTES = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
] as const;

export const PUBLIC_AUTH_ROUTE_PREFIXES = [
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/google",
  "/auth/google/callback",
  "/auth/suspended",
  "/auth/unauthorized",
] as const;

export const ONBOARDING_ROUTE_PREFIXES = ["/onboarding"] as const;

export const PROTECTED_ROUTE_PREFIXES = [
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

export const PROTECTED_API_PARTNER_ROUTE_PREFIXES = [
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

export const PUBLIC_API_PARTNER_ROUTES = [
  "/api-partner",
  "/api-partner/apply",
  "/api-partner/application-status",
] as const;

export const FORBIDDEN_PUBLIC_APP_ROUTE_PREFIXES = [
  "/admin",
  "/staff",
] as const;

export interface RouteGuardDecision {
  allowed: boolean;
  redirectTo?: string;
  reason:
    | "public_route"
    | "guest_preferred_route"
    | "public_auth_route"
    | "onboarding_route"
    | "protected_route"
    | "protected_api_partner_route"
    | "public_api_partner_route"
    | "forbidden_public_app_route"
    | "not_authenticated"
    | "invalid_public_role"
    | "authenticated"
    | "ready";
}

/**
 * Checks whether a path matches a route prefix exactly or as a nested route.
 */
export function pathStartsWithAny(
  pathname: string,
  prefixes: readonly string[],
): boolean {
  return prefixes.some((prefix) => {
    if (prefix === "/") {
      return pathname === "/";
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

/**
 * Checks whether a route is public.
 */
export function isPublicRoute(pathname: string): boolean {
  return pathStartsWithAny(pathname, PUBLIC_ROUTE_PREFIXES);
}

/**
 * Checks whether a route should normally be used only by unauthenticated users.
 */
export function isGuestPreferredRoute(pathname: string): boolean {
  return GUEST_PREFERRED_ROUTES.some((route) => pathname === route);
}

/**
 * Checks whether a route is a public auth support route.
 */
export function isPublicAuthRoute(pathname: string): boolean {
  return pathStartsWithAny(pathname, PUBLIC_AUTH_ROUTE_PREFIXES);
}

/**
 * Checks whether a route is part of onboarding.
 */
export function isOnboardingRoute(pathname: string): boolean {
  return pathStartsWithAny(pathname, ONBOARDING_ROUTE_PREFIXES);
}

/**
 * Checks whether a route requires an authenticated public user.
 */
export function isProtectedRoute(pathname: string): boolean {
  return pathStartsWithAny(pathname, PROTECTED_ROUTE_PREFIXES);
}

/**
 * Checks whether a route is a protected API partner workspace route.
 */
export function isProtectedApiPartnerRoute(pathname: string): boolean {
  return pathStartsWithAny(pathname, PROTECTED_API_PARTNER_ROUTE_PREFIXES);
}

/**
 * Checks whether a route is a public API partner entry route.
 */
export function isPublicApiPartnerRoute(pathname: string): boolean {
  return PUBLIC_API_PARTNER_ROUTES.some((route) => pathname === route);
}

/**
 * Checks whether a route is forbidden inside Asancha Web Public.
 */
export function isForbiddenPublicAppRoute(pathname: string): boolean {
  return pathStartsWithAny(pathname, FORBIDDEN_PUBLIC_APP_ROUTE_PREFIXES);
}

/**
 * Builds a sign-in URL with a safe redirect destination.
 */
export function buildSignInRedirectPath(pathname: string, search = ""): string {
  const currentPath = `${pathname}${search}`;

  if (!currentPath || currentPath === "/auth/sign-in") {
    return "/auth/sign-in";
  }

  return `/auth/sign-in?redirect=${encodeURIComponent(currentPath)}`;
}

/**
 * Checks whether a redirect target is safe for internal app redirects.
 */
export function isSafeInternalRedirectPath(value: string): boolean {
  if (!value.startsWith("/")) {
    return false;
  }

  if (value.startsWith("//")) {
    return false;
  }

  if (value.includes("\\")) {
    return false;
  }

  return true;
}

/**
 * Returns a safe internal redirect path or a fallback.
 */
export function getSafeRedirectPath(
  value: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (!value) {
    return fallback;
  }

  return isSafeInternalRedirectPath(value) ? value : fallback;
}

/**
 * Evaluates frontend route access based on public session state.
 */
export function evaluateRouteAccess(
  pathname: string,
  session: AuthSession | null | undefined,
  search = "",
): RouteGuardDecision {
  if (isForbiddenPublicAppRoute(pathname)) {
    return {
      allowed: false,
      redirectTo: "/auth/unauthorized",
      reason: "forbidden_public_app_route",
    };
  }

  if (isGuestPreferredRoute(pathname)) {
    if (isAuthenticatedSession(session)) {
      return {
        allowed: false,
        redirectTo: "/dashboard",
        reason: "authenticated",
      };
    }

    return {
      allowed: true,
      reason: "guest_preferred_route",
    };
  }

  if (isPublicAuthRoute(pathname)) {
    return {
      allowed: true,
      reason: "public_auth_route",
    };
  }

  if (isPublicApiPartnerRoute(pathname)) {
    return {
      allowed: true,
      reason: "public_api_partner_route",
    };
  }

  if (
    isProtectedRoute(pathname) ||
    isProtectedApiPartnerRoute(pathname) ||
    isOnboardingRoute(pathname)
  ) {
    if (!isAuthenticatedSession(session)) {
      return {
        allowed: false,
        redirectTo: buildSignInRedirectPath(pathname, search),
        reason: "not_authenticated",
      };
    }

    if (!canSessionUsePublicApp(session)) {
      return {
        allowed: false,
        redirectTo: "/auth/unauthorized",
        reason: "invalid_public_role",
      };
    }

    if (isProtectedApiPartnerRoute(pathname)) {
      return {
        allowed: true,
        reason: "protected_api_partner_route",
      };
    }

    if (isOnboardingRoute(pathname)) {
      return {
        allowed: true,
        reason: "onboarding_route",
      };
    }

    return {
      allowed: true,
      reason: "protected_route",
    };
  }

  return {
    allowed: true,
    reason: "public_route",
  };
}

/**
 * Resolves the best authenticated destination using session and dashboard-state.
 */
export function resolveAuthenticatedDestination(
  session: AuthSession | null | undefined,
  dashboardState: DashboardState | null | undefined,
): AuthRedirectDecision {
  return resolvePostSignInDestination(session, dashboardState);
}

/**
 * Checks whether the current route should load backend dashboard-state.
 */
export function shouldLoadDashboardStateForRoute(pathname: string): boolean {
  return (
    pathname === "/dashboard" ||
    isProtectedRoute(pathname) ||
    isProtectedApiPartnerRoute(pathname) ||
    isOnboardingRoute(pathname)
  );
}
