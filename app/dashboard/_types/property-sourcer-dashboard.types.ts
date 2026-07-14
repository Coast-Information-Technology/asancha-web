// File: app/dashboard/_types/property-sourcer-dashboard.types.ts

/**
 * Asancha Property Sourcer Dashboard Types
 *
 * Purpose:
 * Defines safe sourcer dashboard, deal, deal-pack, compliance, collection,
 * payment, and performance contracts.
 *
 * Security notes:
 * - Public IDs only.
 * - Internal scores, risk data, staff notes, private seller data, private
 *   investor data, provider payloads, and ObjectIds must never be exposed.
 */

export type SourcerDealStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "published"
    | "rejected"
    | "correction_required"
    | "on_hold"
    | "paused"
    | "withdrawn"
    | "sold"
    | "completed"
    | "archived";

export type SourcerDealPackStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "published"
    | "correction_required"
    | "rejected"
    | "withdrawn"
    | "archived";

export interface SourcerDealAddress {
    addressLine1: string;
    addressLine2: string | null;
    townCity: string;
    county: string | null;
    postcode: string;
    country: string;
}

export interface SourcerDealFormValues {
    title: string;
    propertyType: string;
    dealTypes: string[];
    strategies: string[];

    address: SourcerDealAddress;

    bedrooms: number | null;
    bathrooms: number | null;
    receptionRooms: number | null;

    occupancyStatus: string | null;
    refurbishmentLevel: string | null;

    description: string;
    opportunitySummary: string;
    investorOutcomeSummary: string;

    askingPrice: number | null;
    estimatedMarketValue: number | null;
    estimatedRefurbishmentCost: number | null;
    estimatedMonthlyRent: number | null;

    estimatedGrossYield: number | null;
    estimatedRoi: number | null;
    estimatedBmvDiscount: number | null;

    currency: "GBP";

    feeModel: string;
    sourcingFeeAmount: number | null;
    sourcingFeePercentage: number | null;
    sourcingFeeNotes: string | null;

    sellerOrSourceType: string | null;
    sourceReference: string | null;
    authorityDocumentPublicId: string | null;

    informationSources: string[];
    assumptions: string[];
    risksAndWarnings: string[];

    authorityConfirmed: boolean;
    informationAccurateConfirmed: boolean;
    noGuaranteedOutcomeConfirmed: boolean;
}

export interface SourcerDealAction {
    actionKey: string;
    label: string;

    allowed: boolean;
    reason: string | null;
    path: string | null;
}

export interface SourcerDealSummary {
    listingPublicId: string;
    listingSlug: string | null;

    title: string;
    propertyType: string;
    dealTypes: string[];
    strategies: string[];

    locationSummary: string;
    status: SourcerDealStatus;

    askingPrice: number | null;
    estimatedMarketValue: number | null;
    estimatedGrossYield: number | null;
    estimatedRoi: number | null;
    estimatedBmvDiscount: number | null;
    currency: "GBP";

    dealPackStatus:
        | SourcerDealPackStatus
        | null;

    viewCount: number;
    enquiryCount: number;
    reservationCount: number;
    conversionCount: number;

    canEdit: boolean;
    canSubmit: boolean;
    canCreateDealPack: boolean;

    detailPath: string;
    editPath: string | null;

    safeUserMessage: string | null;

    createdAt: string;
    updatedAt: string;
    submittedAt: string | null;
    publishedAt: string | null;
}

export interface SourcerDealDetail
    extends SourcerDealSummary {
    address: SourcerDealAddress;

    bedrooms: number | null;
    bathrooms: number | null;
    receptionRooms: number | null;

    occupancyStatus: string | null;
    refurbishmentLevel: string | null;

    description: string;
    opportunitySummary: string;
    investorOutcomeSummary: string;

    estimatedRefurbishmentCost: number | null;
    estimatedMonthlyRent: number | null;

    feeModel: string;
    sourcingFeeAmount: number | null;
    sourcingFeePercentage: number | null;
    sourcingFeeNotes: string | null;

    sellerOrSourceType: string | null;
    sourceReference: string | null;

    informationSources: string[];
    assumptions: string[];
    risksAndWarnings: string[];

    actions: SourcerDealAction[];

    dealPack: {
        dealPackPublicId: string;
        status: SourcerDealPackStatus;
        detailPath: string | null;
    } | null;

    requiredDocuments: Array<{
        requirementKey: string;
        label: string;
        status: string;
        safeUserMessage: string | null;
        actionPath: string | null;
    }>;

    recentActivity: Array<{
        activityPublicId: string;
        activityType: string;
        title: string;
        description: string | null;
        occurredAt: string;
    }>;
}

export interface SourcerDealCollection {
    items: SourcerDealSummary[];

    pagination: {
        page: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };

    statusSummary: {
        total: number;
        draft: number;
        submitted: number;
        underReview: number;
        approved: number;
        published: number;
        correctionRequired: number;
        rejected: number;
    };

    safeUserMessage: string | null;
}

export interface SourcerDealPackFormValues {
    listingPublicId: string;

    headline: string;
    executiveSummary: string;

    investmentHighlights: string[];
    financialSummary: string;
    locationSummary: string;
    propertySummary: string;
    strategySummary: string;
    refurbishmentSummary: string | null;

    risksAndWarnings: string[];
    assumptions: string[];

    documentPublicIds: string[];

    fullPackAccessMode:
        | "public"
        | "verified_investor"
        | "proof_of_funds"
        | "paid"
        | "restricted";

    informationAccurateConfirmed: boolean;
    noGuaranteedOutcomeConfirmed: boolean;
}

export interface SourcerComplianceStatus {
    profilePublicId: string;

    listingStandards: {
        policyKey: "listing_standards";
        accepted: boolean;
        acceptedVersion: string | null;
        latestVersion: string | null;
        acceptedAt: string | null;
        requiresAcceptance: boolean;
    };

    complianceDeclaration: {
        policyKey:
            "sourcer_compliance_declaration";
        accepted: boolean;
        acceptedVersion: string | null;
        latestVersion: string | null;
        acceptedAt: string | null;
        requiresAcceptance: boolean;
    };

    verificationStatus: string;
    payoutReadinessStatus: string;
    feeModelStatus: string;

    canSubmitDeal: boolean;
    dealSubmissionLockedReason: string | null;

    safeUserMessage: string | null;
}

export interface SourcerPolicyDocument {
    policyKey:
        | "listing_standards"
        | "sourcer_compliance_declaration";

    title: string;
    version: string;
    effectiveAt: string;

    summary: string;
    sections: Array<{
        sectionKey: string;
        title: string;
        paragraphs: string[];
    }>;

    alreadyAccepted: boolean;
    acceptedVersion: string | null;
    acceptedAt: string | null;
}

export interface SourcerPerformanceSummary {
    period: {
        from: string;
        to: string;
    };

    totals: {
        submittedDeals: number;
        publishedDeals: number;
        totalViews: number;
        totalEnquiries: number;
        totalReservations: number;
        totalConversions: number;
    };

    rates: {
        viewToEnquiryRate: number | null;
        enquiryToReservationRate: number | null;
        reservationToConversionRate: number | null;
        overallConversionRate: number | null;
    };

    topDeals: Array<{
        listingPublicId: string;
        title: string;
        views: number;
        enquiries: number;
        reservations: number;
        conversions: number;
        detailPath: string;
    }>;

    safeUserMessage: string | null;
}

export interface PropertySourcerDashboardState {
    activeBusinessProfileType:
        | "property_sourcer"
        | string
        | null;

    activeBusinessProfile: {
        profilePublicId: string;
        displayName: string;
        onboardingStatus: string;
        verificationStatus: string;
    } | null;

    propertySourcerSummary: {
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
    } | null;

    pendingActions: Array<{
        actionKey: string;
        title: string;
        description: string | null;
        actionLabel: string | null;
        actionPath: string | null;
    }>;

    lockedActions: Array<{
        actionKey: string;
        title: string;
        lockedReason: string | null;
        actionLabel: string | null;
        actionPath: string | null;
    }>;

    safeUserMessage: string | null;
}

export interface PropertySourcerCollectionItem {
    publicId: string;
    title: string;

    subtitle: string | null;
    description: string | null;

    status: string | null;
    secondaryStatus: string | null;

    location: string | null;

    amount: number | null;
    currency: string | null;

    primaryLabel: string | null;
    primaryValue: string | null;

    secondaryLabel: string | null;
    secondaryValue: string | null;

    detailPath: string | null;
    actionLabel: string | null;
    actionPath: string | null;

    lockedReason: string | null;
}

export interface PropertySourcerCollectionResponse {
    items: PropertySourcerCollectionItem[];

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

export type CreateSourcerDealPayload =
    Record<string, unknown> & {
        data: SourcerDealFormValues;
    };

export type UpdateSourcerDealPayload =
    Record<string, unknown> & {
        data: Partial<SourcerDealFormValues>;
    };

export type SubmitSourcerDealPayload =
    Record<string, unknown> & {
        data: {
            informationAccurateConfirmed: true;
            noGuaranteedOutcomeConfirmed: true;
        };
    };

export type CreateSourcerDealPackPayload =
    Record<string, unknown> & {
        data: SourcerDealPackFormValues;
    };

export type AcceptSourcerPolicyPayload =
    Record<string, unknown> & {
        data: {
            policyKey:
                | "listing_standards"
                | "sourcer_compliance_declaration";

            version: string;

            accepted: true;
        };
    };