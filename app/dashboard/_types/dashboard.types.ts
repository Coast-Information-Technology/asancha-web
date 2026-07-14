// File: app/dashboard/_types/dashboard.types.ts

/**
 * Asancha Protected Dashboard Types
 *
 * Purpose:
 * Defines safe frontend contracts used by the authenticated dashboard shell
 * and all public-user dashboard workspaces.
 *
 * Responsibilities:
 * - Define active business-profile dashboard state.
 * - Define shared status, action, collection, and navigation contracts.
 * - Define profile-specific dashboard summaries.
 * - Define investor preference contracts.
 *
 * Security notes:
 * - Only public IDs may appear in these contracts.
 * - The backend remains authoritative for profile context and action access.
 * - Frontend summaries do not grant access or permission.
 * - Internal notes, ObjectIds, risk internals, private document URLs, payment
 *   provider payloads, prompts, tokens, credentials, and secrets must never
 *   be exposed.
 */

export type PublicBusinessProfileType =
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider"
    | "api_partner";

export type DashboardVerificationStatus =
    | "not_started"
    | "pending"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required";

export type DashboardOnboardingStatus =
    | "not_started"
    | "in_progress"
    | "submitted"
    | "completed"
    | "correction_required";

export interface DashboardBusinessProfile {
    profilePublicId: string;

    profileType:
        PublicBusinessProfileType;

    displayName: string;

    imageUrl: string | null;

    onboardingStatus:
        DashboardOnboardingStatus;

    verificationStatus:
        DashboardVerificationStatus;

    pendingActionCount: number;

    isActive: boolean;

    canSwitch: boolean;

    switchLockedReason:
        string | null;

    detailPath:
        string | null;

    dashboardPath:
        string | null;

    continueSetupPath:
        string | null;
}

export interface DashboardAction {
    actionKey: string;

    title: string;

    description:
        string | null;

    allowed: boolean;

    lockedReason:
        string | null;

    responsibleParty:
        | "user"
        | "asancha"
        | "shared"
        | null;

    actionLabel:
        string | null;

    actionPath:
        string | null;
}

export interface DashboardDocumentStatusSummary {
    total: number;

    pending: number;

    approved: number;

    rejected: number;

    replacementRequired: number;
}

export interface DashboardPaymentStatusSummary {
    total: number;

    pending: number;

    submitted: number;

    approved: number;

    rejected: number;
}

export interface DashboardPolicyAcceptanceStatus {
    complete: boolean;

    missingCount: number;
}

export interface DashboardStatusSummary {
    accountStatus: string;

    emailVerificationStatus: string;

    generalProfileStatus: string;

    onboardingStatus:
        DashboardOnboardingStatus;

    verificationStatus:
        DashboardVerificationStatus;

    documentStatusSummary:
        DashboardDocumentStatusSummary;

    paymentStatusSummary:
        DashboardPaymentStatusSummary;

    policyAcceptanceStatus:
        DashboardPolicyAcceptanceStatus;
}

export interface InvestorDashboardSummary {
    recommendedDealCount: number;

    savedDealCount: number;

    recentlyViewedCount: number;

    reservationCount: number;

    activeReservationCount: number;

    upcomingBookingCount: number;

    pendingPaymentCount: number;

    pendingDocumentCount: number;

    unreadNotificationCount: number;
}

export interface PropertyOwnerDashboardSummary {
    propertyCount: number;

    draftPropertyCount: number;

    propertyUnderReviewCount: number;

    approvedPropertyCount: number;

    correctionRequiredPropertyCount: number;

    rejectedPropertyCount: number;

    listingCount: number;

    draftListingCount: number;

    listingUnderReviewCount: number;

    publishedListingCount: number;

    pausedListingCount: number;

    upcomingBookingCount: number;

    pendingDocumentCount: number;

    unreadConversationCount: number;

    pendingPaymentCount: number;

    unreadNotificationCount: number;
}

export interface PropertyAgentDashboardSummary {
    representedPropertyCount: number;

    draftPropertyCount: number;

    propertyUnderReviewCount: number;

    approvedPropertyCount: number;

    correctionRequiredPropertyCount: number;

    rejectedPropertyCount: number;

    listingDraftCount: number;

    listingUnderReviewCount: number;

    publishedListingCount: number;

    pausedListingCount: number;

    pendingAuthorityDocumentCount: number;

    pendingDocumentCount: number;

    upcomingBookingCount: number;

    unreadConversationCount: number;

    pendingPaymentCount: number;

    unreadNotificationCount: number;

    companyVerificationStatus: string;
}

export interface PropertySourcerDashboardSummary {
    dealCount: number;

    draftDealCount: number;

    submittedDealCount: number;

    dealUnderReviewCount: number;

    approvedDealCount: number;

    publishedDealCount: number;

    correctionRequiredDealCount: number;

    rejectedDealCount: number;

    dealPackCount: number;

    listingStandardsAccepted: boolean;

    complianceDeclarationAccepted: boolean;

    feeModelStatus: string;

    payoutReadinessStatus: string;

    pendingDocumentCount: number;

    upcomingBookingCount: number;

    unreadConversationCount: number;

    pendingPaymentCount: number;

    unreadNotificationCount: number;
}

export interface ServiceProviderDashboardSummary {
    serviceCount: number;

    draftServiceCount: number;

    serviceUnderReviewCount: number;

    approvedServiceCount: number;

    activeServiceCount: number;

    pausedServiceCount: number;

    correctionRequiredServiceCount: number;

    rejectedServiceCount: number;

    newBookingRequestCount: number;

    upcomingBookingCount: number;

    completedBookingCount: number;

    pendingDocumentCount: number;

    unreadConversationCount: number;

    pendingPaymentCount: number;

    unreadNotificationCount: number;

    profileStatus: string;

    verificationStatus: string;

    visibilityStatus: string;

    availabilityStatus: string;
}

export interface ApiPartnerDashboardSummary {
    applicationCount: number;

    pendingApplicationCount: number;

    approvedApplicationCount: number;

    rejectedApplicationCount: number;

    activeApplicationCount: number;

    credentialCount: number;

    activeCredentialCount: number;

    revokedCredentialCount: number;

    pendingPaymentCount: number;

    unreadNotificationCount: number;
}

export interface DashboardState {
    activeBusinessProfileType:
        | PublicBusinessProfileType
        | null;

    activeBusinessProfile:
        | DashboardBusinessProfile
        | null;

    availableBusinessProfiles:
        DashboardBusinessProfile[];

    status:
        DashboardStatusSummary;

    investorSummary:
        | InvestorDashboardSummary
        | null;

    propertyOwnerSummary:
        | PropertyOwnerDashboardSummary
        | null;

    propertyAgentSummary:
        | PropertyAgentDashboardSummary
        | null;

    propertySourcerSummary:
        | PropertySourcerDashboardSummary
        | null;

    serviceProviderSummary:
        | ServiceProviderDashboardSummary
        | null;

    apiPartnerSummary:
        | ApiPartnerDashboardSummary
        | null;

    lockedActions:
        DashboardAction[];

    unlockedActions:
        DashboardAction[];

    pendingActions:
        DashboardAction[];

    nextActions:
        DashboardAction[];

    safeUserMessage:
        string | null;
}

export interface DashboardCollectionItem {
    publicId: string;

    title: string;

    subtitle:
        string | null;

    description:
        string | null;

    status:
        string | null;

    secondaryStatus:
        string | null;

    location:
        string | null;

    amount:
        number | null;

    currency:
        string | null;

    imageUrl:
        string | null;

    primaryLabel:
        string | null;

    primaryValue:
        string | null;

    secondaryLabel:
        string | null;

    secondaryValue:
        string | null;

    createdAt:
        string | null;

    updatedAt:
        string | null;

    detailPath:
        string | null;

    actionLabel:
        string | null;

    actionPath:
        string | null;

    lockedReason:
        string | null;
}

export interface DashboardCollectionPagination {
    page: number;

    pageSize: number;

    totalItems: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;
}

export interface DashboardCollectionResponse {
    items:
        DashboardCollectionItem[];

    pagination:
        DashboardCollectionPagination;

    safeUserMessage:
        string | null;
}

export interface InvestorPreferenceSummary {
    investorProfilePublicId: string;

    investmentGoal:
        string | null;

    experienceLevel:
        string | null;

    minimumBudget:
        number | null;

    maximumBudget:
        number | null;

    currency: string;

    strategies: string[];

    propertyTypes: string[];

    preferredLocations: string[];

    excludedLocations: string[];

    minimumGrossYield:
        number | null;

    minimumRoi:
        number | null;

    minimumBmvDiscount:
        number | null;

    occupancyPreferences:
        string[];

    refurbishmentPreferences:
        string[];

    fundingMethods:
        string[];

    purchaseTimeline:
        string | null;

    dealBreakers:
        string[];

    updatedAt:
        string | null;
}

export type InvestorPreferenceSection =
    | "overview"
    | "investment"
    | "locations";