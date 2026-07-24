// File: src/features/account/constants/account.constants.ts

/**
 * Asancha Account Constants
 *
 * Purpose:
 * Defines stable account routes, profile options, policy contexts,
 * dashboard paths, onboarding paths, and public-safe account messages.
 *
 * Responsibilities:
 * - Keep account endpoint paths in one place.
 * - Define allowed additional business-profile types.
 * - Define role labels and descriptions.
 * - Map profile types to policy contexts and frontend routes.
 * - Provide safe success and error messages.
 *
 * Security notes:
 * - Staff roles and guest must never be available as business-profile options.
 * - API partner profiles are handled through the separate controlled
 *   application flow.
 * - Constants guide frontend behaviour only; backend checks remain final.
 */

import type { BusinessProfileType, PolicyType } from "../types/account.types";

export const BUSINESS_PROFILE_TYPES = [
  "investor",
  "property_owner",
  "property_agent",
  "property_sourcer",
  "service_provider",
  "api_partner",
] as const satisfies readonly BusinessProfileType[];

export const STANDARD_BUSINESS_PROFILE_TYPES = [
  "investor",
  "property_owner",
  "property_agent",
  "property_sourcer",
  "service_provider",
] as const;

export const FORBIDDEN_BUSINESS_PROFILE_TYPES = [
  "guest",
  "admin",
  "customer_care_rep",
  "super_admin",
] as const;

export const ACCOUNT_API_ENDPOINTS = {
  account: "/me",
  security: "/me/security",
  sessions: "/me/sessions",

  session: (sessionPublicId: string): string =>
    `/me/sessions/${encodeURIComponent(sessionPublicId)}`,

  generalProfile: "/profiles/me/general",
  completeGeneralProfile: "/profiles/me/general/complete",
  businessProfiles: "/profiles/me/business-profiles",
  activeBusinessProfile: "/profiles/me/active-business-profile",
  switchBusinessProfile: "/profiles/me/active-business-profile",

  requiredPolicies: (context: string): string =>
    `/policies/required/${encodeURIComponent(context)}`,

  policyAcceptances: "/policy-acceptances/me",
  acceptPolicy: "/policy-acceptances",
} as const;

export const ACCOUNT_PAGE_ROUTES = {
  root: "/account",
  profile: "/account/profile",
  addBusinessProfile: "/account/business-profiles/add",
  businessProfile: (profilePublicId: string): string =>
    `/account/business-profiles/${encodeURIComponent(profilePublicId)}`,
  policies: "/account/policies",
  security: "/account/security",
  notifications: "/account/notifications",
  status: "/account/status",
  support: "/account/support",
} as const;

export const BUSINESS_PROFILE_OPTIONS = [
  {
    value: "investor",
    label: "Buyer / Investor",
    description:
      "Find, analyse, save, and manage property opportunities that match your criteria.",
    policyContext: "investor_profile",
  },
  {
    value: "property_owner",
    label: "Property Owner",
    description:
      "Submit and manage property that you own or are authorised to control.",
    policyContext: "property_owner_profile",
  },
  {
    value: "property_agent",
    label: "Property Agent",
    description:
      "Manage property inventory on behalf of owners, landlords, vendors, or developers.",
    policyContext: "property_agent_profile",
  },
  {
    value: "property_sourcer",
    label: "Property Sourcer",
    description:
      "Submit and manage investment-focused property opportunities for buyers.",
    policyContext: "property_sourcer_profile",
  },
  {
    value: "service_provider",
    label: "Service Provider",
    description:
      "Provide approved legal, survey, finance, inspection, refurbishment, or related services.",
    policyContext: "service_provider_profile",
  },
] as const satisfies ReadonlyArray<{
  value: BusinessProfileType;
  label: string;
  description: string;
  policyContext: string;
}>;

export const PROFILE_POLICY_CONTEXTS = {
  investor: "investor_profile",
  property_owner: "property_owner_profile",
  property_agent: "property_agent_profile",
  property_sourcer: "property_sourcer_profile",
  service_provider: "service_provider_profile",
  api_partner: "api_partner_application",
} as const satisfies Record<BusinessProfileType, string>;

export const PROFILE_DASHBOARD_PATHS = {
  investor: "/dashboard/investor",
  property_owner: "/dashboard/property-owner",
  property_agent: "/dashboard/property-agent",
  property_sourcer: "/dashboard/property-sourcer",
  service_provider: "/dashboard/service-provider",
  api_partner: "/dashboard/api-partner",
} as const satisfies Record<BusinessProfileType, string>;

export const PROFILE_ONBOARDING_PATHS = {
  investor: "/onboarding/investor",
  property_owner: "/onboarding/property-owner",
  property_agent: "/onboarding/property-agent",
  property_sourcer: "/onboarding/property-sourcer",
  service_provider: "/onboarding/service-provider",
  api_partner: "/api-partner/apply",
} as const satisfies Record<BusinessProfileType, string>;

export const PROFILE_CREATION_POLICY_GUIDANCE = {
  investor: [] as PolicyType[],
  property_owner: [
    "property_submission_rules",
    "authority_declaration",
  ] as PolicyType[],
  property_agent: [
    "property_submission_rules",
    "authority_declaration",
  ] as PolicyType[],
  property_sourcer: [
    "listing_standards",
    "sourcer_compliance_declaration",
  ] as PolicyType[],
  service_provider: [] as PolicyType[],
  api_partner: [
    "api_acceptable_use_policy",
    "api_billing_terms",
    "data_processing_consent",
  ] as PolicyType[],
} as const satisfies Record<BusinessProfileType, readonly PolicyType[]>;

export const ACCOUNT_SAFE_MESSAGES = {
  genericError: "We could not complete that account request. Please try again.",
  loadError:
    "We could not load your account information. Please refresh the page.",
  profileSaveError:
    "We could not save your profile. Please review the information and try again.",
  profileSaved: "Your profile has been updated.",
  profileCompleted: "Your general profile has been completed.",
  policiesLoadError:
    "We could not load the required policies. Please try again.",
  policyAcceptanceError:
    "We could not record the required policy acceptance. Please try again.",
  duplicateProfile: "You already have an active profile of this type.",
  profileCreated:
    "Your new business profile has been created. Continue setup to complete onboarding.",
  profileCreationError:
    "We could not create that business profile. Please review the required information and try again.",
  profileSwitched: "Your active business profile has been changed.",
  profileSwitchError:
    "We could not switch to that profile. It may require additional setup or policy acceptance.",
  restrictedSwitch:
    "This profile cannot be used yet. Review its setup, policy, or account status.",
  sessionDeleteError: "We could not sign out that session. Please try again.",
  sessionDeleted: "The selected session has been signed out.",
} as const;

export function isBusinessProfileType(
  value: unknown,
): value is BusinessProfileType {
  return (
    typeof value === "string" &&
    (BUSINESS_PROFILE_TYPES as readonly string[]).includes(value)
  );
}

export function getBusinessProfileOption(profileType: BusinessProfileType) {
  return BUSINESS_PROFILE_OPTIONS.find(
    (option) => option.value === profileType,
  );
}

export function getBusinessProfileLabel(
  profileType: BusinessProfileType,
): string {
  if (profileType === "api_partner") {
    return "API Partner";
  }

  return getBusinessProfileOption(profileType)?.label ?? profileType;
}

export function getProfilePolicyContext(
  profileType: BusinessProfileType,
): string {
  return PROFILE_POLICY_CONTEXTS[profileType];
}

export function getProfileDashboardPath(
  profileType: BusinessProfileType,
): string {
  return PROFILE_DASHBOARD_PATHS[profileType];
}

export function getProfileOnboardingPath(
  profileType: BusinessProfileType,
): string {
  return PROFILE_ONBOARDING_PATHS[profileType];
}
