// File: src/features/reservations/types/reservations.types.ts

/**
 * Asancha Reservation Types
 *
 * Purpose:
 * Defines authenticated investor-facing contracts for requesting, viewing,
 * filtering, cancelling, and tracking deal reservations.
 *
 * Responsibilities:
 * - Define the reservation lifecycle.
 * - Define listing, property, investor, and payment summaries.
 * - Define reservation requirements and locked-action guidance.
 * - Define safe deal activity timeline records.
 * - Define collection, pagination, filter, and mutation contracts.
 * - Define the state and actions exposed by useReservations.
 *
 * Security notes:
 * - Public reservation creation is available only through an active investor
 *   profile where backend requirements are satisfied.
 * - Routes and payloads must use public IDs only.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Private seller details, private deal-pack contents, provider payloads,
 *   internal staff notes, token hashes, secrets, and risk information must not
 *   be exposed.
 * - Payment submission does not confirm a reservation.
 * - Reservation confirmation and deal-pack access remain backend-controlled.
 */

export type ReservationStatus =
    | "draft"
    | "requested"
    | "pending_payment"
    | "payment_submitted"
    | "under_review"
    | "confirmed"
    | "rejected"
    | "cancelled"
    | "expired"
    | "failed"
    | "completed";

export type ReservationPaymentStatus =
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

export type ReservationRequirementStatus =
    | "satisfied"
    | "missing"
    | "pending"
    | "not_required";

export type ReservationRequirementType =
    | "authenticated_account"
    | "active_investor_profile"
    | "onboarding"
    | "verification"
    | "proof_of_funds"
    | "policy_acceptance"
    | "listing_availability"
    | "payment"
    | "admin_approval";

export type ReservationActivityType =
    | "reservation_requested"
    | "payment_reference_generated"
    | "payment_submitted"
    | "payment_verified"
    | "review_started"
    | "reservation_confirmed"
    | "reservation_rejected"
    | "reservation_cancelled"
    | "reservation_expired"
    | "reservation_failed"
    | "reservation_completed"
    | "deal_status_changed"
    | "document_uploaded"
    | "document_approved"
    | "document_rejected"
    | "status_updated";

export type ReservationSort =
    | "newest"
    | "oldest"
    | "updated_recently"
    | "expiry_soonest"
    | "amount_low_to_high"
    | "amount_high_to_low"
    | "status";

export type ReservationRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "creating"
    | "cancelling"
    | "success"
    | "empty"
    | "error";

export interface ReservationListingSummary {
    listingPublicId: string;
    slug: string;
    title: string;
    location: string;
    propertyType: string;
    listingCategory: string;
    dealStatus: string;
    calculatedStatus: string;
    askingPrice: number | null;
    currency: "GBP";
    coverImageUrl: string | null;
    publicListingPath: string;
}

export interface ReservationPropertySummary {
    propertyPublicId: string;
    title: string;
    addressSummary: string;
    propertyType: string;
}

export interface ReservationInvestorSummary {
    investorProfilePublicId: string;
    displayName: string;
    verificationStatus: string;
    proofOfFundsStatus: string;
}

export interface ReservationPaymentSummary {
    paymentPublicId: string | null;
    paymentReference: string | null;
    status: ReservationPaymentStatus;
    expectedAmount: number | null;
    submittedAmount: number | null;
    paidAmount: number | null;
    currency: "GBP";
    expiresAt: string | null;
    detailPath: string | null;
    nextActionLabel: string | null;
    nextActionPath: string | null;
}

export interface ReservationRequirement {
    requirementType: ReservationRequirementType;
    title: string;
    status: ReservationRequirementStatus;
    message: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface ReservationActionState {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface ReservationActivity {
    activityPublicId: string;
    activityType: ReservationActivityType;
    title: string;
    description: string | null;
    createdAt: string;
}

export interface ReservationSummary {
    reservationPublicId: string;
    reservationReference: string;

    status: ReservationStatus;

    listing: ReservationListingSummary;
    property: ReservationPropertySummary;
    investor: ReservationInvestorSummary;

    reservationAmount: number;
    currency: "GBP";

    payment: ReservationPaymentSummary;

    dealPackAccessGranted: boolean;
    dealPackAccessPath: string | null;

    safeUserMessage: string | null;
    nextActionLabel: string | null;
    nextActionPath: string | null;

    canCancel: boolean;
    canViewPayment: boolean;
    canViewDealPack: boolean;
    requiresAction: boolean;

    requestedAt: string;
    reservedAt: string | null;
    expiresAt: string | null;
    cancelledAt: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ReservationDetail extends ReservationSummary {
    description: string | null;

    requirements: ReservationRequirement[];
    actions: ReservationActionState[];
    activities: ReservationActivity[];

    rejectionReason: string | null;
    failureReason: string | null;
    cancellationReason: string | null;

    reviewedAt: string | null;
    rejectedAt: string | null;
    failedAt: string | null;
    expiredAt: string | null;
}

export interface ReservationStatusSummary {
    draft: number;
    requested: number;
    pendingPayment: number;
    paymentSubmitted: number;
    underReview: number;
    confirmed: number;
    rejected: number;
    cancelled: number;
    expired: number;
    failed: number;
    completed: number;
}

export interface ReservationFilters {
    search: string;
    statuses: ReservationStatus[];
    paymentStatuses: ReservationPaymentStatus[];

    listingPublicId: string | null;
    propertyPublicId: string | null;

    requiresAction: boolean | null;
    expiringSoon: boolean | null;
    dealPackAccessGranted: boolean | null;

    sort: ReservationSort;
    page: number;
    pageSize: number;
}

export interface ReservationQuery {
    search?: string;
    statuses?: ReservationStatus[];
    paymentStatuses?: ReservationPaymentStatus[];

    listingPublicId?: string;
    propertyPublicId?: string;

    requiresAction?: boolean;
    expiringSoon?: boolean;
    dealPackAccessGranted?: boolean;

    sort?: ReservationSort;
    page?: number;
    pageSize?: number;
}

export interface ReservationPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ReservationCollection {
    items: ReservationSummary[];
    statusSummary: ReservationStatusSummary;
    pagination: ReservationPagination;
    appliedFilters: Partial<ReservationFilters>;
}

export interface CreateReservationValues {
    listingPublicId: string;

    reservationTermsAccepted: true;
    informationAccurateConfirmed: true;
    paymentRequirementAcknowledged: true;
}

export interface CreateReservationPayload {
    data: CreateReservationValues;
}

export interface CreateReservationResult {
    reservation: ReservationDetail;
    created: true;

    paymentGenerated: boolean;
    paymentPublicId: string | null;
    paymentReference: string | null;

    nextPath: string;
    message: string;
}

export interface CancelReservationValues {
    reason: string;
    cancellationConfirmed: true;
}

export interface CancelReservationPayload {
    data: CancelReservationValues;
}

export interface CancelReservationResult {
    reservation: ReservationDetail;
    cancelled: true;
    message: string;
}

export interface ReservationsHookState {
    requestState: ReservationRequestState;

    reservations: ReservationSummary[];
    selectedReservation: ReservationDetail | null;
    statusSummary: ReservationStatusSummary | null;

    filters: ReservationFilters;
    pagination: ReservationPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isCreating: boolean;
    isCancelling: boolean;
    isEmpty: boolean;
}

export interface ReservationsHookActions {
    loadReservations: (
        filters?: Partial<ReservationFilters>,
    ) => Promise<ReservationCollection | null>;

    refreshReservations: () => Promise<ReservationCollection | null>;

    loadReservation: (
        reservationPublicId: string,
    ) => Promise<ReservationDetail | null>;

    createReservation: (
        payload: CreateReservationPayload,
    ) => Promise<CreateReservationResult>;

    cancelReservation: (
        reservationPublicId: string,
        payload: CancelReservationPayload,
    ) => Promise<CancelReservationResult>;

    setFilters: (
        filters: Partial<ReservationFilters>,
    ) => void;

    replaceFilters: (
        filters: ReservationFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedReservation: () => void;
    clearMessages: () => void;
    reset: () => void;
}

export type UseReservationsResult = ReservationsHookState &
    ReservationsHookActions;
