// File: src/features/documents/constants/documents.constants.ts

/**
 * Asancha Document Constants
 *
 * Purpose:
 * Defines document endpoint paths, frontend routes, supported document types,
 * review states, upload limits, default filters, and safe messages.
 *
 * Responsibilities:
 * - Keep current-user document endpoints in one place.
 * - Define document type labels and accepted file formats.
 * - Define review-status labels.
 * - Provide document upload and replacement routes.
 * - Provide default document filter state.
 * - Provide safe user-facing document messages.
 *
 * Security notes:
 * - These constants do not expose storage-provider details or private URLs.
 * - Staff document review routes must not be included in this public frontend.
 * - File extension and MIME validation in the browser does not replace backend
 *   content inspection, malware scanning, authorization, or storage controls.
 */

import type {
    DocumentFilters,
    DocumentRelatedType,
    DocumentReviewStatus,
    DocumentType,
} from "../types/documents.types";

export const DOCUMENTS_API_ENDPOINTS = {
    upload: "/documents",
    mine: "/documents/me",

    document: (documentPublicId: string): string =>
        `/documents/${encodeURIComponent(documentPublicId)}`,

    replace: (documentPublicId: string): string =>
        `/documents/${encodeURIComponent(documentPublicId)}/replace`,
} as const;

export const DOCUMENT_PAGE_ROUTES = {
    root: "/documents",
    upload: "/documents/upload",

    detail: (documentPublicId: string): string =>
        `/documents/${encodeURIComponent(documentPublicId)}`,

    replace: (documentPublicId: string): string =>
        `/documents/${encodeURIComponent(documentPublicId)}/replace`,

    verification: "/verification",
    payments: "/payments",
} as const;

export const DOCUMENT_TYPE_OPTIONS = [
    {
        value: "proof_of_funds",
        label: "Proof of funds",
        description:
            "Evidence showing that funds are available for an intended transaction.",
    },
    {
        value: "kyc_id",
        label: "KYC identification",
        description:
            "An identification document submitted for identity checks.",
    },
    {
        value: "identity_document",
        label: "Identity document",
        description:
            "A valid passport, driving licence, or other accepted identification.",
    },
    {
        value: "proof_of_address",
        label: "Proof of address",
        description:
            "A recent accepted document confirming your residential address.",
    },
    {
        value: "property_ownership_proof",
        label: "Property ownership proof",
        description:
            "Evidence showing ownership or control of a property.",
    },
    {
        value: "authority_to_represent",
        label: "Authority to represent",
        description:
            "Evidence showing permission to act for an owner, company, or other party.",
    },
    {
        value: "contract",
        label: "Contract",
        description:
            "A contract connected to an approved Asancha workflow.",
    },
    {
        value: "deal_pack",
        label: "Deal pack",
        description:
            "A controlled property opportunity document pack.",
    },
    {
        value: "valuation_report",
        label: "Valuation report",
        description:
            "A property valuation or appraisal report.",
    },
    {
        value: "compliance_document",
        label: "Compliance document",
        description:
            "A document supporting a regulatory or platform compliance requirement.",
    },
    {
        value: "company_registration",
        label: "Company registration",
        description:
            "Evidence confirming a company registration or legal identity.",
    },
    {
        value: "sourcer_verification",
        label: "Property sourcer verification",
        description:
            "Evidence supporting a property sourcer verification requirement.",
    },
    {
        value: "service_provider_verification",
        label: "Service provider verification",
        description:
            "Professional, company, licence, or registration evidence.",
    },
    {
        value: "api_partner_verification",
        label: "API partner verification",
        description:
            "Company or technical evidence supporting an API partner application.",
    },
    {
        value: "proof_of_payment",
        label: "Proof of payment",
        description:
            "Evidence supporting review of an external or offline payment claim.",
    },
    {
        value: "source_of_funds",
        label: "Source of funds",
        description:
            "Evidence or declaration explaining the source of transaction funds.",
    },
    {
        value: "other",
        label: "Other document",
        description:
            "Another document requested through an approved Asancha workflow.",
    },
] as const satisfies ReadonlyArray<{
    value: DocumentType;
    label: string;
    description: string;
}>;

export const DOCUMENT_REVIEW_STATUS_OPTIONS = [
    {
        value: "pending",
        label: "Pending",
    },
    {
        value: "approved",
        label: "Approved",
    },
    {
        value: "rejected",
        label: "Rejected",
    },
    {
        value: "on_hold",
        label: "On hold",
    },
    {
        value: "replacement_required",
        label: "Replacement required",
    },
] as const satisfies ReadonlyArray<{
    value: DocumentReviewStatus;
    label: string;
}>;

export const DOCUMENT_RELATED_TYPE_OPTIONS = [
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
        value: "verification_review",
        label: "Verification review",
    },
    {
        value: "payment",
        label: "Payment",
    },
    {
        value: "reservation",
        label: "Reservation",
    },
    {
        value: "booking",
        label: "Booking",
    },
    {
        value: "api_partner_application",
        label: "API partner application",
    },
    {
        value: "api_client",
        label: "API client",
    },
    {
        value: "other",
        label: "Other",
    },
] as const satisfies ReadonlyArray<{
    value: DocumentRelatedType;
    label: string;
}>;

export const DOCUMENT_SORT_OPTIONS = [
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
        value: "document_type",
        label: "Document type",
    },
    {
        value: "review_status",
        label: "Review status",
    },
] as const;

export const DOCUMENT_ACCEPTED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

export const DOCUMENT_ACCEPT_ATTRIBUTE =
    ".pdf,.jpg,.jpeg,.png,.webp";

export const DOCUMENT_MAX_FILE_SIZE_BYTES =
    10 * 1024 * 1024;

export const DOCUMENT_MAX_FILE_SIZE_LABEL = "10 MB";

export const DOCUMENT_PAGE_SIZE_OPTIONS = [
    10,
    20,
    30,
    50,
] as const;

export const DOCUMENT_MAX_PAGE_SIZE = 50;

export const DEFAULT_DOCUMENT_FILTERS: DocumentFilters = {
    search: "",
    documentTypes: [],
    reviewStatuses: [],
    relatedTypes: [],

    relatedPublicId: null,
    replacementAllowed: null,
    isLatestVersion: true,

    sort: "updated_recently",
    page: 1,
    pageSize: 20,
};

export const DOCUMENT_SAFE_MESSAGES = {
    loadError:
        "We could not load your documents. Please refresh the page.",

    detailLoadError:
        "We could not load this document. It may not exist or you may not have access to it.",

    uploadError:
        "We could not upload the document. Review the file and related information before trying again.",

    uploaded:
        "Your document has been submitted for review.",

    replacementError:
        "We could not upload the replacement document. Confirm that replacement is allowed and try again.",

    replaced:
        "The replacement document has been submitted for review.",

    deleteError:
        "We could not delete this document. Its current review state may not allow deletion.",

    deleted:
        "The document has been deleted.",

    replacementRequired:
        "This document needs to be replaced. Please upload a clearer or more suitable document for review.",

    onHold:
        "This document is on hold. Review the safe message for any action required.",

    rejected:
        "This document was not approved. Review the safe message and upload a replacement where permitted.",

    approved:
        "This document has been approved.",

    empty:
        "No documents have been uploaded yet. Upload the required documents to continue verification.",

    privateByDefault:
        "Documents are private and are available only through authorised platform workflows.",

    proofOfPaymentWarning:
        "Uploading proof of payment does not make a payment valid. The linked payment must still be reviewed and approved.",
} as const;

export function getDocumentTypeLabel(
    documentType: DocumentType,
): string {
    return (
        DOCUMENT_TYPE_OPTIONS.find(
            (option) => option.value === documentType,
        )?.label ?? documentType
    );
}

export function getDocumentReviewStatusLabel(
    reviewStatus: DocumentReviewStatus,
): string {
    return (
        DOCUMENT_REVIEW_STATUS_OPTIONS.find(
            (option) => option.value === reviewStatus,
        )?.label ?? reviewStatus
    );
}