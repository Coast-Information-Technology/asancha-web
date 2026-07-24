// File: src/lib/auth/role-guards.ts

/**
 * Asancha Public Role Guards
 *
 * Purpose:
 * Defines public/user role constants and role helper functions for
 * Asancha Web Public.
 *
 * Main responsibilities:
 * - Keep ordinary signup roles limited to approved public user roles
 * - Keep API partner outside ordinary public signup
 * - Prevent guest from being treated as a registered user role
 * - Provide dashboard and onboarding path helpers for public profiles
 *
 * Important Asancha Web Public rule:
 * This file must not model admin/staff permissions.
 * Admin/staff access belongs outside asancha-web.
 *
 * Security note:
 * These helpers support frontend guidance only.
 * Backend authentication, authorization, account status, policy checks,
 * onboarding checks, verification checks, payment checks, API partner
 * approval, and resource permissions remain the final enforcement layer.
 */

export const PUBLIC_SIGNUP_ROLES = [
  "investor",
  "property_owner",
  "property_agent",
  "property_sourcer",
  "service_provider",
] as const;

export const API_PARTNER_ROLE = "api_partner" as const;

export const PUBLIC_ACCOUNT_ROLES = [
  ...PUBLIC_SIGNUP_ROLES,
  API_PARTNER_ROLE,
] as const;

export const BUSINESS_PROFILE_TYPES = PUBLIC_ACCOUNT_ROLES;

export const FORBIDDEN_ORDINARY_SIGNUP_ROLE_VALUES = [
  "guest",
  "api_partner",
  "admin",
  "super_admin",
  "customer_care_rep",
] as const;

export type PublicSignupRole = (typeof PUBLIC_SIGNUP_ROLES)[number];

export type ApiPartnerRole = typeof API_PARTNER_ROLE;

export type PublicAccountRole = (typeof PUBLIC_ACCOUNT_ROLES)[number];

export type BusinessProfileType = (typeof BUSINESS_PROFILE_TYPES)[number];

export type StandardDashboardProfileType = Exclude<
  BusinessProfileType,
  ApiPartnerRole
>;

export const ROLE_LABELS: Record<BusinessProfileType, string> = {
  investor: "Buyer / Investor",
  property_owner: "Property Owner",
  property_agent: "Property Agent",
  property_sourcer: "Property Sourcer",
  service_provider: "Service Provider",
  api_partner: "API Partner",
};

export const DASHBOARD_PATH_BY_PROFILE_TYPE: Record<
  BusinessProfileType,
  string
> = {
  investor: "/dashboard/investor",
  property_owner: "/dashboard/property-owner",
  property_agent: "/dashboard/property-agent",
  property_sourcer: "/dashboard/property-sourcer",
  service_provider: "/dashboard/service-provider",
  api_partner: "/api-partner/dashboard",
};

export const ONBOARDING_PATH_BY_PROFILE_TYPE: Record<
  BusinessProfileType,
  string
> = {
  investor: "/onboarding/investor",
  property_owner: "/onboarding/property-owner",
  property_agent: "/onboarding/property-agent",
  property_sourcer: "/onboarding/property-sourcer",
  service_provider: "/onboarding/service-provider",
  api_partner: "/api-partner/apply",
};

/**
 * Checks whether a value is one of the ordinary public signup roles.
 */
export function isPublicSignupRole(value: unknown): value is PublicSignupRole {
  return (
    typeof value === "string" &&
    PUBLIC_SIGNUP_ROLES.includes(value as PublicSignupRole)
  );
}

/**
 * Checks whether a value is the controlled API partner role.
 */
export function isApiPartnerRole(value: unknown): value is ApiPartnerRole {
  return value === API_PARTNER_ROLE;
}

/**
 * Checks whether a value is a public account role.
 *
 * API partner is included here because an approved API partner can exist
 * as a public-side account/profile context, but it must not be selected
 * through ordinary public signup.
 */
export function isPublicAccountRole(
  value: unknown,
): value is PublicAccountRole {
  return (
    typeof value === "string" &&
    PUBLIC_ACCOUNT_ROLES.includes(value as PublicAccountRole)
  );
}

/**
 * Checks whether a value is a valid public business profile type.
 */
export function isBusinessProfileType(
  value: unknown,
): value is BusinessProfileType {
  return (
    typeof value === "string" &&
    BUSINESS_PROFILE_TYPES.includes(value as BusinessProfileType)
  );
}

/**
 * Checks whether a value is forbidden in ordinary public signup.
 */
export function isForbiddenOrdinarySignupRoleValue(value: unknown): boolean {
  return (
    typeof value === "string" &&
    FORBIDDEN_ORDINARY_SIGNUP_ROLE_VALUES.includes(
      value as (typeof FORBIDDEN_ORDINARY_SIGNUP_ROLE_VALUES)[number],
    )
  );
}

/**
 * Checks whether a role can be selected in ordinary public signup.
 */
export function canUseOrdinaryPublicSignup(
  role: unknown,
): role is PublicSignupRole {
  return isPublicSignupRole(role);
}

/**
 * Checks whether a role must be rejected from ordinary public signup.
 */
export function mustRejectOrdinaryPublicSignup(role: unknown): boolean {
  return !isPublicSignupRole(role) || isForbiddenOrdinarySignupRoleValue(role);
}

/**
 * Checks whether a role can use the Asancha Web Public app experience.
 */
export function canUsePublicApp(role: unknown): role is PublicAccountRole {
  return isPublicAccountRole(role);
}

/**
 * Returns the display label for a public business profile type.
 */
export function getRoleLabel(profileType: BusinessProfileType): string {
  return ROLE_LABELS[profileType];
}

/**
 * Returns the dashboard path for a public business profile type.
 */
export function getDashboardPathForBusinessProfile(
  profileType: BusinessProfileType,
): string {
  return DASHBOARD_PATH_BY_PROFILE_TYPE[profileType];
}

/**
 * Returns the onboarding path for a public business profile type.
 */
export function getOnboardingPathForBusinessProfile(
  profileType: BusinessProfileType,
): string {
  return ONBOARDING_PATH_BY_PROFILE_TYPE[profileType];
}

/**
 * Checks whether a profile type maps to a standard /dashboard/[role] route.
 */
export function isStandardDashboardProfileType(
  profileType: BusinessProfileType,
): profileType is StandardDashboardProfileType {
  return profileType !== API_PARTNER_ROLE;
}

/**
 * Checks whether the supplied pathname matches the active profile dashboard.
 */
export function canAccessProfileDashboardPath(
  activeProfileType: BusinessProfileType | null | undefined,
  pathname: string,
): boolean {
  if (!activeProfileType) {
    return false;
  }

  const expectedPath = getDashboardPathForBusinessProfile(activeProfileType);

  return pathname === expectedPath || pathname.startsWith(`${expectedPath}/`);
}
