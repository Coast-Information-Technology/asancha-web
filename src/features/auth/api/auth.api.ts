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
import { authApiGet, authApiPost } from "../../../lib/api/auth-fetch";

import { AUTH_API_ENDPOINTS } from "../constants/auth.constants";
import type {
  AuthSessionResult,
  ChangePasswordPayload,
  ChangePasswordResult,
  ForgotPasswordPayload,
  ForgotPasswordResult,
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
  return apiPost<SignUpResult, SignUpPayload>(
    AUTH_API_ENDPOINTS.signUp,
    payload,
  );
}

/**
 * Signs a public user into Asancha.
 *
 * Successful authentication is expected to establish or update secure
 * server-managed authentication cookies.
 */
async function signIn(payload: SignInPayload): Promise<SignInResult> {
  return apiPost<SignInResult, SignInPayload>(
    AUTH_API_ENDPOINTS.signIn,
    payload,
  );
}

/**
 * Retrieves the current authenticated public-user session.
 *
 * The shared authenticated API helper includes browser credentials and the
 * Asancha public-client request header.
 */
async function getSession(): Promise<AuthSessionResult> {
  return authApiGet<AuthSessionResult>(AUTH_API_ENDPOINTS.session);
}

/**
 * Refreshes the current server-managed authentication session.
 *
 * Refresh tokens must remain backend-controlled and must not be passed through
 * or exposed by this frontend function.
 */
async function refreshSession(): Promise<RefreshSessionResult> {
  return authApiPost<RefreshSessionResult>(AUTH_API_ENDPOINTS.refresh);
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
  return apiPost<ForgotPasswordResult, ForgotPasswordPayload>(
    AUTH_API_ENDPOINTS.forgotPassword,
    payload,
  );
}

/**
 * Completes a password reset using an opaque backend-issued token.
 */
async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResult> {
  return apiPost<ResetPasswordResult, ResetPasswordPayload>(
    AUTH_API_ENDPOINTS.resetPassword,
    payload,
  );
}

/**
 * Verifies a user's email address using an opaque backend-issued token.
 */
async function verifyEmail(
  payload: VerifyEmailPayload,
): Promise<VerifyEmailResult> {
  return apiPost<VerifyEmailResult, VerifyEmailPayload>(
    AUTH_API_ENDPOINTS.verifyEmail,
    payload,
  );
}

/**
 * Requests another email-verification message.
 *
 * The backend response must remain safe against account enumeration.
 */
async function resendVerification(
  payload: ResendVerificationPayload,
): Promise<ResendVerificationResult> {
  return apiPost<ResendVerificationResult, ResendVerificationPayload>(
    AUTH_API_ENDPOINTS.resendVerification,
    payload,
  );
}

/**
 * Changes the password for the currently authenticated user.
 */
async function changePassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResult> {
  return authApiPost<ChangePasswordResult, ChangePasswordPayload>(
    AUTH_API_ENDPOINTS.changePassword,
    payload,
  );
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
  startGoogleAuth,
} as const;
