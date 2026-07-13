// File: src/features/verification/constants/verification.constants.ts

/**
 * Asancha Verification Constants
 *
 * Purpose:
 * Defines current-user verification endpoints, page routes, status options,
 * response options, default filters, pagination rules, and safe messages.
 *
 * Responsibilities:
 * - Keep verification API paths in one place.
 * - Define public-user verification routes.
 * - Define consistent verification status labels.
 * - Define supported response types.
 * - Provide default list filters.
 * - Provide calm and safe user-facing messages.
 *
 * Security notes:
 * - Staff verification actions and internal review routes must not appear here.
 * - Risk ratings, risk flags, internal notes, and private compliance details
 *   must never be represented by public frontend constants.
 * - Frontend constants do not grant permission to respond or approve.
 */

import type {
    VerificationFilters,
    VerificationResponseType,
    VerificationReviewStatus,
    VerificationSubjectType,
    VerificationType,
} from "../types/verification.types";

export const VERIFICATION_API_ENDPOINTS = {
    mine: "/verification-reviews/me",

    review: (
        verificationReviewPublicId: string,
    ): string =>
        `/verification-reviews/${encodeURIComponent(
            verificationReviewPublicId,
        )}`,

    respond: (
        verificationReviewPublicId: string,
    ): string =>
        `/verification-reviews/${encodeURIComponent(
            verificationReviewPublicId,
        )}/respond`,
} as const;

export const VERIFICATION_PAGE_ROUTES = {
    root: "/verification",

    detail: (
        verificationReviewPublicId: string,
    ): string =>
        `/verification/${encodeURIComponent(
            verificationReviewPublicId,
        )}`,

    respond: (
        verificationReviewPublicId: string,
    ): string =>
        `/verification/${encodeURIComponent(
            verificationReviewPublicId,
        )}/respond`,

    documents: "/documents",

    uploadDocument: (
        verificationReviewPublicId: string,
    ): string =>
        `/documents/upload?relatedType=verification_review&relatedPublicId=${encodeURIComponent(
            verificationReviewPublicId,
        )}`,

    dashboard: "/dashboard",
    support: "/account/support",
} as const;

export const VERIFICATION_STATUS_OPTIONS = [
    {
        value: "pending",
        label: "Pending review",
    },
    {
        value: "in_review",
        label: "In review",
    },
    {
        value: "on_hold",
        label: "On hold",
    },
    {
        value: "correction_required",
        label: "Needs attention",
    },
    {
        value: "approved",
        label: "Approved",
    },
    {
        value: "rejected",
        label: "Not approved",
    },
    {
        value: "cancelled",
        label: "Cancelled",
    },
] as const satisfies ReadonlyArray<{
    value: VerificationReviewStatus;
    label: string;
}>;

export const VERIFICATION_TYPE_OPTIONS = [
    {
        value: "identity",
        label: "Identity verification",
    },
    {
        value: "address",
        label: "Address verification",
    },
    {
        value: "business_profile",
        label: "Business profile verification",
    },
    {
        value: "company",
        label: "Company verification",
    },
    {
        value: "property_ownership",
        label: "Property ownership verification",
    },
    {
        value: "authority_to_represent",
        label: "Authority verification",
    },
    {
        value: "property_sourcer",
        label: "Property sourcer verification",
    },
    {
        value: "service_provider",
        label: "Service provider verification",
    },
    {
        value: "api_partner",
        label: "API partner verification",
    },
    {
        value: "proof_of_funds",
        label: "Proof of funds review",
    },
    {
        value: "source_of_funds",
        label: "Source of funds review",
    },
    {
        value: "listing_compliance",
        label: "Listing compliance review",
    },
    {
        value: "other",
        label: "Other verification",
    },
] as const satisfies ReadonlyArray<{
    value: VerificationType;
    label: string;
}>;

export const VERIFICATION_SUBJECT_TYPE_OPTIONS = [
    {
        value: "user",
        label: "Account",
    },
    {
        value: "general_profile",
        label: "General profile",
    },
    {
        value: "business_profile",
        label: "Business profile",
    },
    {
        value: "company",
        label: "Company",
    },
    {
        value: "property",
        label: "Property",
    },
    {
        value: "listing",
        label: "Listing",
    },
    {
        value: "service_provider",
        label: "Service provider",
    },
    {
        value: "api_partner_application",
        label: "API partner application",
    },
] as const satisfies ReadonlyArray<{
    value: VerificationSubjectType;
    label: string;
}>;

export const VERIFICATION_RESPONSE_TYPE_OPTIONS = [
    {
        value: "information",
        label: "Provide information",
        description:
            "Provide additional information requested by the review team.",
    },
    {
        value: "correction",
        label: "Confirm a correction",
        description:
            "Confirm that requested profile or application information has been corrected.",
    },
    {
        value: "document_uploaded",
        label: "Document uploaded",
        description:
            "Confirm that a requested supporting document has been uploaded.",
    },
    {
        value: "document_replaced",
        label: "Document replaced",
        description:
            "Confirm that a requested replacement document has been submitted.",
    },
    {
        value: "declaration",
        label: "Provide declaration",
        description:
            "Provide a requested authority, source-of-funds, or accuracy declaration.",
    },
    {
        value: "other",
        label: "Other response",
        description:
            "Provide another response requested through this verification review.",
    },
] as const satisfies ReadonlyArray<{
    value: VerificationResponseType;
    label: string;
    description: string;
}>;

export const VERIFICATION_SORT_OPTIONS = [
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
        value: "status",
        label: "Status",
    },
    {
        value: "verification_type",
        label: "Verification type",
    },
] as const;

export const VERIFICATION_PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
    50,
] as const;

export const VERIFICATION_MAX_PAGE_SIZE = 50;

export const DEFAULT_VERIFICATION_FILTERS: VerificationFilters = {
    search: "",
    statuses: [],
    verificationTypes: [],
    subjectTypes: [],

    correctionRequired: null,
    canRespond: null,

    sort: "updated_recently",
    page: 1,
    pageSize: 20,
};

export const INITIAL_VERIFICATION_RESPONSE_VALUES = {
    responseType: "information",
    message: null,
    relatedDocumentPublicIds: [],
    informationAccurateConfirmed: false,
    responseAuthorityConfirmed: false,
} as const;

export const VERIFICATION_SAFE_MESSAGES = {
    loadError:
        "We could not load your verification reviews. Please refresh the page.",

    detailLoadError:
        "We could not load this verification review. It may not exist or may not be available to your active profile.",

    respondError:
        "We could not submit your response. Review the requested information and try again.",

    responseSubmitted:
        "Your response has been submitted for review.",

    pending:
        "Your verification has been submitted and is waiting for review.",

    inReview:
        "Your verification is being reviewed. We will notify you when there is an update.",

    approved:
        "Your verification has been approved. Some actions may now be available where all other requirements are complete.",

    correctionRequired:
        "Your verification needs attention. Please review the requested correction.",

    onHold:
        "Your verification review is currently on hold. Review the safe message for any action required.",

    rejected:
        "Your verification could not be approved. Review the safe message and next steps.",

    noReviews:
        "No verification review is currently available for your active profile.",

    dashboardAccess:
        "You can access your dashboard while verification continues, but some sensitive actions may remain limited.",

    staffOnlyDecision:
        "Verification decisions are completed by authorised Asancha staff.",

    safeInformationOnly:
        "Only safe user-facing review information is shown. Internal review notes and risk details are not displayed.",
} as const;

export function getVerificationStatusLabel(
    status: VerificationReviewStatus,
): string {
    return (
        VERIFICATION_STATUS_OPTIONS.find(
            (option) => option.value === status,
        )?.label ?? status
    );
}

export function getVerificationTypeLabel(
    verificationType: VerificationType,
): string {
    return (
        VERIFICATION_TYPE_OPTIONS.find(
            (option) =>
                option.value === verificationType,
        )?.label ?? verificationType
    );
}