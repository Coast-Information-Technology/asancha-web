// File: src/features/onboarding/constants/onboarding.constants.ts

/**
 * Asancha Onboarding Constants
 *
 * Purpose:
 * Defines stable onboarding routes, steps, option lists, safe messages,
 * and initial investor onboarding values.
 *
 * Responsibilities:
 * - Keep onboarding endpoint paths in one place.
 * - Define approved onboarding target roles.
 * - Define investor onboarding steps and field options.
 * - Provide safe UI messages.
 * - Provide a complete initial investor onboarding state.
 *
 * Important security notes:
 * - These values guide frontend UX only.
 * - Backend validation and permission checks remain final.
 * - Verification approval must never be inferred from onboarding completion.
 */

import type {
  BmvInterestLevel,
  FundingMethod,
  InvestorAccountHolderType,
  InvestorCategory,
  InvestorExperienceLevel,
  InvestorGoal,
  InvestorOnboardingValues,
  InvestorPropertyType,
  InvestmentStrategy,
  OccupancyStatus,
  OnboardingStepKey,
  OnboardingTargetRole,
  PurchaseTimeline,
  RefurbLevel,
  StrategyBadge,
} from "../types/onboarding.types";

export const ONBOARDING_TARGET_ROLES = [
  "investor",
  "property_owner",
  "property_agent",
  "property_sourcer",
  "service_provider",
  "api_partner",
] as const satisfies readonly OnboardingTargetRole[];

export const ONBOARDING_API_ENDPOINTS = {
  current: "/onboarding/me",
  start: "/onboarding/start",
  dashboardState: "/me/dashboard-state",
  role: (targetRole: OnboardingTargetRole): string =>
    `/onboarding/${targetRole}`,
  submitRole: (targetRole: OnboardingTargetRole): string =>
    `/onboarding/${targetRole}/submit`,
  roleStatus: (targetRole: OnboardingTargetRole): string =>
    `/onboarding/${targetRole}/status`,
} as const;

export const ONBOARDING_PAGE_ROUTES = {
  root: "/onboarding",
  generalProfile: "/onboarding/general-profile",
  investor: "/onboarding/investor",
  propertyOwner: "/onboarding/property-owner",
  propertyAgent: "/onboarding/property-agent",
  propertySourcer: "/onboarding/property-sourcer",
  serviceProvider: "/onboarding/service-provider",
  apiPartner: "/onboarding/api-partner",
  status: "/onboarding/status",
  pendingVerification: "/onboarding/pending-verification",
  correctionRequired: "/onboarding/correction-required",
  investorDashboard: "/dashboard/investor",
} as const;

export const INVESTOR_ONBOARDING_STEPS = [
  {
    key: "investment_profile",
    number: 1,
    title: "Investment Profile",
    description:
      "Tell us about your experience, investment goals, and investor type.",
  },
  {
    key: "buying_criteria",
    number: 2,
    title: "Buying Criteria",
    description:
      "Choose the locations, property types, strategies, and budget that suit you.",
  },
  {
    key: "deal_preferences",
    number: 3,
    title: "Deal Preferences",
    description:
      "Set your BMV, occupancy, refurbishment, yield, ROI, and deal-breaker preferences.",
  },
  {
    key: "funding_readiness",
    number: 4,
    title: "Funding Readiness",
    description:
      "Tell us how you intend to fund a purchase and when you expect to proceed.",
  },
  {
    key: "matching_review",
    number: 5,
    title: "Matching Preferences Review",
    description:
      "Review the information Asancha will use to match opportunities to you.",
  },
  {
    key: "complete_setup",
    number: 6,
    title: "Complete Setup",
    description:
      "Confirm your information and submit your investor setup for review.",
  },
] as const satisfies ReadonlyArray<{
  key: OnboardingStepKey;
  number: number;
  title: string;
  description: string;
}>;

export const INVESTOR_ACCOUNT_HOLDER_OPTIONS = [
  {
    value: "individual",
    label: "Individual",
  },
  {
    value: "company",
    label: "Company",
  },
] as const satisfies ReadonlyArray<{
  value: InvestorAccountHolderType;
  label: string;
}>;

export const INVESTOR_EXPERIENCE_OPTIONS = [
  {
    value: "first_time",
    label: "First-time investor",
  },
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "experienced",
    label: "Experienced",
  },
  {
    value: "professional",
    label: "Professional investor",
  },
] as const satisfies ReadonlyArray<{
  value: InvestorExperienceLevel;
  label: string;
}>;

export const INVESTOR_GOAL_OPTIONS = [
  {
    value: "capital_growth",
    label: "Capital growth",
  },
  {
    value: "rental_income",
    label: "Rental income",
  },
  {
    value: "portfolio_growth",
    label: "Portfolio growth",
  },
  {
    value: "property_development",
    label: "Property development",
  },
  {
    value: "short_term_resale",
    label: "Short-term resale",
  },
  {
    value: "diversification",
    label: "Portfolio diversification",
  },
  {
    value: "other",
    label: "Other",
  },
] as const satisfies ReadonlyArray<{
  value: InvestorGoal;
  label: string;
}>;

export const INVESTOR_CATEGORY_OPTIONS = [
  {
    value: "private_investor",
    label: "Private investor",
  },
  {
    value: "professional_investor",
    label: "Professional investor",
  },
  {
    value: "property_company",
    label: "Property company",
  },
  {
    value: "family_office",
    label: "Family office",
  },
  {
    value: "fund",
    label: "Investment fund",
  },
  {
    value: "joint_venture",
    label: "Joint venture",
  },
  {
    value: "other",
    label: "Other",
  },
] as const satisfies ReadonlyArray<{
  value: InvestorCategory;
  label: string;
}>;

export const INVESTOR_PROPERTY_TYPE_OPTIONS = [
  { value: "apartment", label: "Apartment" },
  { value: "terraced_house", label: "Terraced house" },
  { value: "detached_house", label: "Detached house" },
  { value: "semi_detached", label: "Semi-detached house" },
  { value: "bungalow", label: "Bungalow" },
  { value: "hmo", label: "HMO" },
  { value: "block_of_flats", label: "Block of flats" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial property" },
  { value: "development_site", label: "Development site" },
  { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
  value: InvestorPropertyType;
  label: string;
}>;

export const INVESTMENT_STRATEGY_OPTIONS = [
  { value: "buy_to_let", label: "Buy to let" },
  {
    value: "buy_refurbish_refinance",
    label: "Buy, refurbish and refinance",
  },
  { value: "flip", label: "Buy, refurbish and sell" },
  { value: "hmo", label: "HMO" },
  {
    value: "serviced_accommodation",
    label: "Serviced accommodation",
  },
  { value: "development", label: "Property development" },
  {
    value: "commercial_conversion",
    label: "Commercial conversion",
  },
  { value: "rent_to_rent", label: "Rent to rent" },
  { value: "lease_option", label: "Lease option" },
  { value: "land", label: "Land investment" },
  {
    value: "portfolio_purchase",
    label: "Portfolio purchase",
  },
  { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
  value: InvestmentStrategy;
  label: string;
}>;

export const STRATEGY_BADGE_OPTIONS = [
  { value: "cash_buyer", label: "Cash buyer" },
  { value: "quick_decision", label: "Quick decision maker" },
  { value: "chain_free", label: "Chain free" },
  {
    value: "experienced_landlord",
    label: "Experienced landlord",
  },
  { value: "developer", label: "Developer" },
  {
    value: "first_time_investor",
    label: "First-time investor",
  },
  {
    value: "high_yield_focus",
    label: "High-yield focus",
  },
  {
    value: "capital_growth_focus",
    label: "Capital-growth focus",
  },
  {
    value: "refurbishment_ready",
    label: "Open to refurbishment",
  },
  {
    value: "open_to_joint_venture",
    label: "Open to joint venture",
  },
] as const satisfies ReadonlyArray<{
  value: StrategyBadge;
  label: string;
}>;

export const BMV_INTEREST_OPTIONS = [
  { value: "not_required", label: "Not required" },
  { value: "preferred", label: "Preferred" },
  {
    value: "strongly_preferred",
    label: "Strongly preferred",
  },
  { value: "required", label: "Required" },
] as const satisfies ReadonlyArray<{
  value: BmvInterestLevel;
  label: string;
}>;

export const BMV_DISCOUNT_BAND_OPTIONS = [
  "5%–9%",
  "10%–14%",
  "15%–19%",
  "20%–24%",
  "25% or more",
] as const;

export const OCCUPANCY_STATUS_OPTIONS = [
  { value: "vacant", label: "Vacant" },
  { value: "tenanted", label: "Tenanted" },
  { value: "part_occupied", label: "Part occupied" },
  { value: "unknown", label: "Unknown" },
] as const satisfies ReadonlyArray<{
  value: OccupancyStatus;
  label: string;
}>;

export const REFURB_LEVEL_OPTIONS = [
  { value: "none", label: "No refurbishment" },
  { value: "light", label: "Light refurbishment" },
  { value: "moderate", label: "Moderate refurbishment" },
  { value: "heavy", label: "Heavy refurbishment" },
  {
    value: "full_redevelopment",
    label: "Full redevelopment",
  },
] as const satisfies ReadonlyArray<{
  value: RefurbLevel;
  label: string;
}>;

export const FUNDING_METHOD_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "mortgage", label: "Mortgage" },
  { value: "bridging", label: "Bridging finance" },
  { value: "mixed_funding", label: "Mixed funding" },
  { value: "joint_venture", label: "Joint venture" },
  { value: "other", label: "Other" },
] as const satisfies ReadonlyArray<{
  value: FundingMethod;
  label: string;
}>;

export const PURCHASE_TIMELINE_OPTIONS = [
  { value: "immediately", label: "Ready immediately" },
  { value: "within_30_days", label: "Within 30 days" },
  { value: "within_3_months", label: "Within 3 months" },
  { value: "within_6_months", label: "Within 6 months" },
  { value: "within_12_months", label: "Within 12 months" },
  { value: "researching", label: "Still researching" },
] as const satisfies ReadonlyArray<{
  value: PurchaseTimeline;
  label: string;
}>;

export const SUGGESTED_UK_INVESTMENT_LOCATIONS = [
  "Manchester",
  "Birmingham",
  "Leeds",
  "Liverpool",
  "Sheffield",
  "Nottingham",
  "Leicester",
  "London",
] as const;

export const INVESTOR_PRIORITY_OPTIONS = [
  { value: "location", label: "Location" },
  { value: "price", label: "Purchase price" },
  { value: "bmv_discount", label: "BMV discount" },
  { value: "gross_yield", label: "Gross yield" },
  { value: "roi", label: "Return on investment" },
  { value: "property_type", label: "Property type" },
  { value: "occupancy", label: "Occupancy status" },
  { value: "refurbishment", label: "Refurbishment level" },
  { value: "purchase_speed", label: "Purchase speed" },
] as const;

export const ONBOARDING_SAFE_MESSAGES = {
  genericError:
    "We could not complete that onboarding request. Please try again.",
  loadError:
    "We could not load your onboarding information. Please refresh the page.",
  saveError:
    "We could not save your progress. Please review your information and try again.",
  submitError:
    "We could not submit your setup. Please review the required information and try again.",
  progressSaved: "Your onboarding progress has been saved.",
  submitted:
    "Your setup has been submitted. You can access your dashboard while verification continues.",
  correctionRequired:
    "Some information needs your attention before the review can continue.",
  verificationPending:
    "Your setup is complete enough for dashboard access, but verification is still in progress.",
} as const;

export const INITIAL_INVESTOR_ONBOARDING_VALUES: InvestorOnboardingValues = {
  investmentProfile: {
    accountHolderType: "individual",
    experienceLevel: "first_time",
    investmentGoals: [],
    investorCategory: "private_investor",
    companyPublicId: null,
    otherInvestmentGoal: null,
  },
  buyingCriteria: {
    preferredLocations: [],
    excludedLocations: [],
    priorityLocations: [],
    targetPurchaseAreas: [],
    budgetRange: {
      minimum: 0,
      maximum: 0,
      currency: "GBP",
    },
    preferredPropertyTypes: [],
    acceptablePropertyTypes: [],
    excludedPropertyTypes: [],
    strategies: [],
  },
  dealPreferences: {
    strategyBadges: [],
    bmvInterest: "preferred",
    preferredBmvDiscountBands: [],
    minimumBmvDiscountPercent: null,
    acceptableOccupancyStatuses: [],
    preferredOccupancyStatuses: [],
    acceptableRefurbLevels: [],
    preferredRefurbLevels: [],
    grossYieldRange: {
      minimum: null,
      target: null,
      maximum: null,
    },
    roiRange: {
      minimum: null,
      target: null,
      maximum: null,
    },
    dealBreakers: [],
    priorityWeights: [],
  },
  fundingReadiness: {
    fundingMethods: [],
    otherFundingMethod: null,
    proofOfFundsStatus: "not_provided",
    sourceOfFundsStatus: "not_provided",
    sourceOfFundsDeclaration: null,
    targetPurchaseTimeline: "researching",
    proofOfFundsDocumentPublicId: null,
  },
  confirmation: {
    informationAccurate: false,
    matchingPreferencesConfirmed: false,
  },
};

export function isOnboardingTargetRole(
  value: unknown,
): value is OnboardingTargetRole {
  return (
    typeof value === "string" &&
    (ONBOARDING_TARGET_ROLES as readonly string[]).includes(value)
  );
}
