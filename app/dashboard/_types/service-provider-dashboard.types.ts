// File: app/dashboard/_types/service-provider-dashboard.types.ts

/**
 * Asancha Service Provider Dashboard Types
 *
 * Purpose:
 * Defines safe service-provider profile, availability, service catalogue,
 * booking, verification, document, conversation, and payment contracts.
 *
 * Security notes:
 * - Only public IDs may be exposed.
 * - Raw provider payloads, ObjectIds, internal notes, private verification
 *   information, private storage paths, and hidden risk data must not appear.
 */

export type ServiceProviderProfileStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "correction_required"
    | "rejected"
    | "on_hold"
    | "suspended"
    | "inactive";

export type ProviderServiceStatus =
    | "draft"
    | "submitted"
    | "under_review"
    | "approved"
    | "active"
    | "paused"
    | "correction_required"
    | "rejected"
    | "archived";

export type ProviderAvailabilityDay =
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";

export interface ServiceProviderAddress {
    addressLine1: string;
    addressLine2: string | null;
    townCity: string;
    county: string | null;
    postcode: string;
    country: string;
}

export interface ServiceProviderProfileFormValues {
    displayName: string;
    businessName: string | null;

    professionalTitle: string | null;
    serviceCategories: string[];

    shortDescription: string;
    fullDescription: string;

    yearsOfExperience: number | null;

    website: string | null;
    contactEmail: string;
    contactPhone: string | null;

    businessRegistrationNumber: string | null;
    professionalMemberships: string[];

    primaryAddress: ServiceProviderAddress;

    emergencyServiceAvailable: boolean;
    remoteServiceAvailable: boolean;

    informationAccurateConfirmed: boolean;
}

export interface ServiceProviderProfile {
    profilePublicId: string;

    displayName: string;
    businessName: string | null;

    professionalTitle: string | null;
    serviceCategories: string[];

    shortDescription: string;
    fullDescription: string;

    yearsOfExperience: number | null;

    website: string | null;
    contactEmail: string;
    contactPhone: string | null;

    businessRegistrationNumber: string | null;
    professionalMemberships: string[];

    primaryAddress: ServiceProviderAddress;

    emergencyServiceAvailable: boolean;
    remoteServiceAvailable: boolean;

    profileStatus:
        ServiceProviderProfileStatus;

    verificationStatus: string;
    visibilityStatus: string;

    serviceCount: number;
    activeServiceCount: number;

    canEdit: boolean;
    canCreateService: boolean;
    canManageAvailability: boolean;
    canManageServiceAreas: boolean;

    safeUserMessage: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface ServiceArea {
    serviceAreaPublicId: string;

    areaType:
        | "postcode"
        | "town_city"
        | "county"
        | "region"
        | "radius";

    label: string;

    postcode: string | null;
    townCity: string | null;
    county: string | null;
    region: string | null;

    radiusMiles: number | null;
    radiusOriginPostcode: string | null;

    active: boolean;
}

export interface ServiceAreasResponse {
    profilePublicId: string;

    items: ServiceArea[];

    canManage: boolean;

    maximumAreas: number | null;

    safeUserMessage: string | null;
}

export interface ServiceAreaFormValues {
    areaType:
        ServiceArea["areaType"];

    label: string;

    postcode: string | null;
    townCity: string | null;
    county: string | null;
    region: string | null;

    radiusMiles: number | null;
    radiusOriginPostcode: string | null;
}

export interface AvailabilityTimeSlot {
    availabilityPublicId: string;

    day: ProviderAvailabilityDay;

    enabled: boolean;

    startTime: string;
    endTime: string;

    deliveryModes: string[];

    maximumBookings: number | null;
}

export interface ServiceProviderAvailability {
    profilePublicId: string;

    timezone: string;

    minimumBookingNoticeHours: number;
    maximumBookingWindowDays: number;

    defaultBookingDurationMinutes: number;

    acceptsInstantBooking: boolean;
    acceptsEmergencyRequests: boolean;

    unavailableDates: string[];

    weeklyAvailability:
        AvailabilityTimeSlot[];

    canManage: boolean;

    safeUserMessage: string | null;
}

export interface ServiceProviderAvailabilityFormValues {
    timezone: string;

    minimumBookingNoticeHours: number;
    maximumBookingWindowDays: number;

    defaultBookingDurationMinutes: number;

    acceptsInstantBooking: boolean;
    acceptsEmergencyRequests: boolean;

    unavailableDates: string[];

    weeklyAvailability:
        AvailabilityTimeSlot[];
}

export interface ProviderServiceFormValues {
    title: string;
    category: string;

    shortDescription: string;
    fullDescription: string;

    deliveryModes: string[];

    pricingModel: string;

    priceAmount: number | null;
    minimumPriceAmount: number | null;
    maximumPriceAmount: number | null;

    percentageRate: number | null;

    currency: "GBP";

    estimatedDurationMinutes: number | null;

    bookingRequired: boolean;
    quoteRequired: boolean;

    emergencyService: boolean;

    serviceAreaPublicIds: string[];

    requirements: string[];
    exclusions: string[];
    deliverables: string[];

    informationAccurateConfirmed: boolean;
}

export interface ProviderServiceAction {
    actionKey: string;
    label: string;

    allowed: boolean;
    reason: string | null;
    path: string | null;
}

export interface ProviderServiceSummary {
    servicePublicId: string;

    title: string;
    category: string;

    shortDescription: string;

    deliveryModes: string[];

    pricingModel: string;
    displayPrice: string | null;

    status: ProviderServiceStatus;
    visibilityStatus: string;

    bookingCount: number;
    completedBookingCount: number;

    canEdit: boolean;
    canSubmit: boolean;
    canPause: boolean;
    canActivate: boolean;

    detailPath: string;
    editPath: string | null;

    safeUserMessage: string | null;

    createdAt: string;
    updatedAt: string;
}

export interface ProviderServiceDetail
    extends ProviderServiceSummary {
    fullDescription: string;

    priceAmount: number | null;
    minimumPriceAmount: number | null;
    maximumPriceAmount: number | null;

    percentageRate: number | null;

    currency: "GBP";

    estimatedDurationMinutes: number | null;

    bookingRequired: boolean;
    quoteRequired: boolean;
    emergencyService: boolean;

    serviceAreas: ServiceArea[];

    requirements: string[];
    exclusions: string[];
    deliverables: string[];

    actions: ProviderServiceAction[];

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

export interface ProviderServiceCollection {
    items: ProviderServiceSummary[];

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
        active: number;
        paused: number;
        correctionRequired: number;
        rejected: number;
    };

    safeUserMessage: string | null;
}

export interface ServiceProviderDashboardState {
    activeBusinessProfileType:
        | "service_provider"
        | string
        | null;

    activeBusinessProfile: {
        profilePublicId: string;
        displayName: string;
        onboardingStatus: string;
        verificationStatus: string;
    } | null;

    serviceProviderSummary: {
        serviceCount: number;
        draftServiceCount: number;
        serviceUnderReviewCount: number;
        activeServiceCount: number;
        pausedServiceCount: number;

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

export interface ServiceProviderCollectionItem {
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

export interface ServiceProviderCollectionResponse {
    items: ServiceProviderCollectionItem[];

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

export type UpdateServiceProviderProfilePayload =
    Record<string, unknown> & {
        data: ServiceProviderProfileFormValues;
    };

export type CreateServiceAreaPayload =
    Record<string, unknown> & {
        data: ServiceAreaFormValues;
    };

export type UpdateProviderAvailabilityPayload =
    Record<string, unknown> & {
        data:
            ServiceProviderAvailabilityFormValues;
    };

export type CreateProviderServicePayload =
    Record<string, unknown> & {
        data: ProviderServiceFormValues;
    };

export type UpdateProviderServicePayload =
    Record<string, unknown> & {
        data: Partial<ProviderServiceFormValues>;
    };

export type SubmitProviderServicePayload =
    Record<string, unknown> & {
        data: {
            informationAccurateConfirmed: true;
        };
    };
    