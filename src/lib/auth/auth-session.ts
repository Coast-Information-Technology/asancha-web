// File: src/lib/auth/auth-session.ts

/**
 * Asancha Public Auth Session Helpers
 *
 * Purpose:
 * Provides typed session, account, profile, and dashboard-state helpers
 * for Asancha Web Public.
 *
 * Main responsibilities:
 * - Define frontend-safe public session types
 * - Fetch current public user session from the backend
 * - Fetch backend dashboard-state
 * - Resolve safe post-login and onboarding destinations
 *
 * Important Asancha Web Public rule:
 * This file must not model admin/staff roles or permissions.
 * If a user role is not a valid public account role, the public app should
 * treat it as not allowed and route to the safe unauthorized screen.
 *
 * Security note:
 * These helpers do not replace backend enforcement.
 * The backend remains responsible for authentication, authorization,
 * account status, active business profile context, policy checks,
 * onboarding checks, verification checks, document checks, payment checks,
 * API partner approval, and resource permissions.
 */

import { API_ROUTES } from "../api/api-routes";
import { authApiGet } from "../api/auth-fetch";
import {
  BusinessProfileType,
  PublicAccountRole,
  canUsePublicApp,
  getDashboardPathForBusinessProfile,
  getOnboardingPathForBusinessProfile,
  isBusinessProfileType,
} from "./role-guards";

export type AccountStatus =
  "active" | "pending" | "suspended" | "locked" | "deactivated";

export type EmailVerificationStatus = "verified" | "unverified";

export type GeneralProfileStatus = "not_started" | "in_progress" | "completed";

export type OnboardingStatus =
  "not_started" | "in_progress" | "completed" | "abandoned";

export type VerificationStatus =
  | "not_started"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "on_hold"
  | "replacement_required";

export type PolicyAcceptanceStatus =
  "complete" | "missing_required" | "requires_reacceptance";

export type PaymentSummaryStatus =
  | "none"
  | "pending"
  | "submitted_for_review"
  | "approved"
  | "rejected"
  | "requires_action";

export interface AuthenticatedUserSummary {
  publicId: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: PublicAccountRole;
  accountStatus: AccountStatus;
  emailVerificationStatus: EmailVerificationStatus;
}

export interface BusinessProfileSummary {
  publicId: string;
  profileType: BusinessProfileType;
  displayName: string;
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus;
  isActive: boolean;
}

export interface LockedActionSummary {
  key: string;
  label: string;
  reason: string;
  nextStep?: string;
  responsibleParty?: "user" | "asancha" | "system";
}

export interface PendingActionSummary {
  key: string;
  label: string;
  description?: string;
  actionUrl?: string;
}

export interface NotificationSummary {
  unreadCount: number;
}

export interface RecommendationSummary {
  availableCount: number;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: AuthenticatedUserSummary | null;
}

export interface DashboardState {
  accountStatus: AccountStatus;
  emailVerificationStatus: EmailVerificationStatus;
  generalProfileStatus: GeneralProfileStatus;
  activeBusinessProfileType: BusinessProfileType | null;
  activeBusinessProfileStatus: VerificationStatus | null;
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus;
  policyAcceptanceStatus: PolicyAcceptanceStatus;
  paymentStatusSummary: PaymentSummaryStatus;
  lockedActions: LockedActionSummary[];
  unlockedActions: string[];
  pendingActions: PendingActionSummary[];
  availableBusinessProfiles: BusinessProfileSummary[];
  activeBusinessProfileSummary: BusinessProfileSummary | null;
  notificationSummary: NotificationSummary;
  recommendationSummary: RecommendationSummary;
}

export interface AuthRedirectDecision {
  shouldRedirect: boolean;
  destination: string;
  reason:
    | "not_authenticated"
    | "invalid_public_role"
    | "account_suspended"
    | "account_locked"
    | "email_unverified"
    | "general_profile_incomplete"
    | "onboarding_incomplete"
    | "missing_active_profile"
    | "ready";
}

const DEFAULT_DASHBOARD_DESTINATION = "/dashboard";
const SIGN_IN_DESTINATION = "/auth/sign-in";
const VERIFY_EMAIL_DESTINATION = "/auth/resend-verification";
const GENERAL_PROFILE_DESTINATION = "/onboarding/general-profile";
const ONBOARDING_DESTINATION = "/onboarding";
const SUSPENDED_DESTINATION = "/auth/suspended";
const LOCKED_DESTINATION = "/auth/suspended";
const UNAUTHORIZED_DESTINATION = "/auth/unauthorized";

/**
 * Creates an unauthenticated session object.
 */
export function createUnauthenticatedSession(): AuthSession {
  return {
    isAuthenticated: false,
    user: null,
  };
}

/**
 * Fetches the current authenticated public user session from the backend.
 */
export async function fetchAuthSession(): Promise<AuthSession> {
  const user = await authApiGet<AuthenticatedUserSummary>(API_ROUTES.auth.me);

  return {
    isAuthenticated: true,
    user,
  };
}

/**
 * Fetches the backend dashboard-state for the authenticated public user.
 */
export function fetchDashboardState(): Promise<DashboardState> {
  return authApiGet<DashboardState>(API_ROUTES.me.dashboardState);
}

/**
 * Checks whether a session contains an authenticated public user object.
 */
export function isAuthenticatedSession(
  session: AuthSession | null | undefined,
): session is AuthSession & { user: AuthenticatedUserSummary } {
  return Boolean(session?.isAuthenticated && session.user);
}

/**
 * Checks whether the session role is valid for Asancha Web Public.
 */
export function isPublicUserSession(
  session: AuthSession | null | undefined,
): boolean {
  if (!isAuthenticatedSession(session)) {
    return false;
  }

  return canUsePublicApp(session.user.role);
}

/**
 * Checks whether dashboard-state says the user has an active business profile.
 */
export function hasActiveBusinessProfile(
  dashboardState: DashboardState | null | undefined,
): boolean {
  return Boolean(
    dashboardState?.activeBusinessProfileType &&
    dashboardState.activeBusinessProfileSummary,
  );
}

/**
 * Resolves the incomplete onboarding destination from backend dashboard-state.
 */
function resolveIncompleteOnboardingDestination(
  dashboardState: DashboardState,
): string {
  const activeProfileType = dashboardState.activeBusinessProfileType;

  if (!activeProfileType || !isBusinessProfileType(activeProfileType)) {
    return ONBOARDING_DESTINATION;
  }

  return getOnboardingPathForBusinessProfile(activeProfileType);
}

/**
 * Resolves the dashboard destination from backend dashboard-state.
 */
export function resolveDashboardDestination(
  dashboardState: DashboardState,
): string {
  const activeProfileType = dashboardState.activeBusinessProfileType;

  if (!activeProfileType || !isBusinessProfileType(activeProfileType)) {
    return DEFAULT_DASHBOARD_DESTINATION;
  }

  return getDashboardPathForBusinessProfile(activeProfileType);
}

/**
 * Resolves the best destination after sign-in using session and dashboard-state.
 */
export function resolvePostSignInDestination(
  session: AuthSession | null | undefined,
  dashboardState: DashboardState | null | undefined,
): AuthRedirectDecision {
  if (!isAuthenticatedSession(session)) {
    return {
      shouldRedirect: true,
      destination: SIGN_IN_DESTINATION,
      reason: "not_authenticated",
    };
  }

  if (!canUsePublicApp(session.user.role)) {
    return {
      shouldRedirect: true,
      destination: UNAUTHORIZED_DESTINATION,
      reason: "invalid_public_role",
    };
  }

  if (session.user.accountStatus === "suspended") {
    return {
      shouldRedirect: true,
      destination: SUSPENDED_DESTINATION,
      reason: "account_suspended",
    };
  }

  if (session.user.accountStatus === "locked") {
    return {
      shouldRedirect: true,
      destination: LOCKED_DESTINATION,
      reason: "account_locked",
    };
  }

  if (session.user.emailVerificationStatus !== "verified") {
    return {
      shouldRedirect: true,
      destination: VERIFY_EMAIL_DESTINATION,
      reason: "email_unverified",
    };
  }

  if (!dashboardState) {
    return {
      shouldRedirect: true,
      destination: DEFAULT_DASHBOARD_DESTINATION,
      reason: "ready",
    };
  }

  if (dashboardState.generalProfileStatus !== "completed") {
    return {
      shouldRedirect: true,
      destination: GENERAL_PROFILE_DESTINATION,
      reason: "general_profile_incomplete",
    };
  }

  if (dashboardState.onboardingStatus !== "completed") {
    return {
      shouldRedirect: true,
      destination: resolveIncompleteOnboardingDestination(dashboardState),
      reason: "onboarding_incomplete",
    };
  }

  if (!hasActiveBusinessProfile(dashboardState)) {
    return {
      shouldRedirect: true,
      destination: ONBOARDING_DESTINATION,
      reason: "missing_active_profile",
    };
  }

  return {
    shouldRedirect: true,
    destination: resolveDashboardDestination(dashboardState),
    reason: "ready",
  };
}

/**
 * Checks whether the current session can use Asancha Web Public.
 */
export function canSessionUsePublicApp(
  session: AuthSession | null | undefined,
): boolean {
  return isPublicUserSession(session);
}
