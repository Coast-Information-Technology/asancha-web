// File: src/features/auth/api/auth.api.ts

/**
 * Asancha Public Authentication API
 *
 * Purpose:
 * Provides typed API functions for authentication and account-access
 * operations in the Asancha public/user frontend.
 *
 * Responsibilities:
 * - Retrieve active signup policy requirements.
 * - Register ordinary public users.
 * - Sign public users in and out.
 * - Retrieve and refresh authenticated sessions.
 * - Support password reset and email verification.
 * - Start the controlled Google authentication flow.
 *
 * Important security notes:
 * - This module must not store access tokens or refresh tokens in localStorage.
 * - Authentication should use secure server-managed cookies.
 * - Passwords, verification tokens, and password-reset tokens must not be logged.
 * - Guest, API partner, and staff roles must not pass through ordinary signup.
 * - Frontend role and route checks are UX guidance only.
 * - Backend authentication, authorization, account-status, policy, profile,
 *   verification, payment, and permission checks remain final.
 */

import { apiGet, apiPost } from "../../../lib/api/api-client";
import type { AsanchaApiResponse } from "../../../lib/api/api-response";
import { authApiGet, authApiPost } from "../../../lib/api/auth-fetch";
import { setAuthTokens } from "@/src/features/auth/lib/auth-token-store";

import {
  AUTH_API_ENDPOINTS,
  AUTH_PAGE_ROUTES,
} from "../constants/auth.constants";
import type {
  AuthSessionResult,
  AuthUser,
  ChangeEmailPayload,
  ChangeEmailResult,
  ChangePasswordPayload,
  ChangePasswordResult,
  ConfirmEmailChangePayload,
  ConfirmEmailChangeResult,
  EmailVerificationStatus,
  OnboardingStatus,
  ForgotPasswordPayload,
  ForgotPasswordResult,
  PublicAccountRole,
  PublicSignupRole,
  RefreshSessionResult,
  ResendVerificationPayload,
  ResendVerificationResult,
  ResetPasswordPayload,
  ResetPasswordResult,
  SignInPayload,
  SignInResult,
  SignOutResult,
  SignUpPayload,
  SignUpResult,
  SignupPolicyRequirement,
  StartGoogleAuthPayload,
  StartGoogleAuthResult,
  VerifyEmailPayload,
  VerifyEmailResult,
} from "../types/auth.types";
import {
  getDashboardPathForBusinessProfile,
  isBusinessProfileType,
  isPublicAccountRole,
} from "../../../lib/auth/role-guards";

interface BackendSignInUser {
  publicId: string;
  email: string;
  role: PublicAccountRole;
  isVerified: boolean;
  emailVerifiedAt?: string | null;
  onboardingStatus: OnboardingStatus;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendSignInResult {
  user: BackendSignInUser;
  accessToken?: string;
  accessExpiresAt?: string;
  jti?: string;
  refreshToken?: string;
  refreshExpiresAt?: string;
  sessionId?: string;
}

interface BackendSignUpUser {
  publicId: string;
  email: string;
  role: PublicSignupRole;
  isVerified: boolean;
  onboardingStatus: OnboardingStatus;
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BackendSignUpResult {
  user: BackendSignUpUser;
}

interface BackendSessionResult {
  user: BackendSignInUser;
}

interface BackendRefreshResult {
  user?: BackendSignInUser;
  accessToken?: string;
  accessExpiresAt?: string;
  jti?: string;
  refreshToken?: string;
  refreshExpiresAt?: string;
  sessionId?: string;
}

interface BackendGeneralProfileSummary {
  profileCompletionStatus: "not_started" | "in_progress" | "completed";
  activeBusinessProfileType: PublicAccountRole | null;
}

interface BackendActiveBusinessProfileSummary {
  activeBusinessProfile: {
    profileType: PublicAccountRole;
  } | null;
}

interface BackendOnboardingStartResult {
  publicId: string;
  profileType: PublicAccountRole;
  businessProfileType?: PublicAccountRole;
  status: OnboardingStatus;
  verificationStatus: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

const INTERNAL_AUTH_API_ENDPOINTS = {
  signIn: "/api/auth/login",
  signOut: "/api/auth/logout",
  refresh: "/api/auth/refresh",
} as const;

/**
 * Creates a URL query string from defined string values.
 *
 * Undefined and empty values are excluded so that authentication URLs do not
 * contain unnecessary parameters.
 */
function createQueryString(
  values: Readonly<Record<string, string | undefined>>,
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value.trim().length > 0) {
      searchParams.set(key, value);
    }
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `?${queryString}` : "";
}

async function internalAuthPost<TResponse, TBody>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const responseBody = (await response.json().catch(() => null)) as
    | AsanchaApiResponse<TResponse>
    | null;

  if (!response.ok || !responseBody?.success) {
    throw new Error(
      responseBody?.error?.message ||
        responseBody?.message ||
        "Authentication request failed.",
    );
  }

  return responseBody.data;
}

/**
 * Retrieves the active, versioned account-level policies required for an
 * ordinary public signup role.
 *
 * Policy versions must come from the backend. They must not be hardcoded in
 * the frontend because policy acceptance must remain versioned and traceable.
 */
async function getSignupPolicies(
  selectedRole: PublicSignupRole,
): Promise<SignupPolicyRequirement[]> {
  const queryString = createQueryString({
    selectedRole,
    source: "signup",
  });

  return apiGet<SignupPolicyRequirement[]>(
    `${AUTH_API_ENDPOINTS.signupPolicies}${queryString}`,
  );
}

/**
 * Creates an ordinary public-user account.
 *
 * Allowed roles:
 * - investor
 * - property_owner
 * - property_agent
 * - property_sourcer
 * - service_provider
 *
 * API partners must use the separate controlled application flow.
 * Staff accounts must not be created through this endpoint.
 */
async function signUp(payload: SignUpPayload): Promise<SignUpResult> {
  const result = await apiPost<SignUpResult | BackendSignUpResult, SignUpPayload>(
    AUTH_API_ENDPOINTS.signUp,
    payload,
  );

  if ("userPublicId" in result) {
    return result;
  }

  return {
    userPublicId: result.user.publicId,
    email: result.user.email,
    role: result.user.role,
    emailVerificationStatus: result.user.isVerified
      ? "verified"
      : "unverified",
    nextAction: "verify_email",
    verificationEmailSent: true,
  };
}

function isFrontendSignInResult(
  result: SignInResult | BackendSignInResult,
): result is SignInResult {
  return "session" in result && "nextPath" in result;
}

function isFrontendSessionResult(
  result: AuthSessionResult | BackendSessionResult,
): result is AuthSessionResult {
  return "authenticated" in result && "user" in result;
}

function isRefreshSessionResult(
  result: RefreshSessionResult | BackendRefreshResult,
): result is RefreshSessionResult {
  return "session" in result;
}

function getAccountStatus(user: BackendSignInUser): AuthUser["accountStatus"] {
  if (user.isSuspended) {
    return "suspended";
  }

  if (!user.isActive) {
    return "deactivated";
  }

  return "active";
}

function getEmailVerificationStatus(
  user: BackendSignInUser,
): EmailVerificationStatus {
  return user.isVerified ? "verified" : "unverified";
}

function getPostSignInPath(user: BackendSignInUser): string {
  if (user.isSuspended) {
    return "/auth/suspended";
  }

  if (!isPublicAccountRole(user.role)) {
    return "/auth/unauthorized";
  }

  if (!user.isVerified) {
    const searchParams = new URLSearchParams({ email: user.email });

    return `${AUTH_PAGE_ROUTES.resendVerification}?${searchParams.toString()}`;
  }

  if (user.role === "api_partner") {
    return "/api-partner/dashboard";
  }

  return getDashboardPathForBusinessProfile(user.role);
}

function normalizeVerifyEmailResult(
  envelope: AsanchaApiResponse<VerifyEmailResult | null>,
): VerifyEmailResult {
  const result = envelope.data;

  return {
    verified: true,
    userPublicId: result?.userPublicId ?? "",
    emailVerificationStatus: "verified",
    nextPath: AUTH_PAGE_ROUTES.signIn,
  };
}

function mapBackendSignInUser(user: BackendSignInUser): AuthUser {
  const emailVerificationStatus = getEmailVerificationStatus(user);

  return {
    userPublicId: user.publicId,
    email: user.email,
    displayName: null,
    firstName: null,
    lastName: null,
    accountStatus: getAccountStatus(user),
    emailVerificationStatus,
    authProvider: "local",
    activeBusinessProfile: {
      profilePublicId: user.publicId,
      profileType: user.role,
      displayName: user.email,
      onboardingStatus: user.onboardingStatus,
      verificationStatus:
        emailVerificationStatus === "verified" ? "approved" : "pending",
      isActive: user.isActive && !user.isSuspended,
    },
    availableBusinessProfiles: [
      {
        profilePublicId: user.publicId,
        profileType: user.role,
        displayName: user.email,
        onboardingStatus: user.onboardingStatus,
        verificationStatus:
          emailVerificationStatus === "verified" ? "approved" : "pending",
        isActive: user.isActive && !user.isSuspended,
      },
    ],
  };
}

function normalizeSignInResult(
  result: SignInResult | BackendSignInResult,
): SignInResult {
  if (isFrontendSignInResult(result)) {
    return result;
  }

  return {
    session: {
      authenticated: true,
      user: mapBackendSignInUser(result.user),
    },
    nextPath: getPostSignInPath(result.user),
  };
}

function normalizeSessionResult(
  result: AuthSessionResult | BackendSessionResult,
): AuthSessionResult {
  if (isFrontendSessionResult(result)) {
    return result;
  }

  return {
    authenticated: true,
    user: mapBackendSignInUser(result.user),
  };
}

function normalizeRefreshResult(
  result: RefreshSessionResult | BackendRefreshResult,
): RefreshSessionResult {
  if (isRefreshSessionResult(result)) {
    return result;
  }

  if (result.user) {
    return {
      session: {
        authenticated: true,
        user: mapBackendSignInUser(result.user),
      },
    };
  }

  return {
    session: {
      authenticated: false,
      user: null,
    },
  };
}

function storeBackendAuthTokens(
  result: SignInResult | RefreshSessionResult | BackendSignInResult | BackendRefreshResult,
) {
  if (!("accessToken" in result || "refreshToken" in result)) {
    return;
  }

  setAuthTokens({
    accessToken: result.accessToken ?? null,
    accessExpiresAt: result.accessExpiresAt ?? null,
    refreshToken: result.refreshToken ?? null,
    refreshExpiresAt: result.refreshExpiresAt ?? null,
    sessionId: result.sessionId ?? null,
  });
}

function getBearerHeaders(accessToken: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

function getDashboardPathForProfileType(
  profileType: PublicAccountRole | null | undefined,
): string | null {
  if (!profileType || !isBusinessProfileType(profileType)) {
    return null;
  }

  return getDashboardPathForBusinessProfile(profileType);
}

async function startRoleOnboarding(
  profileType: PublicAccountRole,
  accessToken: string,
): Promise<BackendOnboardingStartResult | null> {
  try {
    return await authApiPost<
      BackendOnboardingStartResult,
      { profileType: PublicAccountRole }
    >(
      "/onboarding/start",
      { profileType },
      {
        headers: getBearerHeaders(accessToken),
      },
    );
  } catch {
    return null;
  }
}

async function resolveBackendPostSignInPath(
  result: BackendSignInResult,
): Promise<string> {
  const fallbackPath = getPostSignInPath(result.user);

  if (
    !result.accessToken ||
    result.user.isSuspended ||
    !isPublicAccountRole(result.user.role) ||
    !result.user.isVerified
  ) {
    return fallbackPath;
  }

  if (result.user.role === "api_partner") {
    return "/api-partner/dashboard";
  }

  try {
    await startRoleOnboarding(
      result.user.role,
      result.accessToken,
    );

    const generalProfile =
      await authApiGet<BackendGeneralProfileSummary>(
        "/profiles/me/general",
        {
          headers: getBearerHeaders(result.accessToken),
        },
      );

    if (
      generalProfile.profileCompletionStatus !== "completed"
    ) {
      return "/onboarding/general-profile";
    }

    const activeProfile =
      await authApiGet<BackendActiveBusinessProfileSummary>(
        "/profiles/me/active-business-profile",
        {
          headers: getBearerHeaders(result.accessToken),
        },
      ).catch(() => null);

    const activeProfileDashboardPath = getDashboardPathForProfileType(
      activeProfile?.activeBusinessProfile?.profileType,
    );

    if (activeProfileDashboardPath) {
      return activeProfileDashboardPath;
    }

    const generalProfileDashboardPath = getDashboardPathForProfileType(
      generalProfile.activeBusinessProfileType,
    );

    if (generalProfileDashboardPath) {
      return generalProfileDashboardPath;
    }

    return fallbackPath;
  } catch {
    return fallbackPath;
  }
}

/**
 * Signs a public user into Asancha.
 *
 * Successful authentication is expected to establish or update secure
 * server-managed authentication cookies.
 */
async function signIn(payload: SignInPayload): Promise<SignInResult> {
  const result = await internalAuthPost<
    SignInResult | BackendSignInResult,
    SignInPayload
  >(
    INTERNAL_AUTH_API_ENDPOINTS.signIn,
    payload,
  );

  storeBackendAuthTokens(result);

  const normalizedResult = normalizeSignInResult(result);

  if (isFrontendSignInResult(result)) {
    return normalizedResult;
  }

  return {
    ...normalizedResult,
    nextPath: await resolveBackendPostSignInPath(result),
  };
}

/**
 * Retrieves the current authenticated public-user session.
 *
 * The shared authenticated API helper includes browser credentials and the
 * Asancha public-client request header.
 */
async function getSession(): Promise<AuthSessionResult> {
  const result = await authApiGet<AuthSessionResult | BackendSessionResult>(
    AUTH_API_ENDPOINTS.session,
  );

  return normalizeSessionResult(result);
}

/**
 * Refreshes the current server-managed authentication session.
 *
 * Refresh tokens must remain backend-controlled and must not be passed through
 * or exposed by this frontend function.
 */
async function refreshSession(): Promise<RefreshSessionResult> {
  const result = await internalAuthPost<
    RefreshSessionResult | BackendRefreshResult,
    null
  >(INTERNAL_AUTH_API_ENDPOINTS.refresh, null);

  storeBackendAuthTokens(result);

  const refreshResult = normalizeRefreshResult(result);

  if (!refreshResult.session.authenticated) {
    return {
      session: await getSession(),
    };
  }

  return refreshResult;
}

/**
 * Signs the current user out.
 *
 * The backend should invalidate the current refresh/session state and clear
 * the applicable authentication cookies.
 */
async function signOut(): Promise<SignOutResult> {
  return internalAuthPost<SignOutResult, null>(
    INTERNAL_AUTH_API_ENDPOINTS.signOut,
    null,
  );
}

/**
 * Requests password-reset instructions.
 *
 * The backend response must remain generic so that the public interface does
 * not reveal whether an email address belongs to an account.
 */
async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResult> {
  const envelope = await apiPost<
    AsanchaApiResponse<ForgotPasswordResult | null>,
    ForgotPasswordPayload
  >(
    AUTH_API_ENDPOINTS.forgotPassword,
    payload,
    { skipEnvelope: true },
  );

  return {
    accepted: true,
    message: envelope.data?.message || envelope.message,
  };
}

/**
 * Completes a password reset using an opaque backend-issued token.
 */
async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResult> {
  const envelope = await apiPost<
    AsanchaApiResponse<ResetPasswordResult | null>,
    ResetPasswordPayload
  >(
    AUTH_API_ENDPOINTS.resetPassword,
    payload,
    { skipEnvelope: true },
  );

  return envelope.data ?? { passwordReset: true };
}

/**
 * Verifies a user's email address using an opaque backend-issued token.
 */
async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResult> {
  const envelope = await apiPost<
    AsanchaApiResponse<VerifyEmailResult | null>,
    VerifyEmailPayload
  >(
    AUTH_API_ENDPOINTS.verifyEmail,
    payload,
    { skipEnvelope: true },
  );

  return normalizeVerifyEmailResult(envelope);
}

/**
 * Requests another email-verification message.
 *
 * The backend response must remain safe against account enumeration.
 */
async function resendVerification(
  payload: ResendVerificationPayload,
): Promise<ResendVerificationResult> {
  const envelope = await apiPost<
    AsanchaApiResponse<ResendVerificationResult | null>,
    ResendVerificationPayload
  >(
    AUTH_API_ENDPOINTS.resendVerification,
    payload,
    { skipEnvelope: true },
  );

  return {
    accepted: true,
    message: envelope.data?.message || envelope.message,
  };
}

/**
 * Changes the password for the currently authenticated user.
 */
async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResult> {
  const envelope = await authApiPost<
    AsanchaApiResponse<ChangePasswordResult | null>,
    ChangePasswordPayload
  >(
    AUTH_API_ENDPOINTS.changePassword,
    payload,
    { skipEnvelope: true },
  );

  return envelope.data ?? { passwordChanged: true };
}

async function changeEmail(
  payload: ChangeEmailPayload,
): Promise<ChangeEmailResult> {
  const envelope = await authApiPost<
    AsanchaApiResponse<ChangeEmailResult | null>,
    ChangeEmailPayload
  >(
    AUTH_API_ENDPOINTS.changeEmail,
    payload,
    { skipEnvelope: true },
  );

  return {
    accepted: true,
    message: envelope.data?.message || envelope.message,
  };
}

async function confirmEmailChange(
  payload: ConfirmEmailChangePayload,
): Promise<ConfirmEmailChangeResult> {
  const envelope = await apiPost<
    AsanchaApiResponse<ConfirmEmailChangeResult | null>,
    ConfirmEmailChangePayload
  >(
    AUTH_API_ENDPOINTS.confirmEmailChange,
    payload,
    { skipEnvelope: true },
  );

  return envelope.data ?? {
    emailChanged: true,
    message: envelope.message,
  };
}

/**
 * Retrieves the backend-generated Google authorization URL.
 *
 * For first-time Google signup, selectedRole must be one of the approved
 * ordinary public signup roles. The backend must securely preserve and
 * validate that role intent through the OAuth state.
 *
 * OAuth client secrets, provider tokens, callback internals, and state secrets
 * must remain backend-only.
 */
async function startGoogleAuth(
  payload: StartGoogleAuthPayload = {},
): Promise<StartGoogleAuthResult> {
  const queryString = createQueryString({
    selectedRole: payload.selectedRole,
    returnTo: payload.returnTo,
  });

  return apiGet<StartGoogleAuthResult>(
    `${AUTH_API_ENDPOINTS.googleStart}${queryString}`,
  );
}

/**
 * Public authentication API surface.
 *
 * Exporting one stable object keeps feature consumers consistent while the
 * implementation continues to use the approved shared API helpers.
 */
export const authApi = {
  getSignupPolicies,
  signUp,
  signIn,
  getSession,
  refreshSession,
  signOut,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  changePassword,
  changeEmail,
  confirmEmailChange,
  startGoogleAuth,
} as const;
