// File: app/dashboard/_lib/dashboard-preview-state.ts

import type {
    DashboardState,
    PublicBusinessProfileType,
} from "../_types/dashboard.types";

/**
 * Local dashboard UI data.
 *
 * This does not bypass route security. It only lets dashboard UI components use
 * dummy state while backend dashboard-state is not ready.
 */
export const USE_DASHBOARD_DUMMY_DATA = true;

const DASHBOARD_PATH_BY_PROFILE_TYPE: Record<
    PublicBusinessProfileType,
    string
> = {
    investor: "/dashboard/investor",
    property_owner: "/dashboard/property-owner",
    property_agent: "/dashboard/property-agent",
    property_sourcer:
        "/dashboard/property-sourcer",
    service_provider:
        "/dashboard/service-provider",
    api_partner: "/api-partner/dashboard",
};

const DISPLAY_NAME_BY_PROFILE_TYPE: Record<
    PublicBusinessProfileType,
    string
> = {
    investor: "Investor Preview",
    property_owner: "Property Owner Preview",
    property_agent: "Property Agent Preview",
    property_sourcer: "Property Sourcer Preview",
    service_provider: "Service Provider Preview",
    api_partner: "API Partner Preview",
};

export function getDashboardPreviewProfileType(
    pathname: string | null | undefined,
): PublicBusinessProfileType {
    if (
        pathname?.startsWith("/dashboard/property-owner") ||
        pathname?.startsWith("/dashboard-ui/property-owner")
    ) {
        return "property_owner";
    }

    if (
        pathname?.startsWith("/dashboard/property-agent") ||
        pathname?.startsWith("/dashboard-ui/property-agent")
    ) {
        return "property_agent";
    }

    if (
        pathname?.startsWith("/dashboard/property-sourcer") ||
        pathname?.startsWith("/dashboard-ui/property-sourcer")
    ) {
        return "property_sourcer";
    }

    if (
        pathname?.startsWith("/dashboard/service-provider") ||
        pathname?.startsWith("/dashboard-ui/service-provider")
    ) {
        return "service_provider";
    }

    if (pathname?.startsWith("/api-partner/dashboard")) {
        return "api_partner";
    }

    return "investor";
}

export function getPreviewDashboardState<TDashboardState = DashboardState>(
    profileType: PublicBusinessProfileType,
): TDashboardState {
    const profile = {
        profilePublicId: `preview-${profileType}`,
        profileType,
        displayName: DISPLAY_NAME_BY_PROFILE_TYPE[profileType],
        imageUrl: null,
        onboardingStatus: "completed" as const,
        verificationStatus: "approved" as const,
        pendingActionCount: 0,
        isActive: true,
        canSwitch: true,
        switchLockedReason: null,
        detailPath: null,
        dashboardPath:
            DASHBOARD_PATH_BY_PROFILE_TYPE[profileType],
        continueSetupPath: null,
    };

    const state = {
        activeBusinessProfileType: profileType,
        activeBusinessProfile: profile,
        availableBusinessProfiles: [profile],
        status: {
            accountStatus: "active",
            emailVerificationStatus: "verified",
            generalProfileStatus: "completed",
            onboardingStatus: "completed",
            verificationStatus: "approved",
            documentStatusSummary: {
                total: 0,
                pending: 0,
                approved: 0,
                rejected: 0,
                replacementRequired: 0,
            },
            paymentStatusSummary: {
                total: 0,
                pending: 0,
                submitted: 0,
                approved: 0,
                rejected: 0,
            },
            policyAcceptanceStatus: {
                complete: true,
                missingCount: 0,
            },
        },
        investorSummary: {
            recommendedDealCount: 12,
            savedDealCount: 5,
            recentlyViewedCount: 8,
            reservationCount: 2,
            activeReservationCount: 1,
            upcomingBookingCount: 3,
            pendingPaymentCount: 1,
            pendingDocumentCount: 0,
            unreadNotificationCount: 4,
        },
        propertyOwnerSummary: {
            propertyCount: 9,
            draftPropertyCount: 2,
            submittedPropertyCount: 3,
            propertyUnderReviewCount: 2,
            approvedPropertyCount: 5,
            correctionRequiredPropertyCount: 1,
            rejectedPropertyCount: 0,
            listingCount: 7,
            draftListingCount: 2,
            listingUnderReviewCount: 1,
            publishedListingCount: 4,
            pausedListingCount: 1,
            upcomingBookingCount: 3,
            pendingDocumentCount: 2,
            unreadConversationCount: 6,
            pendingPaymentCount: 1,
            unreadNotificationCount: 5,
        },
        propertyAgentSummary: {
            representedPropertyCount: 18,
            draftPropertyCount: 4,
            propertyUnderReviewCount: 5,
            approvedPropertyCount: 9,
            correctionRequiredPropertyCount: 2,
            rejectedPropertyCount: 1,
            listingDraftCount: 3,
            listingUnderReviewCount: 2,
            publishedListingCount: 8,
            pausedListingCount: 1,
            pendingAuthorityDocumentCount: 3,
            pendingDocumentCount: 4,
            upcomingBookingCount: 7,
            unreadConversationCount: 9,
            pendingPaymentCount: 2,
            unreadNotificationCount: 6,
            companyVerificationStatus: "approved",
        },
        propertySourcerSummary: {
            dealCount: 14,
            draftDealCount: 3,
            submittedDealCount: 4,
            dealUnderReviewCount: 3,
            approvedDealCount: 6,
            publishedDealCount: 5,
            correctionRequiredDealCount: 1,
            rejectedDealCount: 0,
            dealPackCount: 8,
            listingStandardsAccepted: true,
            complianceDeclarationAccepted: true,
            feeModelStatus: "active",
            payoutReadinessStatus: "ready",
            pendingDocumentCount: 1,
            upcomingBookingCount: 4,
            unreadConversationCount: 5,
            pendingPaymentCount: 2,
            unreadNotificationCount: 7,
        },
        serviceProviderSummary: {
            serviceCount: 10,
            draftServiceCount: 2,
            serviceUnderReviewCount: 2,
            approvedServiceCount: 8,
            activeServiceCount: 6,
            pausedServiceCount: 1,
            correctionRequiredServiceCount: 1,
            rejectedServiceCount: 0,
            newBookingRequestCount: 5,
            upcomingBookingCount: 6,
            completedBookingCount: 18,
            pendingDocumentCount: 2,
            unreadConversationCount: 4,
            pendingPaymentCount: 2,
            unreadNotificationCount: 6,
            profileStatus: "active",
            verificationStatus: "approved",
            visibilityStatus: "visible",
            availabilityStatus: "available",
        },
        apiPartnerSummary: {
            applicationCount: 1,
            pendingApplicationCount: 0,
            approvedApplicationCount: 1,
            rejectedApplicationCount: 0,
            activeApplicationCount: 1,
            credentialCount: 2,
            activeCredentialCount: 2,
            revokedCredentialCount: 0,
            pendingPaymentCount: 0,
            unreadNotificationCount: 1,
        },
        lockedActions: [],
        unlockedActions: [],
        pendingActions: [],
        nextActions: [],
        safeUserMessage:
            "Dashboard preview mode is using temporary local state until backend dashboard-state is ready.",
    } as DashboardState;

    return state as TDashboardState;
}
