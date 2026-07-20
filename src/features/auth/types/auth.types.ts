// File: src/features/auth/types/auth.types.ts

/**
 * Purpose:
 * Defines the public/user frontend authentication domain types.
 *
 * Responsibilities:
 * - Defines the public account roles supported by asancha-web.
 * - Defines signup, sign-in, password, verification, and session payloads.
 * - Defines safe user and business-profile summaries returned to the browser.
 * - Keeps private backend identifiers, hashes, tokens, and internal notes out of
 *   frontend-facing authentication contracts.
 *
 * Security notes:
 * - MongoDB ObjectIds must never be included in these public frontend types.
 * - Passwords are request-only values and must never be persisted by the feature.
 * - Access tokens, refresh tokens, token hashes, and provider payloads must not
 *   be exposed through these types.
 * - The backend remains the final authority for authentication, account status,
 *   policy acceptance, onboarding, verification, and permissions.
 */

/**
 * Roles that may use the public/user Asancha application.
 *
 * API partners belong to the public application but must not use ordinary
 * public signup.
 */
export type PublicAccountRole =
  | "investor"
  | "property_owner"
  | "property_agent"
  | "property_sourcer"
  | "service_provider"
  | "api_partner";

/**
 * Roles permitted in the ordinary /auth/sign-up flow.
 */
export type PublicSignupRole = Exclude<PublicAccountRole, "api_partner">;

/**
 * Internal staff roles that must never be accepted by public signup.
 */
export type StaffRole = "customer_care_rep" | "admin" | "super_admin";

/**
 * Role-like values that must be rejected from ordinary public signup.
 */
export type ForbiddenPublicSignupRole = "guest" | "api_partner" | StaffRole;

/**
 * Authentication providers supported by the public application.
 */
export type AuthProvider = "local" | "google";

/**
 * Public account lifecycle statuses.
 *
 * The backend may introduce additional statuses later. UI code should avoid
 * assuming that an unrecognised value means an active account.
 */
export type AccountStatus =
  "pending" | "active" | "suspended" | "locked" | "deactivated";

/**
 * Email verification statuses used by authentication routing.
 */
export type EmailVerificationStatus = "unverified" | "pending" | "verified";

/**
 * General and role-specific onboarding statuses.
 */
export type OnboardingStatus =
  "not_started" | "in_progress" | "completed" | "abandoned";

/**
 * Verification statuses used for business profiles.
 */
export type VerificationStatus =
  "pending" | "approved" | "rejected" | "on_hold";

/**
 * Policy types accepted during account creation.
 */
export type AccountPolicyType =
  | "terms_of_use"
  | "privacy_policy"
  | "platform_rules"
  | "data_processing_consent";

/**
 * Source of a policy acceptance record.
 */
export type PolicyAcceptanceSource =
  | "signup"
  | "onboarding"
  | "profile_creation"
  | "api_application"
  | "admin_action"
  | "policy_reacceptance";

/**
 * Versioned policy requirement returned by the backend.
 */
export interface SignupPolicyRequirement {
  policyType: AccountPolicyType;
  policyVersion: string;
  title: string;
  description?: string;
  policyUrl: string;
  required: boolean;
}

/**
 * Versioned policy acceptance submitted during account creation.
 */
export interface PolicyAcceptanceInput {
  policyType: AccountPolicyType;
  policyVersion: string;
  source: "signup";
}

/**
 * Request body used by ordinary public account registration.
 */
export interface SignUpPayload {
  email: string;
  password: string;
  role: PublicSignupRole;
  acceptedPolicies: AccountPolicyType[];
}

/**
 * Safe response returned after public account registration.
 */
export interface SignUpResult {
  userPublicId: string;
  email: string;
  role: PublicSignupRole;
  emailVerificationStatus: EmailVerificationStatus;
  nextAction: "verify_email";
  verificationEmailSent: boolean;
}

/**
 * Request body used to authenticate a public account.
 */
export interface SignInPayload {
  email: string;
  password: string;
  rememberDevice?: boolean;
}

/**
 * A safe summary of one role-specific business profile.
 */
export interface AuthBusinessProfileSummary {
  profilePublicId: string;
  profileType: PublicAccountRole;
  displayName: string;
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus;
  isActive: boolean;
}

/**
 * Public-safe user identity returned to the browser.
 */
export interface AuthUser {
  userPublicId: string;
  email: string;
  displayName: string | null;
  firstName: string | null;
  lastName: string | null;
  accountStatus: AccountStatus;
  emailVerificationStatus: EmailVerificationStatus;
  authProvider: AuthProvider;
  activeBusinessProfile: AuthBusinessProfileSummary | null;
  availableBusinessProfiles: AuthBusinessProfileSummary[];
}

/**
 * Authenticated browser session state.
 *
 * Authentication cookies remain controlled by the server and are therefore
 * not represented here.
 */
export interface AuthSession {
  authenticated: true;
  user: AuthUser;
}

/**
 * Unauthenticated browser session state.
 */
export interface AnonymousAuthSession {
  authenticated: false;
  user: null;
}

/**
 * Complete session response supported by the public frontend.
 */
export type AuthSessionResult = AuthSession | AnonymousAuthSession;

/**
 * Request body used to ask for password-reset instructions.
 */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Safe password-reset request result.
 *
 * The message must remain generic to prevent account enumeration.
 */
export interface ForgotPasswordResult {
  accepted: true;
  message: string;
}

/**
 * Request body used to complete a password reset.
 */
export interface ResetPasswordPayload {
  token: string;
  password: string;
}

/**
 * Successful password reset response.
 */
export interface ResetPasswordResult {
  passwordReset: true;
  signedOutOtherSessions?: boolean;
}

/**
 * Request used to verify a user's email address.
 *
 * The verification token must be treated as opaque.
 */
export interface VerifyEmailPayload {
  token: string;
  userPublicId?: string;
}

/**
 * Successful email verification response.
 */
export interface VerifyEmailResult {
  verified: true;
  userPublicId: string;
  emailVerificationStatus: "verified";
  nextPath: string;
}

/**
 * Request body used to resend an email-verification message.
 */
export interface ResendVerificationPayload {
  email?: string;
  userPublicId?: string;
}

/**
 * Safe result for a resend-verification request.
 */
export interface ResendVerificationResult {
  accepted: true;
  message: string;
}

/**
 * Request body used when changing an authenticated user's password.
 */
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Successful password-change result.
 */
export interface ChangePasswordResult {
  passwordChanged: true;
  signedOutOtherSessions?: boolean;
}

/**
 * Request body used to begin an authenticated email-address change.
 */
export interface ChangeEmailPayload {
  newEmail: string;
  password: string;
}

/**
 * Safe result for an email-address change request.
 */
export interface ChangeEmailResult {
  accepted: true;
  message: string;
}

/**
 * Request body used to confirm an email-address change.
 */
export interface ConfirmEmailChangePayload {
  token: string;
}

/**
 * Safe result for email-address change confirmation.
 */
export interface ConfirmEmailChangeResult {
  emailChanged: true;
  message: string;
}

/**
 * Request used to start Google authentication.
 *
 * The role is required for first-time ordinary public signup but may be absent
 * for returning users.
 */
export interface StartGoogleAuthPayload {
  selectedRole?: PublicSignupRole;
  returnTo?: string;
}

/**
 * Safe result containing the provider authorization URL.
 */
export interface StartGoogleAuthResult {
  authorizationUrl: string;
}

/**
 * Successful public sign-in result.
 */
export interface SignInResult {
  session: AuthSession;
  nextPath: string;
}

/**
 * Successful sign-out result.
 */
export interface SignOutResult {
  signedOut: true;
}

/**
 * Successful session-refresh result.
 */
export interface RefreshSessionResult {
  session: AuthSessionResult;
}

/**
 * Internal state exposed by useAuthSession.
 */
export interface AuthSessionState {
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "error";
  session: AuthSessionResult | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
}

/**
 * Actions exposed by useAuthSession.
 */
export interface AuthSessionActions {
  loadSession: () => Promise<AuthSessionResult>;
  refreshSession: () => Promise<AuthSessionResult>;
  signIn: (payload: SignInPayload) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

/**
 * Complete return type for useAuthSession.
 */
export type UseAuthSessionResult = AuthSessionState & AuthSessionActions;
