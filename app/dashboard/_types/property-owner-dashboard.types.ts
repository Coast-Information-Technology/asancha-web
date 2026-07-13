// File: app/dashboard/_types/property-owner-dashboard.types.ts

/**
 * Asancha Property Owner Dashboard Types
 *
 * Purpose:
 * Defines safe property-owner dashboard, property-form, property-detail, and
 * collection contracts.
 *
 * Security notes:
 * - Only public IDs may be exposed.
 * - Ownership, authority, review, and publication permissions are
 *   backend-controlled.
 * - Internal notes, ObjectIds, private document URLs, staff identities, and
 *   risk internals must never appear.
 */

export type OwnerPropertyStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required"
    | "withdrawn"
    | "archived";

export type OwnerPropertyVerificationStatus =
    | "not_started"
    | "pending"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required";

export interface OwnerPropertyAddress {
    addressLine1: string;
    addressLine2: string | null;
    townCity: string;
    county: string | null;
    postcode: string;
    country: string;
}

export interface OwnerPropertyFormValues {
    title: string;
    propertyType: string;
    ownershipCapacity: string;
    submissionIntent: string;

    address: OwnerPropertyAddress;

    bedrooms: number | null;
    bathrooms: number | null;
    receptionRooms: number | null;

    description: string;
    condition: string | null;
    occupancyStatus: string | null;

    estimatedValue: number | null;
    expectedSalePrice: number | null;
    expectedMonthlyRent: number | null;
    currency: "GBP";

    saleTimeline: string | null;
    sellerMotivation: string | null;

    ownershipEvidenceAvailable: boolean;
    authorityConfirmed: boolean;
    informationAccurateConfirmed: boolean;
}

export interface OwnerPropertyAction {
    actionKey: string;
    label: string;
    allowed: boolean;
    reason: string | null;
    path: string | null;
}

export interface OwnerPropertySummary {
    propertyPublicId: string;

    title: string;
    propertyType: string;

    address: OwnerPropertyAddress;

    status: OwnerPropertyStatus;

    verificationStatus:
    OwnerPropertyVerificationStatus;

    listingCount: number;
    publishedListingCount: number;

    correctionRequired: boolean;
    safeUserMessage: string | null;

    canEdit: boolean;
    canSubmit: boolean;
    canCreateListing: boolean;
    canUploadDocument: boolean;

    detailPath: string;
    editPath: string | null;

    createdAt: string;
    updatedAt: string;
    submittedAt: string | null;
    approvedAt: string | null;
}

export interface OwnerPropertyDetail
    extends OwnerPropertySummary {
    ownershipCapacity: string;
    submissionIntent: string;

    bedrooms: number | null;
    bathrooms: number | null;
    receptionRooms: number | null;

    description: string;
    condition: string | null;
    occupancyStatus: string | null;

    estimatedValue: number | null;
    expectedSalePrice: number | null;
    expectedMonthlyRent: number | null;
    currency: "GBP";

    saleTimeline: string | null;
    sellerMotivation: string | null;

    requiredDocuments: Array<{
        requirementKey: string;
        label: string;
        status: string;
        safeUserMessage: string | null;
        actionPath: string | null;
    }>;

    actions: OwnerPropertyAction[];

    listings: Array<{
        listingPublicId: string;
        title: string;
        status: string;
        publicationStatus: string;
        detailPath: string | null;
    }>;

    recentActivity: Array<{
        activityPublicId: string;
        activityType: string;
        title: string;
        description: string | null;
        occurredAt: string;
    }>;
}

export interface OwnerPropertyCollection {
    items: OwnerPropertySummary[];

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
        correctionRequired: number;
        rejected: number;
    };

    safeUserMessage: string | null;
}

export interface PropertyOwnerDashboardSummary {
    propertyCount: number;
    draftPropertyCount: number;
    submittedPropertyCount: number;
    propertyUnderReviewCount: number;
    approvedPropertyCount: number;
    correctionRequiredPropertyCount: number;

    listingCount: number;
    publishedListingCount: number;

    pendingDocumentCount: number;
    upcomingBookingCount: number;
    unreadConversationCount: number;
    pendingPaymentCount: number;
    unreadNotificationCount: number;
}

export interface PropertyOwnerDashboardState {
    activeBusinessProfileType:
    | "property_owner"
    | string
    | null;

    activeBusinessProfile: {
        profilePublicId: string;
        displayName: string;
        verificationStatus: string;
        onboardingStatus: string;
    } | null;

    propertyOwnerSummary:
    | PropertyOwnerDashboardSummary
    | null;

    pendingActions: Array<{
        actionKey: string;
        title: string;
        description: string | null;
        actionLabel: string | null;
        actionPath: string | null;
        responsibleParty:
        | "user"
        | "asancha"
        | "shared"
        | null;
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

export interface PropertyOwnerCollectionItem {
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

    createdAt: string | null;
    updatedAt: string | null;
}

export interface PropertyOwnerCollectionResponse {
    items: PropertyOwnerCollectionItem[];

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

export type CreateOwnerPropertyPayload =
    Record<string, unknown> & {
        data: OwnerPropertyFormValues;
    };

export type UpdateOwnerPropertyPayload =
    Record<string, unknown> & {
        data: Partial<OwnerPropertyFormValues>;
    };

export interface CreateOwnerPropertyResult {
    property: OwnerPropertyDetail;
    created: true;
    nextPath: string;
    message: string;
}

export interface UpdateOwnerPropertyResult {
    property: OwnerPropertyDetail;
    updated: true;
    message: string;
}

export type SubmitOwnerPropertyPayload =
    Record<string, unknown> & {
        data: {
            informationAccurateConfirmed: true;
        };
    };

export interface SubmitOwnerPropertyResult {
    property: OwnerPropertyDetail;
    submitted: true;
    message: string;
}