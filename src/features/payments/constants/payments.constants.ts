// File: src/features/payments/constants/payments.constants.ts

/**
 * Asancha Payment Constants
 *
 * Purpose:
 * Defines current-user payment endpoints, page routes, lifecycle labels,
 * payment-purpose options, payment-method options, default filters, and safe
 * payment messages.
 *
 * Responsibilities:
 * - Keep payment API paths in one place.
 * - Define payment and reference status labels.
 * - Define accepted external payment methods.
 * - Provide payment detail and proof-submission routes.
 * - Provide default list filters.
 * - Provide safe user-facing payment guidance.
 *
 * Security notes:
 * - Public users must never be given a payment-reference creation endpoint.
 * - Admin payment review and status routes must not appear here.
 * - Stripe secrets, webhook routes, provider tokens, and private infrastructure
 *   details must not be exposed.
 * - Frontend constants do not prove payment validity.
 */

import type {
    PaymentFilters,
    PaymentMethod,
    PaymentPurpose,
    PaymentStatus,
} from "../types/payments.types";

export const PAYMENTS_API_ENDPOINTS = {
    mine: "/payments/me",

    payment: (paymentPublicId: string): string =>
        `/payments/${encodeURIComponent(paymentPublicId)}`,

    submitExternal: (paymentPublicId: string): string =>
        `/payments/${encodeURIComponent(
            paymentPublicId,
        )}/submit-external`,

    startStripeCheckout: (
        paymentPublicId: string,
    ): string =>
        `/payments/${encodeURIComponent(
            paymentPublicId,
        )}/stripe-checkout`,
} as const;

export const PAYMENT_PAGE_ROUTES = {
    root: "/payments",

    detail: (paymentPublicId: string): string =>
        `/payments/${encodeURIComponent(paymentPublicId)}`,

    reference: (paymentReference: string): string =>
        `/payments/references/${encodeURIComponent(
            paymentReference,
        )}`,

    submitProof: (paymentReference: string): string =>
        `/payments/references/${encodeURIComponent(
            paymentReference,
        )}/submit-proof`,

    documents: "/documents",

    uploadProof: (
        paymentPublicId: string,
    ): string =>
        `/documents/upload?documentType=proof_of_payment&relatedType=payment&relatedPublicId=${encodeURIComponent(
            paymentPublicId,
        )}`,

    support: "/account/support",
} as const;

export const PAYMENT_STATUS_OPTIONS = [
    {
        value: "generated",
        label: "Generated",
    },
    {
        value: "pending",
        label: "Pending payment",
    },
    {
        value: "submitted",
        label: "Submitted for review",
    },
    {
        value: "paid",
        label: "Paid",
    },
    {
        value: "rejected",
        label: "Rejected",
    },
    {
        value: "expired",
        label: "Expired",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
    {
        value: "failed",
        label: "Failed",
    },
    {
        value: "refunded",
        label: "Refunded",
    },
] as const satisfies ReadonlyArray<{
    value: PaymentStatus;
    label: string;
}>;

export const PAYMENT_PURPOSE_OPTIONS = [
    {
        value: "reservation_fee",
        label: "Reservation fee",
    },
    {
        value: "booking_fee",
        label: "Booking fee",
    },
    {
        value: "deal_pack_access",
        label: "Deal-pack access",
    },
    {
        value: "listing_fee",
        label: "Listing fee",
    },
    {
        value: "service_fee",
        label: "Service fee",
    },
    {
        value: "api_subscription",
        label: "API subscription",
    },
    {
        value: "api_usage",
        label: "API usage",
    },
    {
        value: "verification_fee",
        label: "Verification fee",
    },
    {
        value: "other",
        label: "Other payment",
    },
] as const satisfies ReadonlyArray<{
    value: PaymentPurpose;
    label: string;
}>;

export const EXTERNAL_PAYMENT_METHOD_OPTIONS = [
    {
        value: "bank_transfer",
        label: "Bank transfer",
    },
    {
        value: "card",
        label: "Card payment outside Asancha",
    },
    {
        value: "cash",
        label: "Cash payment",
    },
    {
        value: "other",
        label: "Other external payment",
    },
] as const satisfies ReadonlyArray<{
    value: Exclude<PaymentMethod, "stripe">;
    label: string;
}>;

export const PAYMENT_SORT_OPTIONS = [
    {
        value: "newest",
        label: "Newest first",
    },
    {
        value: "oldest",
        label: "Oldest first",
    },
    {
        value: "updated_recently",
        label: "Recently updated",
    },
    {
        value: "expiry_soonest",
        label: "Expiring soonest",
    },
    {
        value: "amount_low_to_high",
        label: "Amount: low to high",
    },
    {
        value: "amount_high_to_low",
        label: "Amount: high to low",
    },
    {
        value: "status",
        label: "Status",
    },
] as const;

export const PAYMENT_PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
    50,
] as const;

export const PAYMENT_MAX_PAGE_SIZE = 50;

export const DEFAULT_PAYMENT_FILTERS: PaymentFilters = {
    search: "",

    statuses: [],
    purposes: [],
    paymentMethods: [],
    relatedTypes: [],

    paymentReference: null,
    expiringSoon: null,
    requiresAction: null,

    sort: "updated_recently",
    page: 1,
    pageSize: 20,
};

export const INITIAL_EXTERNAL_PAYMENT_VALUES = {
    paymentReference: "",
    amountPaid: 0,
    currency: "GBP",
    paymentMethod: "bank_transfer",
    payerName: "",
    bankTransactionCode: null,
    bankSessionId: null,
    paymentDescriptionUsed: "",
    paidAt: "",
    proofOfPaymentDocumentPublicId: null,
    informationAccurateConfirmed: false,
    narrationReferenceConfirmed: false,
} as const;

export const PAYMENT_SAFE_MESSAGES = {
    loadError:
        "We could not load your payments. Please refresh the page.",

    detailLoadError:
        "We could not load this payment. It may not exist or may not be available to your active profile.",

    externalSubmissionError:
        "We could not submit the payment details. Review the reference, narration, payer, amount, and trace information before trying again.",

    externalSubmissionSuccess:
        "Your payment details have been submitted for review. The payment is not confirmed until verification is complete.",

    checkoutError:
        "We could not start the secure payment session. Please try again or use another available payment method.",

    checkoutStarted:
        "Your secure payment session is ready.",

    referenceInstruction:
        "Use this payment reference as your transfer narration so we can trace and verify your payment.",

    proofInstruction:
        "Uploading proof of payment helps our team review your payment. Your payment is confirmed only after verification.",

    generated:
        "Your payment reference has been generated. Complete payment before it expires.",

    pending:
        "This payment is waiting for payment or payment details.",

    submitted:
        "Your payment details have been submitted and are waiting for review.",

    paid:
        "This payment has been verified and marked as paid.",

    rejected:
        "This payment could not be approved. Review the safe reason and next action.",

    expired:
        "This payment reference has expired and cannot be used.",

    cancelled:
        "This payment has been cancelled.",

    failed:
        "This payment was not completed successfully.",

    refunded:
        "This payment has been refunded.",

    userCannotCreateReference:
        "Payment references are generated by Asancha through approved workflows.",

    stripeVerification:
        "Returning from Stripe does not confirm payment. The payment status updates only after secure backend verification.",
} as const;

export function getPaymentStatusLabel(
    status: PaymentStatus,
): string {
    return (
        PAYMENT_STATUS_OPTIONS.find(
            (option) => option.value === status,
        )?.label ?? status
    );
}

export function getPaymentPurposeLabel(
    purpose: PaymentPurpose,
): string {
    return (
        PAYMENT_PURPOSE_OPTIONS.find(
            (option) => option.value === purpose,
        )?.label ?? purpose
    );
}