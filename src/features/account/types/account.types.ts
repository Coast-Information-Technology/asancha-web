// File: src/features/account/types/account.types.ts

/**
 * Asancha Account Types
 *
 * Purpose:
 * Defines the public/user frontend contracts for account identity,
 * general-profile management, business-profile management, policy acceptance,
 * profile switching, and account security summaries.
 *
 * Responsibilities:
 * - Define safe current-account response shapes.
 * - Define general-profile update contracts.
 * - Define role-specific business-profile summaries.
 * - Define additional business-profile creation contracts.
 * - Define versioned policy requirements and acceptances.
 * - Define active-session and safe login-activity summaries.
 * - Define the state and actions exposed by useAccount.
 *
 * Security notes:
 * - MongoDB ObjectIds must never appear in these frontend contracts.
 * - Password hashes, token hashes, refresh tokens, API key hashes, webhook
 *   secrets, private KYC notes, internal admin notes, raw IP addresses, and
 *   restricted document URLs must never be exposed.
 * - Frontend state provides UX guidance only.
 * - Backend authentication, account status, policy, verification, onboarding,
 *   profile, company, document, and permission checks remain final.
 */

export type BusinessProfileType =
  | "investor"
  | "property_owner"
  | "property_agent"
  | "property_sourcer"
  | "service_provider"
  | "api_partner";

export type StandardBusinessProfileType = Exclude<
  BusinessProfileType,
  "api_partner"
>;

export type AccountStatus =
  "pending" | "active" | "suspended" | "locked" | "deactivated";

export type GeneralProfileStatus = "not_started" | "in_progress" | "completed";

export type BusinessProfileStatus =
  "draft" | "active" | "inactive" | "suspended" | "archived";

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

export type PreferredContactMethod =
  "email" | "phone" | "whatsapp" | "platform_message";

export type PolicyType =
  | "terms_of_use"
  | "privacy_policy"
  | "platform_rules"
  | "property_submission_rules"
  | "listing_standards"
  | "sourcer_compliance_declaration"
  | "api_acceptable_use_policy"
  | "api_billing_terms"
  | "data_processing_consent"
  | "authority_declaration";

export type PolicyAcceptanceSource =
  | "signup"
  | "onboarding"
  | "profile_creation"
  | "api_application"
  | "policy_reacceptance";

export type AccountRequestState =
  | "idle"
  | "loading"
  | "saving"
  | "switching"
  | "creating"
  | "deleting_session"
  | "success"
  | "error";

export interface GeneralProfileAddress {
  addressLine1: string | null;
  addressLine2: string | null;
  townOrCity: string | null;
  county: string | null;
  postcode: string | null;
  countryCode: string | null;
}

export interface GeneralProfile {
  profilePublicId: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  preferredContactMethod: PreferredContactMethod | null;
  profileImageUrl: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  residentialAddress: GeneralProfileAddress | null;
  status: GeneralProfileStatus;
  completionPercentage: number;
  completedAt: string | null;
  updatedAt: string;
}

export interface BusinessProfilePolicySummary {
  required: number;
  accepted: number;
  missingPolicyTypes: PolicyType[];
  reacceptanceRequiredPolicyTypes: PolicyType[];
  isComplete: boolean;
}

export interface BusinessProfileDocumentSummary {
  required: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  replacementRequired: number;
}

export interface BusinessProfileSummary {
  profilePublicId: string;
  profileType: BusinessProfileType;
  displayName: string;
  imageUrl: string | null;
  companyPublicId: string | null;
  companyName: string | null;
  status: BusinessProfileStatus;
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus;
  kycStatus: KycStatus;
  completionPercentage: number;
  pendingActionCount: number;
  isActive: boolean;
  canSwitch: boolean;
  switchRestrictionReason: string | null;
  policySummary: BusinessProfilePolicySummary;
  documentSummary: BusinessProfileDocumentSummary;
  dashboardPath: string;
  onboardingPath: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMembershipSummary {
  companyPublicId: string;
  companyName: string;
  membershipRole: string;
  membershipStatus: string;
}

export interface AccountPolicyAcceptanceSummary {
  acceptedCount: number;
  missingRequiredPolicyTypes: PolicyType[];
  reacceptanceRequiredPolicyTypes: PolicyType[];
  isComplete: boolean;
}

export interface AccountVerificationSummary {
  overallStatus: VerificationStatus | null;
  kycStatus: KycStatus | null;
  correctionRequired: boolean;
  safeUserMessage: string | null;
}

export interface AccountSummary {
  userPublicId: string;
  email: string;
  phoneNumber: string | null;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  generalProfileStatus: GeneralProfileStatus;
  generalProfile: GeneralProfile | null;
  activeBusinessProfile: BusinessProfileSummary | null;
  availableBusinessProfiles: BusinessProfileSummary[];
  companyMemberships: CompanyMembershipSummary[];
  policyAcceptanceSummary: AccountPolicyAcceptanceSummary;
  verificationSummary: AccountVerificationSummary;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateGeneralProfilePayload {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string | null;
  preferredContactMethod?: PreferredContactMethod | null;
  profileImageUrl?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  residentialAddress?: GeneralProfileAddress | null;
}

export interface CompleteGeneralProfileResult {
  profile: GeneralProfile;
  completed: true;
  nextPath: string;
}

export interface RequiredPolicy {
  policyType: PolicyType;
  policyVersion: string;
  title: string;
  description: string | null;
  policyUrl: string;
  required: boolean;
  context: string;
}

export interface PolicyAcceptanceInput {
  policyType: PolicyType;
  policyVersion: string;
  source: "profile_creation" | "api_application" | "policy_reacceptance";
}

export interface PolicyAcceptanceRecord {
  acceptancePublicId: string;
  policyType: PolicyType;
  policyVersion: string;
  profileType: BusinessProfileType | null;
  profilePublicId: string | null;
  companyPublicId: string | null;
  source: PolicyAcceptanceSource;
  relatedType: string | null;
  relatedPublicId: string | null;
  acceptedAt: string;
}

export interface AddBusinessProfilePayload {
  profileType: BusinessProfileType;
  displayName: string;
  companyPublicId?: string | null;
  policyAcceptances: PolicyAcceptanceInput[];
}

export interface AddBusinessProfileResult {
  profile: BusinessProfileSummary;
  created: true;
  onboardingRequired: boolean;
  nextPath: string;
  message: string;
}

export interface SwitchBusinessProfilePayload {
  profilePublicId: string;
}

export interface SwitchBusinessProfileResult {
  activeProfile: BusinessProfileSummary;
  switched: true;
  dashboardPath: string;
  message: string;
}

export interface AccountSecuritySummary {
  hasLocalPassword: boolean;
  emailChangePending: boolean;
  pendingEmailMasked: string | null;
  activeSessionCount: number;
  lastLoginAt: string | null;
  lastLoginLocation: string | null;
  lastLoginDevice: string | null;
  newLoginAlertsEnabled: boolean;
  passwordChangedAt: string | null;
}

export interface AccountSession {
  sessionPublicId: string;
  deviceLabel: string;
  browserLabel: string | null;
  operatingSystemLabel: string | null;
  approximateLocation: string | null;
  isCurrent: boolean;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string | null;
}

export interface DeleteSessionResult {
  sessionPublicId: string;
  deleted: true;
}

export interface AccountHookState {
  requestState: AccountRequestState;
  account: AccountSummary | null;
  generalProfile: GeneralProfile | null;
  businessProfiles: BusinessProfileSummary[];
  activeBusinessProfile: BusinessProfileSummary | null;
  requiredPolicies: RequiredPolicy[];
  policyAcceptances: PolicyAcceptanceRecord[];
  securitySummary: AccountSecuritySummary | null;
  sessions: AccountSession[];
  errorMessage: string | null;
  successMessage: string | null;
  isLoading: boolean;
  isSaving: boolean;
  isSwitching: boolean;
  isCreatingProfile: boolean;
  isDeletingSession: boolean;
}

export interface AccountHookActions {
  loadAccount: () => Promise<AccountSummary | null>;
  loadGeneralProfile: () => Promise<GeneralProfile | null>;
  updateGeneralProfile: (
    payload: UpdateGeneralProfilePayload,
  ) => Promise<GeneralProfile>;
  completeGeneralProfile: () => Promise<CompleteGeneralProfileResult>;
  loadBusinessProfiles: () => Promise<BusinessProfileSummary[]>;
  loadActiveBusinessProfile: () => Promise<BusinessProfileSummary | null>;
  loadRequiredPolicies: (
    profileType: BusinessProfileType,
  ) => Promise<RequiredPolicy[]>;
  loadPolicyAcceptances: () => Promise<PolicyAcceptanceRecord[]>;
  addBusinessProfile: (
    payload: AddBusinessProfilePayload,
  ) => Promise<AddBusinessProfileResult>;
  switchBusinessProfile: (
    payload: SwitchBusinessProfilePayload,
  ) => Promise<SwitchBusinessProfileResult>;
  loadSecuritySummary: () => Promise<AccountSecuritySummary | null>;
  loadSessions: () => Promise<AccountSession[]>;
  deleteSession: (sessionPublicId: string) => Promise<DeleteSessionResult>;
  clearMessages: () => void;
  reset: () => void;
}

export type UseAccountResult = AccountHookState & AccountHookActions;
