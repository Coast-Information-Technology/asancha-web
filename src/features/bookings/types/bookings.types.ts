// File: src/features/bookings/types/bookings.types.ts

/**
 * Asancha Booking Types
 *
 * Purpose:
 * Defines authenticated public-user contracts for creating, viewing,
 * filtering, cancelling, and requesting rescheduling of bookings.
 *
 * Security notes:
 * - Only public IDs may be exposed.
 * - Meeting URLs are confirmation-sensitive.
 * - Internal notes, provider payloads, secrets, and ObjectIds are forbidden.
 * - Payment submission does not confirm a paid booking.
 * - Backend lifecycle and permission rules remain final.
 */

export type BookingType =
    | "property_viewing"
    | "investment_consultation"
    | "property_consultation"
    | "service_consultation"
    | "deal_review"
    | "document_review"
    | "verification_call"
    | "support_call"
    | "other";

export type BookingStatus =
    | "requested"
    | "pending_payment"
    | "payment_submitted"
    | "under_review"
    | "confirmed"
    | "reschedule_requested"
    | "rescheduled"
    | "rejected"
    | "cancelled"
    | "completed"
    | "no_show"
    | "expired"
    | "failed";

export type BookingChannel =
    | "in_person"
    | "phone"
    | "video"
    | "calendly"
    | "manual_url";

export type BookingTargetType =
    | "listing"
    | "property"
    | "reservation"
    | "service_provider"
    | "service"
    | "verification_review"
    | "support"
    | "other";

export type BookingParticipantRole =
    | "investor"
    | "property_owner"
    | "property_agent"
    | "property_sourcer"
    | "service_provider"
    | "admin"
    | "customer_care_rep"
    | "super_admin";

export type BookingPaymentStatus =
    | "not_required"
    | "not_generated"
    | "pending"
    | "submitted"
    | "paid"
    | "rejected"
    | "expired"
    | "cancelled"
    | "failed"
    | "refunded";

export type BookingSort =
    | "newest"
    | "oldest"
    | "updated_recently"
    | "scheduled_soonest"
    | "scheduled_latest"
    | "status";

export type BookingRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "creating"
    | "cancelling"
    | "requesting_reschedule"
    | "success"
    | "empty"
    | "error";

export interface BookingTargetSummary {
    targetType: BookingTargetType;
    targetPublicId: string;
    displayLabel: string;
    detailPath: string | null;
}

export interface BookingListingSummary {
    listingPublicId: string;
    slug: string | null;
    title: string;
    location: string | null;
    publicListingPath: string | null;
}

export interface BookingPropertySummary {
    propertyPublicId: string;
    title: string;
    addressSummary: string | null;
}

export interface BookingReservationSummary {
    reservationPublicId: string;
    reservationReference: string;
    status: string;
    detailPath: string | null;
}

export interface BookingParticipant {
    participantPublicId: string;
    role: BookingParticipantRole;
    displayName: string;
    companyName: string | null;
    attendanceStatus:
    | "unknown"
    | "expected"
    | "attended"
    | "absent"
    | "late"
    | "cancelled";
}

export interface BookingSchedule {
    requestedStartAt: string;
    requestedEndAt: string;

    scheduledStartAt: string | null;
    scheduledEndAt: string | null;

    timezone: string;
    locationName: string | null;
    locationAddress: string | null;

    meetingUrl: string | null;
    meetingProvider: string | null;
}

export interface BookingPaymentSummary {
    paymentPublicId: string | null;
    paymentReference: string | null;
    status: BookingPaymentStatus;
    expectedAmount: number | null;
    currency: "GBP";
    expiresAt: string | null;
    detailPath: string | null;
}

export interface BookingActionState {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface BookingTimelineEvent {
    eventPublicId: string;
    eventType:
    | "requested"
    | "payment_generated"
    | "payment_submitted"
    | "confirmed"
    | "reschedule_requested"
    | "rescheduled"
    | "rejected"
    | "cancelled"
    | "completed"
    | "no_show"
    | "expired"
    | "failed"
    | "status_updated";

    title: string;
    description: string | null;
    createdAt: string;
}

export interface BookingSummary {
    bookingPublicId: string;
    bookingReference: string;

    bookingType: BookingType;
    customBookingType: string | null;
    status: BookingStatus;
    channel: BookingChannel;

    title: string;
    purpose: string | null;

    target: BookingTargetSummary;
    listing: BookingListingSummary | null;
    property: BookingPropertySummary | null;
    reservation: BookingReservationSummary | null;

    schedule: BookingSchedule;
    payment: BookingPaymentSummary;

    safeUserMessage: string | null;
    nextActionLabel: string | null;
    nextActionPath: string | null;

    canCancel: boolean;
    canRequestReschedule: boolean;
    canViewMeetingDetails: boolean;
    requiresAction: boolean;

    requestedAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface BookingDetail extends BookingSummary {
    notesForBooking: string | null;

    participants: BookingParticipant[];
    actions: BookingActionState[];
    timeline: BookingTimelineEvent[];

    rejectionReason: string | null;
    cancellationReason: string | null;
    failureReason: string | null;

    rescheduleRequestedAt: string | null;
    rescheduledAt: string | null;
    rejectedAt: string | null;
    expiredAt: string | null;
    failedAt: string | null;
}

export interface BookingStatusSummary {
    requested: number;
    pendingPayment: number;
    paymentSubmitted: number;
    underReview: number;
    confirmed: number;
    rescheduleRequested: number;
    rescheduled: number;
    rejected: number;
    cancelled: number;
    completed: number;
    noShow: number;
    expired: number;
    failed: number;
}

export interface BookingFilters {
    search: string;
    statuses: BookingStatus[];
    bookingTypes: BookingType[];
    channels: BookingChannel[];
    targetTypes: BookingTargetType[];

    targetPublicId: string | null;
    listingPublicId: string | null;
    reservationPublicId: string | null;

    upcoming: boolean | null;
    requiresAction: boolean | null;

    sort: BookingSort;
    page: number;
    pageSize: number;
}

export interface BookingQuery {
    search?: string;
    statuses?: BookingStatus[];
    bookingTypes?: BookingType[];
    channels?: BookingChannel[];
    targetTypes?: BookingTargetType[];

    targetPublicId?: string;
    listingPublicId?: string;
    reservationPublicId?: string;

    upcoming?: boolean;
    requiresAction?: boolean;

    sort?: BookingSort;
    page?: number;
    pageSize?: number;
}

export interface BookingPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BookingCollection {
    items: BookingSummary[];
    statusSummary: BookingStatusSummary;
    pagination: BookingPagination;
    appliedFilters: Partial<BookingFilters>;
}

export interface CreateBookingValues {
    bookingType: BookingType;
    customBookingType: string | null;

    targetType: BookingTargetType;
    targetPublicId: string;

    listingPublicId: string | null;
    propertyPublicId: string | null;
    reservationPublicId: string | null;
    serviceProviderProfilePublicId: string | null;

    title: string;
    purpose: string | null;
    notesForBooking: string | null;

    requestedStartAt: string;
    requestedEndAt: string;
    timezone: string;

    preferredChannel: BookingChannel;

    bookingTermsAccepted: true;
    informationAccurateConfirmed: true;
    paymentRequirementAcknowledged: true;
}

export type CreateBookingPayload = Record<string, unknown> & { data: CreateBookingValues; };

export interface CreateBookingResult {
    booking: BookingDetail;
    created: true;

    paymentGenerated: boolean;
    paymentPublicId: string | null;
    paymentReference: string | null;

    nextPath: string;
    message: string;
}

export interface CancelBookingValues {
    reason: string;
    cancellationConfirmed: true;
}

export type CancelBookingPayload = Record<string, unknown> & { data: CancelBookingValues; };

export interface CancelBookingResult {
    booking: BookingDetail;
    cancelled: true;
    message: string;
}

export interface RequestBookingRescheduleValues {
    requestedStartAt: string;
    requestedEndAt: string;
    timezone: string;
    reason: string;
    rescheduleConfirmed: true;
}

export type RequestBookingReschedulePayload = Record<string, unknown> & { data: RequestBookingRescheduleValues; };

export interface RequestBookingRescheduleResult {
    booking: BookingDetail;
    requested: true;
    message: string;
}

export interface BookingsHookState {
    requestState: BookingRequestState;

    bookings: BookingSummary[];
    selectedBooking: BookingDetail | null;
    statusSummary: BookingStatusSummary | null;

    filters: BookingFilters;
    pagination: BookingPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isCreating: boolean;
    isCancelling: boolean;
    isRequestingReschedule: boolean;
    isEmpty: boolean;
}

export interface BookingsHookActions {
    loadBookings: (
        filters?: Partial<BookingFilters>,
    ) => Promise<BookingCollection | null>;

    refreshBookings: () => Promise<BookingCollection | null>;

    loadBooking: (
        bookingPublicId: string,
    ) => Promise<BookingDetail | null>;

    createBooking: (
        payload: CreateBookingPayload,
    ) => Promise<CreateBookingResult>;

    cancelBooking: (
        bookingPublicId: string,
        payload: CancelBookingPayload,
    ) => Promise<CancelBookingResult>;

    requestBookingReschedule: (
        bookingPublicId: string,
        payload: RequestBookingReschedulePayload,
    ) => Promise<RequestBookingRescheduleResult>;

    setFilters: (
        filters: Partial<BookingFilters>,
    ) => void;

    replaceFilters: (
        filters: BookingFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedBooking: () => void;
    clearMessages: () => void;
    reset: () => void;
}

export type UseBookingsResult =
    BookingsHookState & BookingsHookActions;
