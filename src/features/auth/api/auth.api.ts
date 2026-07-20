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
import { getRefreshToken, setAuthTokens } from "../lib/auth-token-store";

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

    return `${AUTH_PAGE_ROUTES.verifyEmail}?${searchParams.toString()}`;
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

/**
 * Signs a public user into Asancha.
 *
 * Successful authentication is expected to establish or update secure
 * server-managed authentication cookies.
 */
async function signIn(payload: SignInPayload): Promise<SignInResult> {
  const result = await apiPost<SignInResult | BackendSignInResult, SignInPayload>(
    AUTH_API_ENDPOINTS.signIn,
    payload,
  );

  storeBackendAuthTokens(result);

  return normalizeSignInResult(result);
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
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return {
      session: {
        authenticated: false,
        user: null,
      },
    };
  }

  const result = await authApiPost<
    RefreshSessionResult | BackendRefreshResult,
    { refreshToken: string }
  >(AUTH_API_ENDPOINTS.refresh, { refreshToken });

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
  return authApiPost<SignOutResult>(AUTH_API_ENDPOINTS.signOut);
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
