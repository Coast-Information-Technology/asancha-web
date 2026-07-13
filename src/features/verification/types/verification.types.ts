// File: src/features/verification/types/verification.types.ts

/**
 * Asancha Verification Types
 *
 * Purpose:
 * Defines authenticated public-user frontend contracts for viewing
 * verification reviews, understanding requirements, and responding to safe
 * correction or information requests.
 *
 * Responsibilities:
 * - Define verification review lifecycle states.
 * - Define safe subject and related-resource summaries.
 * - Define document requirements and correction requests.
 * - Define user response and review-history contracts.
 * - Define verification collections, filters, pagination, and hook state.
 *
 * Security notes:
 * - Verification approval and rejection remain staff-only decisions.
 * - Frontend routes and API payloads must use public IDs only.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Internal staff notes, private KYC notes, risk ratings, risk flags, raw
 *   source-of-funds analysis, sanctions results, provider payloads, and private
 *   document URLs must never be exposed.
 * - Dashboard access may remain available while verification is pending, but
 *   sensitive actions may remain locked.
 * - Backend account, profile, company, document, policy, ownership, lifecycle,
 *   and permission checks remain final.
 */

export type VerificationReviewStatus =
    | "pending"
    | "in_review"
    | "on_hold"
    | "correction_required"
    | "approved"
    | "rejected"
    | "cancelled";

export type VerificationSubjectType =
    | "user"
    | "general_profile"
    | "business_profile"
    | "company"
    | "property"
    | "listing"
    | "service_provider"
    | "api_partner_application";

export type VerificationType =
    | "identity"
    | "address"
    | "business_profile"
    | "company"
    | "property_ownership"
    | "authority_to_represent"
    | "property_sourcer"
    | "service_provider"
    | "api_partner"
    | "proof_of_funds"
    | "source_of_funds"
    | "listing_compliance"
    | "other";

export type VerificationKycStatus =
    | "not_started"
    | "pending"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "replacement_required";

export type VerificationSourceOfFundsStatus =
    | "not_required"
    | "not_provided"
    | "declared"
    | "document_submitted"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold";

export type VerificationDocumentStatus =
    | "missing"
    | "pending"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "replacement_required";

export type VerificationRequirementStatus =
    | "not_started"
    | "pending"
    | "completed"
    | "needs_attention";

export type VerificationResponseType =
    | "information"
    | "correction"
    | "document_uploaded"
    | "document_replaced"
    | "declaration"
    | "other";

export type VerificationRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "responding"
    | "success"
    | "empty"
    | "error";

export type VerificationSort =
    | "newest"
    | "oldest"
    | "updated_recently"
    | "status"
    | "verification_type";

export interface VerificationSubjectSummary {
    subjectType: VerificationSubjectType;
    subjectPublicId: string;
    displayName: string;
    profileType: string | null;
    companyPublicId: string | null;
    companyName: string | null;
    detailPath: string | null;
}

export interface VerificationRelatedResource {
    relatedType: string;
    relatedPublicId: string;
    displayLabel: string;
    detailPath: string | null;
}

export interface VerificationDocumentRequirement {
    requirementKey: string;
    documentType: string;
    title: string;
    description: string | null;

    required: boolean;
    status: VerificationDocumentStatus;

    documentPublicId: string | null;
    uploadPath: string | null;
    replacementPath: string | null;

    safeUserMessage: string | null;
}

export interface VerificationCorrectionRequest {
    correctionKey: string;
    title: string;
    message: string;

    fieldPath: string | null;
    documentPublicId: string | null;

    actionLabel: string | null;
    actionPath: string | null;

    resolved: boolean;
    requestedAt: string;
    resolvedAt: string | null;
}

export interface VerificationRequirementSummary {
    total: number;
    completed: number;
    pending: number;
    missing: number;
    needsAttention: number;
}

export interface VerificationDocumentSummary {
    required: number;
    submitted: number;
    inReview: number;
    approved: number;
    rejected: number;
    onHold: number;
    replacementRequired: number;
}

export interface VerificationActionState {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface VerificationTimelineEvent {
    eventPublicId: string;
    eventType:
    | "submitted"
    | "review_started"
    | "placed_on_hold"
    | "correction_requested"
    | "user_responded"
    | "document_updated"
    | "approved"
    | "rejected"
    | "cancelled"
    | "status_updated";

    title: string;
    description: string | null;
    createdAt: string;
}

export interface VerificationUserResponse {
    responsePublicId: string;
    responseType: VerificationResponseType;
    message: string | null;
    relatedDocumentPublicIds: string[];
    submittedAt: string;
}

export interface VerificationReviewSummary {
    verificationReviewPublicId: string;
    verificationReference: string;

    verificationType: VerificationType;
    customVerificationType: string | null;
    status: VerificationReviewStatus;

    subject: VerificationSubjectSummary;
    relatedResource: VerificationRelatedResource | null;

    kycStatus: VerificationKycStatus;
    sourceOfFundsStatus: VerificationSourceOfFundsStatus;

    requirementSummary: VerificationRequirementSummary;
    documentSummary: VerificationDocumentSummary;

    correctionRequired: boolean;
    correctionCount: number;

    safeUserMessage: string | null;
    nextActionLabel: string | null;
    nextActionPath: string | null;

    canRespond: boolean;

    createdAt: string;
    submittedAt: string | null;
    updatedAt: string;
    completedAt: string | null;
}

export interface VerificationReviewDetail
    extends VerificationReviewSummary {
    description: string | null;

    documentRequirements: VerificationDocumentRequirement[];
    correctionRequests: VerificationCorrectionRequest[];
    actions: VerificationActionState[];

    userResponses: VerificationUserResponse[];
    timeline: VerificationTimelineEvent[];

    latestUserResponseAt: string | null;
    reviewStartedAt: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    onHoldAt: string | null;
}

export interface VerificationFilters {
    search: string;
    statuses: VerificationReviewStatus[];
    verificationTypes: VerificationType[];
    subjectTypes: VerificationSubjectType[];

    correctionRequired: boolean | null;
    canRespond: boolean | null;

    sort: VerificationSort;
    page: number;
    pageSize: number;
}

export interface VerificationQuery {
    search?: string;
    statuses?: VerificationReviewStatus[];
    verificationTypes?: VerificationType[];
    subjectTypes?: VerificationSubjectType[];

    correctionRequired?: boolean;
    canRespond?: boolean;

    sort?: VerificationSort;
    page?: number;
    pageSize?: number;
}

export interface VerificationPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface VerificationCollection {
    items: VerificationReviewSummary[];
    pagination: VerificationPagination;
    appliedFilters: Partial<VerificationFilters>;
}

export interface VerificationResponseValues {
    responseType: VerificationResponseType;
    message: string | null;
    relatedDocumentPublicIds: string[];

    informationAccurateConfirmed: true;
    responseAuthorityConfirmed: true;
}

export interface SubmitVerificationResponsePayload {
    data: VerificationResponseValues;
}

export interface SubmitVerificationResponseResult {
    verificationReview: VerificationReviewDetail;
    response: VerificationUserResponse;
    submitted: true;
    nextPath: string;
    message: string;
}

export interface VerificationHookState {
    requestState: VerificationRequestState;

    reviews: VerificationReviewSummary[];
    selectedReview: VerificationReviewDetail | null;

    filters: VerificationFilters;
    pagination: VerificationPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isResponding: boolean;
    isEmpty: boolean;
}

export interface VerificationHookActions {
    loadVerificationReviews: (
        filters?: Partial<VerificationFilters>,
    ) => Promise<VerificationCollection | null>;

    refreshVerificationReviews: () => Promise<VerificationCollection | null>;

    loadVerificationReview: (
        verificationReviewPublicId: string,
    ) => Promise<VerificationReviewDetail | null>;

    submitVerificationResponse: (
        verificationReviewPublicId: string,
        payload: SubmitVerificationResponsePayload,
    ) => Promise<SubmitVerificationResponseResult>;

    setFilters: (
        filters: Partial<VerificationFilters>,
    ) => void;

    replaceFilters: (
        filters: VerificationFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedReview: () => void;
    clearMessages: () => void;
    reset: () => void;
}

export type UseVerificationResult = VerificationHookState &
    VerificationHookActions;