// File: src/features/auth/constants/auth.constants.ts

/**
 * Purpose:
 * Defines stable authentication constants for the Asancha public/user frontend.
 *
 * Responsibilities:
 * - Defines ordinary public signup roles.
 * - Defines public-safe role labels and descriptions.
 * - Defines required account policy types.
 * - Defines authentication endpoint paths.
 * - Defines safe authentication messages and route paths.
 *
 * Security notes:
 * - Staff roles and guest must never appear as public signup choices.
 * - API partner access uses the controlled API partner application flow.
 * - These constants guide frontend UX only; backend validation remains final.
 */

import type {
  AccountPolicyType,
  ForbiddenPublicSignupRole,
  PublicAccountRole,
  PublicSignupRole,
} from "../types/auth.types";

/**
 * Approved ordinary public signup roles.
 */
export const PUBLIC_SIGNUP_ROLES = [
  "investor",
  "property_owner",
  "property_agent",
  "property_sourcer",
  "service_provider",
] as const satisfies readonly PublicSignupRole[];

/**
 * API partner role supported by the public app through a controlled flow.
 */
export const API_PARTNER_ROLE =
  "api_partner" as const satisfies PublicAccountRole;

/**
 * Every account role permitted to use asancha-web.
 */
export const PUBLIC_ACCOUNT_ROLES = [
  ...PUBLIC_SIGNUP_ROLES,
  API_PARTNER_ROLE,
] as const satisfies readonly PublicAccountRole[];

/**
 * Role values that must never pass through ordinary public signup.
 */
export const FORBIDDEN_PUBLIC_SIGNUP_ROLES = [
  "guest",
  "api_partner",
  "customer_care_rep",
  "admin",
  "super_admin",
] as const satisfies readonly ForbiddenPublicSignupRole[];

/**
 * Required account-level policies expected during ordinary signup.
 *
 * Policy versions are intentionally not defined here. The active version must
 * be supplied by the backend policy-requirements endpoint.
 */
export const REQUIRED_SIGNUP_POLICY_TYPES = [
  "terms_of_use",
  "privacy_policy",
  "platform_rules",
  "data_processing_consent",
] as const satisfies readonly AccountPolicyType[];

/**
 * Public role display information used by role-selection interfaces.
 */
export const PUBLIC_SIGNUP_ROLE_OPTIONS = [
  {
    value: "investor",
    label: "Buyer / Investor",
    description:
      "Find, compare, save, and manage property opportunities that match your criteria.",
    verificationNotice:
      "Verification and proof of funds may be required for sensitive deal actions.",
  },
  {
    value: "property_owner",
    label: "Property Owner",
    description:
      "Submit and manage property that you own or are authorised to control.",
    verificationNotice:
      "Ownership and identity documents may be required before publication.",
  },
  {
    value: "property_agent",
    label: "Property Agent",
    description:
      "Manage property inventory on behalf of owners, vendors, landlords, or developers.",
    verificationNotice:
      "Company and authority-to-represent checks may be required.",
  },
  {
    value: "property_sourcer",
    label: "Property Sourcer",
    description:
      "Submit and manage investment-focused property opportunities for buyers.",
    verificationNotice:
      "Identity, business, compliance, and listing-standard checks may apply.",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    description:
      "Offer approved legal, finance, survey, inspection, refurbishment, or related services.",
    verificationNotice: "Professional or company credentials may be required.",
  },
] as const satisfies ReadonlyArray<{
  value: PublicSignupRole;
  label: string;
  description: string;
  verificationNotice: string;
}>;

/**
 * Public-facing authentication routes.
 */
export const AUTH_PAGE_ROUTES = {
  signUp: "/auth/sign-up",
  signIn: "/auth/sign-in",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  emailVerify: "/auth/email-verify",
  google: "/auth/google",
  googleCallback: "/auth/google/callback",
  suspended: "/auth/suspended",
  unauthorized: "/auth/unauthorized",
  onboarding: "/onboarding",
  dashboard: "/dashboard",
  apiPartnerApply: "/api-partner/apply",
} as const;

/**
 * Backend authentication endpoint paths.
 *
 * These paths are relative to the configured API base URL and must not contain
 * a hardcoded production hostname.
 */
export const AUTH_API_ENDPOINTS = {
  signupPolicies: "/policies/signup",
  signUp: "/auth/register",
  signIn: "/auth/login",
  signOut: "/auth/logout",
  refresh: "/auth/refresh",
  session: "/me",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  verifyEmail: "/auth/verify-email",
  resendVerification: "/auth/resend-verification",
  changePassword: "/auth/change-password",
  googleStart: "/auth/google",
} as const;

/**
 * Minimum client-side password requirements.
 *
 * Backend password validation remains authoritative.
 */
export const AUTH_PASSWORD_RULES = {
  minimumLength: 12,
  maximumLength: 128,
  requireLowercase: true,
  requireUppercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
} as const;

/**
 * Safe messages suitable for public authentication UI.
 */
export const AUTH_SAFE_MESSAGES = {
  genericError:
    "We could not complete that request. Please check your details and try again.",
  sessionError: "We could not confirm your session. Please sign in again.",
  invalidCredentials: "The email address or password is incorrect.",
  accountCreated:
    "Your account has been created. Check your email to continue.",
  forgotPasswordAccepted:
    "If this email belongs to an eligible account, password reset instructions will be sent.",
  resendVerificationAccepted:
    "If the account is eligible, a new verification message will be sent.",
  signedOut: "You have been signed out.",
  invalidRole: "Please choose a valid account type to continue.",
  staffSignupRejected:
    "This account type cannot be created from public signup.",
  missingPolicies:
    "Please accept the required policies to create your account.",
  apiPartnerSignupRejected:
    "API partner access uses a separate application process.",
} as const;

/**
 * Time before an already-loaded browser session is considered stale.
 *
 * This is only a frontend refetch interval. It does not control authentication
 * token expiry.
 */
export const AUTH_SESSION_STALE_TIME_MS = 60_000;

/**
 * Determines whether an unknown value is an ordinary public signup role.
 */
export function isPublicSignupRole(value: unknown): value is PublicSignupRole {
  return (
    typeof value === "string" &&
    (PUBLIC_SIGNUP_ROLES as readonly string[]).includes(value)
  );
}

/**
 * Determines whether an unknown value is a supported public account role.
 */
export function isPublicAccountRole(
  value: unknown,
): value is PublicAccountRole {
  return (
    typeof value === "string" &&
    (PUBLIC_ACCOUNT_ROLES as readonly string[]).includes(value)
  );
}

/**
 * Returns the public label for an ordinary public signup role.
 */
export function getPublicSignupRoleLabel(role: PublicSignupRole): string {
  return (
    PUBLIC_SIGNUP_ROLE_OPTIONS.find((option) => option.value === role)?.label ??
    role
  );
}
