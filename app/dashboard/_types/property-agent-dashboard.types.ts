// File: app/dashboard/_types/property-agent-dashboard.types.ts

/**
 * Asancha Property Agent Dashboard Types
 *
 * Purpose:
 * Defines safe company, contact, represented-property, dashboard, and
 * collection contracts for the property-agent workspace.
 *
 * Security notes:
 * - Public IDs only.
 * - Company roles and memberships do not automatically grant permission.
 * - Internal notes, ObjectIds, private screening data, raw KYC information,
 *   private document locations, secrets, and hidden assignments must not appear.
 */

export type AgentCompanyStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required"
    | "suspended"
    | "inactive";

export type AgentPropertyStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "correction_required"
    | "withdrawn"
    | "archived";

export interface AgentCompanyContact {
    contactPublicId: string;

    contactType:
    | "primary"
    | "business"
    | "technical"
    | "compliance"
    | "billing"
    | "property"
    | "other";

    fullName: string;
    jobTitle: string | null;

    email: string;
    phoneNumber: string | null;

    isPrimary: boolean;
    active: boolean;
}

export interface AgentCompanySummary {
    companyPublicId: string;

    companyName: string;
    tradingName: string | null;

    companyRegistrationNumber: string;
    website: string | null;

    primaryBusinessRole: string;
    businessRoles: string[];

    registeredAddress: {
        addressLine1: string;
        addressLine2: string | null;
        townCity: string;
        county: string | null;
        postcode: string;
        country: string;
    };

    status: AgentCompanyStatus;
    verificationStatus: string;

    memberRole: string | null;

    canEdit: boolean;
    canManageContacts: boolean;
    canSubmitVerification: boolean;

    safeUserMessage: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface AgentCompanyFormValues {
    companyName: string;
    tradingName: string | null;

    companyRegistrationNumber: string;
    website: string | null;

    primaryBusinessRole: "property_agent";
    businessRoles: string[];

    registeredAddress: {
        addressLine1: string;
        addressLine2: string | null;
        townCity: string;
        county: string | null;
        postcode: string;
        country: string;
    };

    informationAccurateConfirmed: boolean;
}

export interface AgentCompanyContactsResponse {
    companyPublicId: string;
    canManageContacts: boolean;
    items: AgentCompanyContact[];
    safeUserMessage: string | null;
}

export interface AgentCompanyContactFormValues {
    contactType:
    AgentCompanyContact["contactType"];

    fullName: string;
    jobTitle: string | null;

    email: string;
    phoneNumber: string | null;

    isPrimary: boolean;
}

export interface AgentPropertyAddress {
    addressLine1: string;
    addressLine2: string | null;
    townCity: string;
    county: string | null;
    postcode: string;
    country: string;
}

export interface AgentPropertyFormValues {
    title: string;
    propertyType: string;

    companyPublicId: string | null;

    ownerName: string;
    ownerContactEmail: string | null;
    ownerContactPhone: string | null;

    representationType: string;
    authorityDocumentPublicId: string | null;

    address: AgentPropertyAddress;

    bedrooms: number | null;
    bathrooms: number | null;
    receptionRooms: number | null;

    description: string;
    occupancyStatus: string | null;
    condition: string | null;

    estimatedValue: number | null;
    askingPrice: number | null;
    expectedMonthlyRent: number | null;
    currency: "GBP";

    representationConfirmed: boolean;
    informationAccurateConfirmed: boolean;
}

export interface AgentPropertySummary {
    propertyPublicId: string;

    title: string;
    propertyType: string;

    companyPublicId: string | null;
    companyName: string | null;

    ownerDisplayName: string;

    representationType: string;
    authorityStatus: string;

    address: AgentPropertyAddress;

    status: AgentPropertyStatus;
    verificationStatus: string;

    listingCount: number;
    publishedListingCount: number;

    canEdit: boolean;
    canSubmit: boolean;
    canCreateListing: boolean;
    canUploadAuthorityDocument: boolean;

    detailPath: string;
    editPath: string | null;

    safeUserMessage: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface AgentPropertyDetail
    extends AgentPropertySummary {
    ownerContactEmail: string | null;
    ownerContactPhone: string | null;

    authorityDocumentPublicId: string | null;

    bedrooms: number | null;
    bathrooms: number | null;
    receptionRooms: number | null;

    description: string;
    occupancyStatus: string | null;
    condition: string | null;

    estimatedValue: number | null;
    askingPrice: number | null;
    expectedMonthlyRent: number | null;
    currency: "GBP";

    actions: Array<{
        actionKey: string;
        label: string;
        allowed: boolean;
        reason: string | null;
        path: string | null;
    }>;

    listings: Array<{
        listingPublicId: string;
        title: string;
        status: string;
        publicationStatus: string;
        detailPath: string | null;
    }>;

    requiredDocuments: Array<{
        requirementKey: string;
        label: string;
        status: string;
        safeUserMessage: string | null;
        actionPath: string | null;
    }>;

    recentActivity: Array<{
        activityPublicId: string;
        title: string;
        description: string | null;
        occurredAt: string;
    }>;
}

export interface AgentPropertyCollection {
    items: AgentPropertySummary[];

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

export interface PropertyAgentDashboardState {
    activeBusinessProfileType:
    | "property_agent"
    | string
    | null;

    activeBusinessProfile: {
        profilePublicId: string;
        displayName: string;
        onboardingStatus: string;
        verificationStatus: string;
    } | null;

    propertyAgentSummary: {
        representedPropertyCount: number;
        draftPropertyCount: number;
        propertyUnderReviewCount: number;
        approvedPropertyCount: number;

        listingDraftCount: number;
        listingUnderReviewCount: number;
        publishedListingCount: number;

        pendingAuthorityDocumentCount: number;
        pendingDocumentCount: number;
        upcomingBookingCount: number;
        unreadConversationCount: number;
        pendingPaymentCount: number;
        unreadNotificationCount: number;

        companyVerificationStatus: string;
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

export interface PropertyAgentCollectionItem {
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

export interface PropertyAgentCollectionResponse {
    items: PropertyAgentCollectionItem[];

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

export type UpdateAgentCompanyPayload =
    Record<string, unknown> & {
        data: AgentCompanyFormValues;
    };

export type CreateAgentCompanyContactPayload =
    Record<string, unknown> & {
        data: AgentCompanyContactFormValues;
    };

export type CreateAgentPropertyPayload =
    Record<string, unknown> & {
        data: AgentPropertyFormValues;
    };

export type UpdateAgentPropertyPayload =
    Record<string, unknown> & {
        data: Partial<AgentPropertyFormValues>;
    };