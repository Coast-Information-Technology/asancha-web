// File: src/features/payments/types/payments.types.ts

/**
 * Asancha Payment Types
 *
 * Purpose:
 * Defines authenticated public-user frontend contracts for payment lists,
 * payment detail, external payment submission, proof-of-payment linkage,
 * Stripe Checkout initiation, and payment status display.
 *
 * Responsibilities:
 * - Define payment and payment-reference lifecycle states.
 * - Define payment purpose, method, payer, and related-resource summaries.
 * - Define safe external-payment submission values.
 * - Define safe Stripe Checkout response values.
 * - Define collections, filters, pagination, and hook state.
 *
 * Security notes:
 * - Users must never create or invent Asancha payment references.
 * - Frontend routes and payloads must use public IDs and payment references.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Provider secrets, webhook secrets, full bank account details, token hashes,
 *   raw provider payloads, internal review notes, and private document URLs
 *   must never be exposed.
 * - Proof of payment does not mark a payment as paid.
 * - Stripe success redirects do not prove settlement. Backend webhook
 *   verification remains the source of truth.
 * - Backend ownership, lifecycle, amount, narration, reference, provider,
 *   verification, reservation, booking, and permission checks remain final.
 */

export type PaymentCurrency = "GBP";

export type PaymentStatus =
    | "generated"
    | "pending"
    | "submitted"
    | "paid"
    | "rejected"
    | "expired"
    | "cancelled"
    | "failed"
    | "refunded";

export type PaymentReferenceStatus =
    | "active"
    | "used"
    | "expired"
    | "cancelled";

export type PaymentMethod =
    | "bank_transfer"
    | "stripe"
    | "card"
    | "cash"
    | "other";

export type PaymentProvider =
    | "manual"
    | "stripe"
    | "bank"
    | "internal";

export type PaymentPurpose =
    | "reservation_fee"
    | "booking_fee"
    | "deal_pack_access"
    | "listing_fee"
    | "service_fee"
    | "api_subscription"
    | "api_usage"
    | "verification_fee"
    | "other";

export type PaymentRelatedType =
    | "reservation"
    | "booking"
    | "listing"
    | "property"
    | "deal_pack"
    | "service"
    | "api_subscription"
    | "api_client"
    | "verification_review"
    | "other";

export type PaymentReviewStatus =
    | "not_submitted"
    | "pending_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "not_required";

export type PaymentRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "submitting_external"
    | "starting_checkout"
    | "success"
    | "empty"
    | "error";

export type PaymentSort =
    | "newest"
    | "oldest"
    | "updated_recently"
    | "expiry_soonest"
    | "amount_low_to_high"
    | "amount_high_to_low"
    | "status";

export interface PaymentRelatedResource {
    relatedType: PaymentRelatedType;
    relatedPublicId: string | null;
    displayLabel: string;
    detailPath: string | null;
}

export interface PaymentPayerSummary {
    payerUserPublicId: string | null;
    payerProfilePublicId: string | null;
    payerCompanyPublicId: string | null;

    expectedPayerName: string | null;
    submittedPayerName: string | null;
}

export interface PaymentProofSummary {
    documentPublicId: string;
    displayName: string;
    reviewStatus:
    | "pending"
    | "approved"
    | "rejected"
    | "on_hold"
    | "replacement_required";
    detailPath: string | null;
}

export interface PaymentBankTraceSummary {
    paymentMethod: PaymentMethod | null;
    bankTransactionCode: string | null;
    bankSessionId: string | null;
    paymentDescriptionUsed: string | null;
    paidAt: string | null;
}

export interface PaymentActionState {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface PaymentSummary {
    paymentPublicId: string;
    paymentReference: string;

    purpose: PaymentPurpose;
    customPurpose: string | null;
    purposeLabel: string;

    relatedResource: PaymentRelatedResource | null;
    payer: PaymentPayerSummary;

    expectedAmount: number;
    submittedAmount: number | null;
    paidAmount: number | null;
    currency: PaymentCurrency;

    status: PaymentStatus;
    referenceStatus: PaymentReferenceStatus;
    reviewStatus: PaymentReviewStatus;

    paymentMethod: PaymentMethod | null;
    provider: PaymentProvider;

    expiresAt: string | null;
    paidAt: string | null;
    submittedAt: string | null;

    safeUserMessage: string | null;
    nextActionLabel: string | null;
    nextActionPath: string | null;

    canSubmitExternalPayment: boolean;
    canStartStripeCheckout: boolean;
    canUploadProof: boolean;

    createdAt: string;
    updatedAt: string;
}

export interface PaymentDetail extends PaymentSummary {
    description: string | null;

    bankTrace: PaymentBankTraceSummary;
    proofOfPayment: PaymentProofSummary | null;

    actions: PaymentActionState[];

    rejectionReason: string | null;
    failureReason: string | null;

    stripeCheckoutAvailable: boolean;

    approvedAt: string | null;
    rejectedAt: string | null;
    cancelledAt: string | null;
    expiredAt: string | null;
    failedAt: string | null;
    refundedAt: string | null;
}

export interface PaymentStatusSummary {
    generated: number;
    pending: number;
    submitted: number;
    paid: number;
    rejected: number;
    expired: number;
    cancelled: number;
    failed: number;
    refunded: number;
}

export interface PaymentFilters {
    search: string;

    statuses: PaymentStatus[];
    purposes: PaymentPurpose[];
    paymentMethods: PaymentMethod[];
    relatedTypes: PaymentRelatedType[];

    paymentReference: string | null;
    expiringSoon: boolean | null;
    requiresAction: boolean | null;

    sort: PaymentSort;
    page: number;
    pageSize: number;
}

export interface PaymentQuery {
    search?: string;

    statuses?: PaymentStatus[];
    purposes?: PaymentPurpose[];
    paymentMethods?: PaymentMethod[];
    relatedTypes?: PaymentRelatedType[];

    paymentReference?: string;
    expiringSoon?: boolean;
    requiresAction?: boolean;

    sort?: PaymentSort;
    page?: number;
    pageSize?: number;
}

export interface PaymentPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaymentCollection {
    items: PaymentSummary[];
    statusSummary: PaymentStatusSummary;
    pagination: PaymentPagination;
    appliedFilters: Partial<PaymentFilters>;
}

export interface ExternalPaymentSubmissionValues {
    paymentReference: string;

    amountPaid: number;
    currency: PaymentCurrency;
    paymentMethod: Exclude<PaymentMethod, "stripe">;

    payerName: string;

    bankTransactionCode: string | null;
    bankSessionId: string | null;

    paymentDescriptionUsed: string;
    paidAt: string;

    proofOfPaymentDocumentPublicId: string | null;

    informationAccurateConfirmed: true;
    narrationReferenceConfirmed: true;
}

export interface SubmitExternalPaymentPayload {
    data: ExternalPaymentSubmissionValues;
}

export interface SubmitExternalPaymentResult {
    payment: PaymentDetail;
    submitted: true;
    nextPath: string;
    message: string;
}

export interface StartStripeCheckoutValues {
    successPath: string | null;
    cancelPath: string | null;
}

export interface StartStripeCheckoutPayload {
    data: StartStripeCheckoutValues;
}

export interface StripeCheckoutResult {
    paymentPublicId: string;
    paymentReference: string;

    checkoutUrl: string;
    checkoutSessionPublicReference: string | null;

    expiresAt: string | null;

    started: true;
    message: string;
}

export interface PaymentsHookState {
    requestState: PaymentRequestState;

    payments: PaymentSummary[];
    selectedPayment: PaymentDetail | null;
    statusSummary: PaymentStatusSummary | null;

    filters: PaymentFilters;
    pagination: PaymentPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isSubmittingExternalPayment: boolean;
    isStartingCheckout: boolean;
    isEmpty: boolean;
}

export interface PaymentsHookActions {
    loadPayments: (
        filters?: Partial<PaymentFilters>,
    ) => Promise<PaymentCollection | null>;

    refreshPayments: () => Promise<PaymentCollection | null>;

    loadPayment: (
        paymentPublicId: string,
    ) => Promise<PaymentDetail | null>;

    submitExternalPayment: (
        paymentPublicId: string,
        payload: SubmitExternalPaymentPayload,
    ) => Promise<SubmitExternalPaymentResult>;

    startStripeCheckout: (
        paymentPublicId: string,
        payload?: StartStripeCheckoutPayload,
    ) => Promise<StripeCheckoutResult>;

    setFilters: (
        filters: Partial<PaymentFilters>,
    ) => void;

    replaceFilters: (
        filters: PaymentFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedPayment: () => void;
    clearMessages: () => void;
    reset: () => void;
}

export type UsePaymentsResult = PaymentsHookState &
    PaymentsHookActions;
