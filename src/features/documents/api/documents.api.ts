// File: src/features/documents/api/documents.api.ts

/**
 * Asancha Documents API
 *
 * Purpose:
 * Provides typed authenticated API functions for current-user document
 * metadata, upload, read, replacement, and eligible deletion workflows.
 *
 * Responsibilities:
 * - Retrieve active-profile-scoped document collections.
 * - Retrieve one safe document record by public ID.
 * - Upload a document using multipart form data.
 * - Replace an eligible document using multipart form data.
 * - Delete an eligible document record.
 *
 * Security notes:
 * - All requests use authenticated API helpers.
 * - This module never calls staff document-review endpoints.
 * - Private storage keys and provider URLs must not be submitted or returned.
 * - Replacement creates a new document record and preserves lineage.
 * - Proof-of-payment upload does not mark a payment as paid.
 * - Backend ownership, relation, file, storage, replacement, verification,
 *   payment, profile, company, and lifecycle checks remain final.
 */

import {
    authApiDelete,
    authApiGet,
    authApiPost,
} from "../../../lib/api/auth-fetch";

import { DOCUMENTS_API_ENDPOINTS } from "../constants/documents.constants";
import type {
    DeleteDocumentResult,
    DocumentCollection,
    DocumentDetail,
    DocumentFilters,
    DocumentQuery,
    DocumentUploadPayload,
    DocumentUploadResult,
    ReplaceDocumentPayload,
    ReplaceDocumentResult,
} from "../types/documents.types";

function appendString(
    searchParams: URLSearchParams,
    key: string,
    value: string | null | undefined,
): void {
    const normalizedValue = value?.trim();

    if (normalizedValue) {
        searchParams.set(key, normalizedValue);
    }
}

function appendStringArray(
    searchParams: URLSearchParams,
    key: string,
    values: readonly string[] | undefined,
): void {
    if (!values?.length) {
        return;
    }

    for (const value of values) {
        const normalizedValue = value.trim();

        if (normalizedValue) {
            searchParams.append(key, normalizedValue);
        }
    }
}

function appendNumber(
    searchParams: URLSearchParams,
    key: string,
    value: number | undefined,
): void {
    if (
        value !== undefined &&
        Number.isFinite(value)
    ) {
        searchParams.set(key, String(value));
    }
}

function appendBoolean(
    searchParams: URLSearchParams,
    key: string,
    value: boolean | undefined,
): void {
    if (value !== undefined) {
        searchParams.set(key, String(value));
    }
}

function createDocumentQueryString(
    query: DocumentQuery | Partial<DocumentFilters>,
): string {
    const searchParams = new URLSearchParams();

    appendString(
        searchParams,
        "search",
        query.search,
    );

    appendStringArray(
        searchParams,
        "documentTypes",
        query.documentTypes,
    );

    appendStringArray(
        searchParams,
        "reviewStatuses",
        query.reviewStatuses,
    );

    appendStringArray(
        searchParams,
        "relatedTypes",
        query.relatedTypes,
    );

    appendString(
        searchParams,
        "relatedPublicId",
        query.relatedPublicId,
    );

    appendBoolean(
        searchParams,
        "replacementAllowed",
        query.replacementAllowed ?? undefined,
    );

    appendBoolean(
        searchParams,
        "isLatestVersion",
        query.isLatestVersion ?? undefined,
    );

    appendString(
        searchParams,
        "sort",
        query.sort,
    );

    appendNumber(
        searchParams,
        "page",
        query.page,
    );

    appendNumber(
        searchParams,
        "pageSize",
        query.pageSize,
    );

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : "";
}

function createDocumentUploadFormData(
    payload: DocumentUploadPayload,
): FormData {
    const formData = new FormData();
    const { data } = payload;

    formData.set("documentType", data.documentType);
    formData.set("displayName", data.displayName);
    formData.set("relatedType", data.relatedType);
    formData.set(
        "informationAccurateConfirmed",
        String(data.informationAccurateConfirmed),
    );
    formData.set(
        "uploadAuthorityConfirmed",
        String(data.uploadAuthorityConfirmed),
    );
    formData.set("file", data.file, data.file.name);

    if (data.customDocumentType) {
        formData.set(
            "customDocumentType",
            data.customDocumentType,
        );
    }

    if (data.relatedPublicId) {
        formData.set(
            "relatedPublicId",
            data.relatedPublicId,
        );
    }

    if (data.description) {
        formData.set("description", data.description);
    }

    return formData;
}

function createDocumentReplacementFormData(
    payload: ReplaceDocumentPayload,
): FormData {
    const formData = new FormData();
    const { data } = payload;

    formData.set(
        "replacementReason",
        data.replacementReason,
    );

    formData.set(
        "informationAccurateConfirmed",
        String(data.informationAccurateConfirmed),
    );

    formData.set("file", data.file, data.file.name);

    return formData;
}

async function getDocuments(
    query: DocumentQuery | Partial<DocumentFilters> = {},
): Promise<DocumentCollection> {
    const queryString =
        createDocumentQueryString(query);

    return authApiGet<DocumentCollection>(
        `${DOCUMENTS_API_ENDPOINTS.mine}${queryString}`,
    );
}

async function getDocument(
    documentPublicId: string,
): Promise<DocumentDetail> {
    return authApiGet<DocumentDetail>(
        DOCUMENTS_API_ENDPOINTS.document(
            documentPublicId,
        ),
    );
}

async function uploadDocument(
    payload: DocumentUploadPayload,
): Promise<DocumentUploadResult> {
    const formData =
        createDocumentUploadFormData(payload);

    return authApiPost<
        DocumentUploadResult,
        FormData
    >(
        DOCUMENTS_API_ENDPOINTS.upload,
        formData,
    );
}

async function replaceDocument(
    documentPublicId: string,
    payload: ReplaceDocumentPayload,
): Promise<ReplaceDocumentResult> {
    const formData =
        createDocumentReplacementFormData(payload);

    return authApiPost<
        ReplaceDocumentResult,
        FormData
    >(
        DOCUMENTS_API_ENDPOINTS.replace(
            documentPublicId,
        ),
        formData,
    );
}

async function deleteDocument(
    documentPublicId: string,
): Promise<DeleteDocumentResult> {
    return authApiDelete<DeleteDocumentResult>(
        DOCUMENTS_API_ENDPOINTS.document(
            documentPublicId,
        ),
    );
}

export const documentsApi = {
    getDocuments,
    getDocument,
    uploadDocument,
    replaceDocument,
    deleteDocument,
} as const;