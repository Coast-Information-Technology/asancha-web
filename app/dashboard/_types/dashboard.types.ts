// File: app/dashboard/_types/dashboard.types.ts

/**
 * Asancha Protected Dashboard Types
 *
 * Purpose:
 * Defines safe frontend contracts used by the authenticated dashboard shell
 * and investor workspace pages.
 *
 * Security notes:
 * - Only public IDs may appear in these contracts.
 * - The backend remains authoritative for profile context and action access.
 * - Internal notes, ObjectIds, risk internals, private document URLs, payment
 *   provider payloads, prompts, tokens and secrets must never be exposed.
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
    profileType: PublicBusinessProfileType;

    displayName: string;
    imageUrl: string | null;

    onboardingStatus: DashboardOnboardingStatus;
    verificationStatus: DashboardVerificationStatus;

    pendingActionCount: number;

    isActive: boolean;
    canSwitch: boolean;
    switchLockedReason: string | null;

    detailPath: string | null;
    dashboardPath: string | null;
    continueSetupPath: string | null;
}

export interface DashboardAction {
    actionKey: string;
    title: string;
    description: string | null;

    allowed: boolean;
    lockedReason: string | null;

    responsibleParty:
    | "user"
    | "asancha"
    | "shared"
    | null;

    actionLabel: string | null;
    actionPath: string | null;
}

export interface DashboardStatusSummary {
    accountStatus: string;
    emailVerificationStatus: string;
    generalProfileStatus: string;
    onboardingStatus: DashboardOnboardingStatus;
    verificationStatus: DashboardVerificationStatus;

    documentStatusSummary: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        replacementRequired: number;
    };

    paymentStatusSummary: {
        total: number;
        pending: number;
        submitted: number;
        approved: number;
        rejected: number;
    };

    policyAcceptanceStatus: {
        complete: boolean;
        missingCount: number;
    };
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

export interface DashboardState {
    activeBusinessProfileType:
    | PublicBusinessProfileType
    | null;

    activeBusinessProfile:
    | DashboardBusinessProfile
    | null;

    availableBusinessProfiles:
    DashboardBusinessProfile[];

    status: DashboardStatusSummary;

    investorSummary:
    | InvestorDashboardSummary
    | null;

    lockedActions: DashboardAction[];
    unlockedActions: DashboardAction[];
    pendingActions: DashboardAction[];
    nextActions: DashboardAction[];

    safeUserMessage: string | null;
}

export interface DashboardCollectionItem {
    publicId: string;
    title: string;

    subtitle: string | null;
    description: string | null;

    status: string | null;
    secondaryStatus: string | null;

    location: string | null;
    amount: number | null;
    currency: string | null;

    imageUrl: string | null;

    primaryLabel: string | null;
    primaryValue: string | null;

    secondaryLabel: string | null;
    secondaryValue: string | null;

    createdAt: string | null;
    updatedAt: string | null;

    detailPath: string | null;
    actionLabel: string | null;
    actionPath: string | null;

    lockedReason: string | null;
}

export interface DashboardCollectionResponse {
    items: DashboardCollectionItem[];

    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    safeUserMessage: string | null;
}

export interface InvestorPreferenceSummary {
    investorProfilePublicId: string;

    investmentGoal: string | null;
    experienceLevel: string | null;

    minimumBudget: number | null;
    maximumBudget: number | null;
    currency: string;

    strategies: string[];
    propertyTypes: string[];

    preferredLocations: string[];
    excludedLocations: string[];

    minimumGrossYield: number | null;
    minimumRoi: number | null;
    minimumBmvDiscount: number | null;

    occupancyPreferences: string[];
    refurbishmentPreferences: string[];

    fundingMethods: string[];
    purchaseTimeline: string | null;

    dealBreakers: string[];

    updatedAt: string | null;
}

export type InvestorPreferenceSection =
    | "overview"
    | "investment"
    | "locations";