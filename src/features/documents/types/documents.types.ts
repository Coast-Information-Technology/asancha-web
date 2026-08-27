// File: src/features/documents/types/documents.types.ts

/**
 * Asancha Document Types
 *
 * Purpose:
 * Defines authenticated public-user frontend contracts for uploading,
 * viewing, filtering, replacing, and deleting eligible document records.
 *
 * Responsibilities:
 * - Define supported document types and review statuses.
 * - Define document ownership and related-resource contexts.
 * - Define safe document metadata shown to users.
 * - Define upload and replacement payloads.
 * - Define document collections, requirements, pagination, and actions.
 * - Define the state and actions exposed by useDocuments.
 *
 * Security notes:
 * - Documents are private by default.
 * - Frontend routes and API payloads must use public IDs only.
 * - MongoDB ObjectIds must never appear in these contracts.
 * - Storage keys, private provider URLs, internal staff notes, reviewer private
 *   metadata, risk flags, token values, and document binary contents must not
 *   be exposed through normal document responses.
 * - A proof-of-payment document does not make a payment valid.
 * - Backend ownership, active-profile, company, policy, verification, payment,
 *   related-resource, replacement, and deletion checks remain final.
 */

export type PropertyDocumentType =
    | "proof_of_ownership"
    | "property_photos"
    | "floor_plan"
    | "epc_certificate"
    | "valuation_report"
    | "title_register"
    | "title_plan"
    | "survey_report"
    | "building_safety_certificate"
    | "planning_document"
    | "lease_document"
    | "tenancy_document"
    | "service_charge_statement";

export type DocumentType =
    | PropertyDocumentType
    | "proof_of_funds"
    | "kyc_id"
    | "identity_document"
    | "proof_of_address"
    | "property_ownership_proof"
    | "authority_to_represent"
    | "contract"
    | "deal_pack"
    | "compliance_document"
    | "company_registration"
    | "sourcer_verification"
    | "service_provider_verification"
    | "api_partner_verification"
    | "proof_of_payment"
    | "source_of_funds"
    | "other";

export type DocumentReviewStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "on_hold"
    | "replacement_required";

export type DocumentSource =
    | "user_upload"
    | "replacement"
    | "system_generated"
    | "staff_upload"
    | "api_partner_upload";

export type DocumentRelatedType =
    | "general_profile"
    | "business_profile"
    | "company"
    | "property"
    | "listing"
    | "verification_review"
    | "payment"
    | "reservation"
    | "booking"
    | "api_partner_application"
    | "api_client"
    | "other";

export type DocumentRequirementStatus =
    | "missing"
    | "submitted"
    | "in_review"
    | "approved"
    | "rejected"
    | "on_hold"
    | "replacement_required";

export type DocumentSort =
    | "newest"
    | "oldest"
    | "updated_recently"
    | "document_type"
    | "review_status";

export type DocumentRequestState =
    | "idle"
    | "loading"
    | "refreshing"
    | "uploading"
    | "replacing"
    | "deleting"
    | "success"
    | "empty"
    | "error";

export interface DocumentRelatedResource {
    relatedType: DocumentRelatedType;
    relatedPublicId: string | null;
    displayLabel: string;
    detailPath: string | null;
}

export interface DocumentFileMetadata {
    originalFileName: string;
    mimeType: string;
    fileSizeBytes: number;
    fileExtension: string | null;
}

export interface DocumentReplacementSummary {
    documentPublicId: string;
    reviewStatus: DocumentReviewStatus;
    uploadedAt: string;
    replacedAt: string | null;
}

export interface DocumentActionState {
    action: string;
    allowed: boolean;
    reason: string | null;
    actionLabel: string | null;
    actionPath: string | null;
}

export interface DocumentSummary {
    documentPublicId: string;
    documentType: DocumentType;
    customDocumentType: string | null;
    displayName: string;

    reviewStatus: DocumentReviewStatus;
    source: DocumentSource;

    relatedResource: DocumentRelatedResource;

    fileMetadata: DocumentFileMetadata;

    safeUserMessage: string | null;

    replacementAllowed: boolean;
    deletionAllowed: boolean;
    viewingAllowed: boolean;
    downloadingAllowed: boolean;

    replacedDocumentPublicId: string | null;
    replacementDocumentPublicId: string | null;
    isLatestVersion: boolean;

    uploadedAt: string;
    reviewedAt: string | null;
    updatedAt: string;
}

export interface DocumentDetail extends DocumentSummary {
    description: string | null;

    replacementHistory: DocumentReplacementSummary[];
    actions: DocumentActionState[];

    viewActionPath: string | null;
    downloadActionPath: string | null;

    expiresAt: string | null;
}

export interface DocumentRequirement {
    requirementKey: string;
    documentType: DocumentType;
    customDocumentType: string | null;
    title: string;
    description: string | null;

    relatedType: DocumentRelatedType;
    relatedPublicId: string | null;

    required: boolean;
    status: DocumentRequirementStatus;

    currentDocumentPublicId: string | null;
    uploadPath: string;
    safeUserMessage: string | null;
}

export interface DocumentStatusSummary {
    required: number;
    missing: number;
    pending: number;
    approved: number;
    rejected: number;
    onHold: number;
    replacementRequired: number;
}

export interface DocumentFilters {
    search: string;
    documentTypes: DocumentType[];
    reviewStatuses: DocumentReviewStatus[];
    relatedTypes: DocumentRelatedType[];

    relatedPublicId: string | null;
    replacementAllowed: boolean | null;
    isLatestVersion: boolean | null;

    sort: DocumentSort;
    page: number;
    pageSize: number;
}

export interface DocumentQuery {
    search?: string;
    documentTypes?: DocumentType[];
    reviewStatuses?: DocumentReviewStatus[];
    relatedTypes?: DocumentRelatedType[];

    relatedPublicId?: string;
    replacementAllowed?: boolean;
    isLatestVersion?: boolean;

    sort?: DocumentSort;
    page?: number;
    pageSize?: number;
}

export interface DocumentPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface DocumentCollection {
    items: DocumentSummary[];
    requirements: DocumentRequirement[];
    statusSummary: DocumentStatusSummary;
    pagination: DocumentPagination;
    appliedFilters: Partial<DocumentFilters>;
}

export interface DocumentUploadValues {
    documentType: DocumentType;
    customDocumentType: string | null;

    relatedType: DocumentRelatedType;
    relatedPublicId: string | null;

    displayName: string;
    description: string | null;

    file: File;

    informationAccurateConfirmed: true;
    uploadAuthorityConfirmed: true;
}

export interface DocumentUploadPayload {
    data: DocumentUploadValues;
}

export interface DocumentUploadResult {
    document: DocumentDetail;
    uploaded: true;
    nextPath: string;
    message: string;
}

export interface PropertyDocumentUploadValues {
    documentType: PropertyDocumentType;
    file: File;
}

export interface PropertyDocumentUploadPayload {
    data: PropertyDocumentUploadValues;
}

export interface PropertyDocumentsUploadValues {
    documentType: PropertyDocumentType;
    files: File[];
}

export interface PropertyDocumentsUploadPayload {
    data: PropertyDocumentsUploadValues;
}

export interface PropertyDocumentsUploadResult {
    documents: DocumentDetail[];
    uploaded: true;
    uploadedCount: number;
    nextPath: string;
    message: string;
}

export interface DocumentReplacementValues {
    replacementReason: string;
    file: File;
    informationAccurateConfirmed: true;
}

export interface ReplaceDocumentPayload {
    data: DocumentReplacementValues;
}

export interface ReplaceDocumentResult {
    previousDocument: DocumentSummary;
    replacementDocument: DocumentDetail;
    replaced: true;
    nextPath: string;
    message: string;
}

export interface DeleteDocumentResult {
    documentPublicId: string;
    deleted: true;
}

export interface DocumentsHookState {
    requestState: DocumentRequestState;

    documents: DocumentSummary[];
    selectedDocument: DocumentDetail | null;
    requirements: DocumentRequirement[];
    statusSummary: DocumentStatusSummary | null;

    filters: DocumentFilters;
    pagination: DocumentPagination | null;

    errorMessage: string | null;
    successMessage: string | null;

    isLoading: boolean;
    isRefreshing: boolean;
    isUploading: boolean;
    isReplacing: boolean;
    isDeleting: boolean;
    isEmpty: boolean;
}

export interface DocumentsHookActions {
    loadDocuments: (
        filters?: Partial<DocumentFilters>,
    ) => Promise<DocumentCollection | null>;

    refreshDocuments: () => Promise<DocumentCollection | null>;

    loadDocument: (
        documentPublicId: string,
    ) => Promise<DocumentDetail | null>;

    uploadDocument: (
        payload: DocumentUploadPayload,
    ) => Promise<DocumentUploadResult>;

    uploadPropertyDocument: (
        payload: PropertyDocumentUploadPayload,
    ) => Promise<DocumentUploadResult>;

    uploadPropertyDocuments: (
        payload: PropertyDocumentsUploadPayload,
    ) => Promise<PropertyDocumentsUploadResult>;

    replaceDocument: (
        documentPublicId: string,
        payload: ReplaceDocumentPayload,
    ) => Promise<ReplaceDocumentResult>;

    deleteDocument: (
        documentPublicId: string,
    ) => Promise<DeleteDocumentResult>;

    setFilters: (
        filters: Partial<DocumentFilters>,
    ) => void;

    replaceFilters: (
        filters: DocumentFilters,
    ) => void;

    resetFilters: () => void;

    clearSelectedDocument: () => void;
    clearMessages: () => void;
    reset: () => void;
}

export type UseDocumentsResult = DocumentsHookState &
    DocumentsHookActions;
