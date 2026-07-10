// File: src/features/onboarding/types/onboarding.types.ts

/**
 * Asancha Onboarding Types
 *
 * Purpose:
 * Defines the public/user frontend contracts for general role-aware
 * onboarding and the investor onboarding flow.
 *
 * Responsibilities:
 * - Define supported onboarding target roles.
 * - Define onboarding lifecycle and verification states.
 * - Define investor profile and matching-preference data.
 * - Define progress-save and submission API contracts.
 * - Define backend-driven dashboard access state.
 *
 * Important security notes:
 * - Public frontend contracts must use public IDs only.
 * - MongoDB ObjectIds must never be exposed through these types.
 * - Internal admin notes, private KYC notes, risk investigation details,
 *   restricted document URLs, and provider payloads must not be included.
 * - Onboarding completion does not mean verification approval.
 * - Frontend state is UX guidance only; backend checks remain final.
 */

export type OnboardingTargetRole =
  | "investor"
  | "property_owner"
  | "property_agent"
  | "property_sourcer"
  | "service_provider"
  | "api_partner";

export type StandardPublicOnboardingRole = Exclude<
  OnboardingTargetRole,
  "api_partner"
>;

export type OnboardingStatus =
  "not_started" | "in_progress" | "completed" | "abandoned";

export type VerificationStatus =
  "pending" | "approved" | "rejected" | "on_hold";

export type KycStatus =
  | "not_started"
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "on_hold"
  | "replacement_required";

export type SourceOfFundsStatus =
  | "not_required"
  | "not_provided"
  | "declared"
  | "document_submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "on_hold";

export type ProofOfFundsStatus =
  | "not_required"
  | "not_provided"
  | "planned"
  | "submitted"
  | "in_review"
  | "approved"
  | "rejected"
  | "replacement_required";

export type InvestorAccountHolderType = "individual" | "company";

export type InvestorExperienceLevel =
  "first_time" | "beginner" | "intermediate" | "experienced" | "professional";

export type InvestorGoal =
  | "capital_growth"
  | "rental_income"
  | "portfolio_growth"
  | "property_development"
  | "short_term_resale"
  | "diversification"
  | "other";

export type InvestorCategory =
  | "private_investor"
  | "professional_investor"
  | "property_company"
  | "family_office"
  | "fund"
  | "joint_venture"
  | "other";

export type SupportedCurrency = "GBP";

export type InvestorPropertyType =
  | "apartment"
  | "terraced_house"
  | "detached_house"
  | "semi_detached"
  | "bungalow"
  | "hmo"
  | "block_of_flats"
  | "land"
  | "commercial"
  | "development_site"
  | "other";

export type InvestmentStrategy =
  | "buy_to_let"
  | "buy_refurbish_refinance"
  | "flip"
  | "hmo"
  | "serviced_accommodation"
  | "development"
  | "commercial_conversion"
  | "rent_to_rent"
  | "lease_option"
  | "land"
  | "portfolio_purchase"
  | "other";

export type StrategyBadge =
  | "cash_buyer"
  | "quick_decision"
  | "chain_free"
  | "experienced_landlord"
  | "developer"
  | "first_time_investor"
  | "high_yield_focus"
  | "capital_growth_focus"
  | "refurbishment_ready"
  | "open_to_joint_venture";

export type BmvInterestLevel =
  "not_required" | "preferred" | "strongly_preferred" | "required";

export type OccupancyStatus =
  "vacant" | "tenanted" | "part_occupied" | "unknown";

export type RefurbLevel =
  "none" | "light" | "moderate" | "heavy" | "full_redevelopment";

export type FundingMethod =
  | "cash"
  | "mortgage"
  | "bridging"
  | "mixed_funding"
  | "joint_venture"
  | "other";

export type PurchaseTimeline =
  | "immediately"
  | "within_30_days"
  | "within_3_months"
  | "within_6_months"
  | "within_12_months"
  | "researching";

export type InvestorPriorityKey =
  | "location"
  | "price"
  | "bmv_discount"
  | "gross_yield"
  | "roi"
  | "property_type"
  | "occupancy"
  | "refurbishment"
  | "purchase_speed";

export type OnboardingStepKey =
  | "investment_profile"
  | "buying_criteria"
  | "deal_preferences"
  | "funding_readiness"
  | "matching_review"
  | "complete_setup";

export type OnboardingSaveState =
  | "idle"
  | "loading"
  | "saving"
  | "saved"
  | "submitting"
  | "submitted"
  | "error";

export interface MoneyRange {
  minimum: number;
  maximum: number;
  currency: SupportedCurrency;
}

export interface PercentageRange {
  minimum: number | null;
  target: number | null;
  maximum: number | null;
}

export interface InvestorPriorityWeight {
  key: InvestorPriorityKey;
  weight: number;
}

export interface InvestorInvestmentProfile {
  accountHolderType: InvestorAccountHolderType;
  experienceLevel: InvestorExperienceLevel;
  investmentGoals: InvestorGoal[];
  investorCategory: InvestorCategory;
  companyPublicId: string | null;
  otherInvestmentGoal: string | null;
}

export interface InvestorBuyingCriteria {
  preferredLocations: string[];
  excludedLocations: string[];
  priorityLocations: string[];
  targetPurchaseAreas: string[];
  budgetRange: MoneyRange;
  preferredPropertyTypes: InvestorPropertyType[];
  acceptablePropertyTypes: InvestorPropertyType[];
  excludedPropertyTypes: InvestorPropertyType[];
  strategies: InvestmentStrategy[];
}

export interface InvestorDealPreferences {
  strategyBadges: StrategyBadge[];
  bmvInterest: BmvInterestLevel;
  preferredBmvDiscountBands: string[];
  minimumBmvDiscountPercent: number | null;
  acceptableOccupancyStatuses: OccupancyStatus[];
  preferredOccupancyStatuses: OccupancyStatus[];
  acceptableRefurbLevels: RefurbLevel[];
  preferredRefurbLevels: RefurbLevel[];
  grossYieldRange: PercentageRange;
  roiRange: PercentageRange;
  dealBreakers: string[];
  priorityWeights: InvestorPriorityWeight[];
}

export interface InvestorFundingReadiness {
  fundingMethods: FundingMethod[];
  otherFundingMethod: string | null;
  proofOfFundsStatus: ProofOfFundsStatus;
  sourceOfFundsStatus: SourceOfFundsStatus;
  sourceOfFundsDeclaration: string | null;
  targetPurchaseTimeline: PurchaseTimeline;
  proofOfFundsDocumentPublicId: string | null;
}

export interface InvestorOnboardingValues {
  investmentProfile: InvestorInvestmentProfile;
  buyingCriteria: InvestorBuyingCriteria;
  dealPreferences: InvestorDealPreferences;
  fundingReadiness: InvestorFundingReadiness;
  confirmation: {
    informationAccurate: boolean;
    matchingPreferencesConfirmed: boolean;
  };
}

export interface OnboardingProgressSummary {
  completedSteps: OnboardingStepKey[];
  currentStep: OnboardingStepKey;
  completionPercentage: number;
}

/**
 * Generic role-aware onboarding record.
 *
 * `unknown` is intentionally used as the default data type because the exact
 * role-specific onboarding data is not known until targetRole is narrowed.
 *
 * Using Record<string, unknown> here would incorrectly require every
 * role-specific interface to define a string index signature.
 */
export interface OnboardingRecord<TData = unknown> {
  onboardingPublicId: string;
  targetRole: OnboardingTargetRole;
  status: OnboardingStatus;
  verificationStatus: VerificationStatus;
  kycStatus: KycStatus;
  currentStep: OnboardingStepKey | string | null;
  completedSteps: string[];
  completionPercentage: number;
  profilePublicId: string | null;
  companyPublicId: string | null;
  data: TData | null;
  correctionRequired: boolean;
  safeUserMessage: string | null;
  startedAt: string | null;
  submittedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
}

export interface InvestorOnboardingRecord extends OnboardingRecord<InvestorOnboardingValues> {
  targetRole: "investor";
}

export interface OnboardingStartPayload {
  targetRole: OnboardingTargetRole;
  profilePublicId?: string;
  companyPublicId?: string;
}

export interface OnboardingStartResult {
  onboarding: OnboardingRecord;
  created: boolean;
  nextPath: string;
}

export interface InvestorOnboardingProgressPayload {
  currentStep: OnboardingStepKey;
  completedSteps: OnboardingStepKey[];
  data: Partial<InvestorOnboardingValues>;
}

export interface InvestorOnboardingSubmitPayload {
  data: InvestorOnboardingValues;
}

export interface InvestorOnboardingSubmitResult {
  onboarding: InvestorOnboardingRecord;
  onboardingCompleted: true;
  verificationStatus: VerificationStatus;
  dashboardAccessAllowed: boolean;
  nextPath: string;
  message: string;
}

export interface OnboardingRoleStatus {
  targetRole: OnboardingTargetRole;
  status: OnboardingStatus;
  verificationStatus: VerificationStatus;
  currentStep: string | null;
  completionPercentage: number;
  correctionRequired: boolean;
  safeUserMessage: string | null;
  nextPath: string;
}

export interface DashboardActionState {
  action: string;
  label: string;
  reason: string | null;
  nextActionLabel: string | null;
  nextActionPath: string | null;
  responsibleParty: "user" | "asancha" | "system" | null;
}

export interface DashboardDocumentStatusSummary {
  required: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  replacementRequired: number;
}

export interface DashboardPolicyStatusSummary {
  required: number;
  accepted: number;
  missing: string[];
  reacceptanceRequired: string[];
}

export interface OnboardingDashboardState {
  accountStatus: string;
  emailVerificationStatus: string;
  generalProfileStatus: string;
  activeBusinessProfileType: OnboardingTargetRole | null;
  activeBusinessProfileStatus: string | null;
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus | null;
  documentStatusSummary: DashboardDocumentStatusSummary;
  policyAcceptanceStatus: DashboardPolicyStatusSummary;
  lockedActions: DashboardActionState[];
  unlockedActions: DashboardActionState[];
  pendingActions: DashboardActionState[];
  nextPath: string;
}

export interface OnboardingHookState {
  state: OnboardingSaveState;
  onboarding: OnboardingRecord<unknown> | null;
  investorOnboarding: InvestorOnboardingRecord | null;
  roleStatus: OnboardingRoleStatus | null;
  dashboardState: OnboardingDashboardState | null;
  errorMessage: string | null;
  isLoading: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  isCompleted: boolean;
}

export interface OnboardingHookActions {
  loadOnboarding: () => Promise<OnboardingRecord<unknown> | null>;

  loadInvestorOnboarding: () => Promise<InvestorOnboardingRecord | null>;

  startOnboarding: (
    payload: OnboardingStartPayload,
  ) => Promise<OnboardingStartResult>;

  saveInvestorProgress: (
    payload: InvestorOnboardingProgressPayload,
  ) => Promise<InvestorOnboardingRecord>;

  submitInvestorOnboarding: (
    payload: InvestorOnboardingSubmitPayload,
  ) => Promise<InvestorOnboardingSubmitResult>;

  loadRoleStatus: (
    targetRole: OnboardingTargetRole,
  ) => Promise<OnboardingRoleStatus>;

  loadDashboardState: () => Promise<OnboardingDashboardState>;

  clearError: () => void;

  reset: () => void;
}

export type UseOnboardingResult = OnboardingHookState & OnboardingHookActions;
