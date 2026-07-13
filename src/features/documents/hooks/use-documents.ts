"use client";

// File: src/features/documents/hooks/use-documents.ts

/**
 * Asancha Documents Hook
 *
 * Purpose:
 * Provides authenticated document screens with document list, requirement,
 * status, detail, upload, replacement, deletion, filter, pagination, and
 * request state.
 *
 * Responsibilities:
 * - Load active-profile-scoped documents and requirements.
 * - Load one safe document detail record.
 * - Upload new documents.
 * - Replace eligible documents while preserving version history.
 * - Delete eligible documents.
 * - Maintain filter and pagination state.
 * - Expose safe success and error messages.
 *
 * Security notes:
 * - This hook stores safe document metadata in component memory only.
 * - It must not store raw document contents after upload, storage keys,
 *   provider secrets, private URLs, staff notes, risk flags, or ObjectIds.
 * - Client-side action flags do not authorize document operations.
 * - Backend checks remain final.
 */

import {
    useCallback,
    useRef,
    useState,
} from "react";

import { documentsApi } from "../api/documents.api";
import {
    DEFAULT_DOCUMENT_FILTERS,
    DOCUMENT_SAFE_MESSAGES,
} from "../constants/documents.constants";
import type {
    DeleteDocumentResult,
    DocumentCollection,
    DocumentDetail,
    DocumentFilters,
    DocumentSummary,
    DocumentsHookState,
    DocumentUploadPayload,
    DocumentUploadResult,
    ReplaceDocumentPayload,
    ReplaceDocumentResult,
    UseDocumentsResult,
} from "../types/documents.types";

const INITIAL_DOCUMENTS_STATE: DocumentsHookState = {
    requestState: "idle",

    documents: [],
    selectedDocument: null,
    requirements: [],
    statusSummary: null,

    filters: DEFAULT_DOCUMENT_FILTERS,
    pagination: null,

    errorMessage: null,
    successMessage: null,

    isLoading: false,
    isRefreshing: false,
    isUploading: false,
    isReplacing: false,
    isDeleting: false,
    isEmpty: false,
};

function replaceDocumentSummary(
    documents: DocumentSummary[],
    document: DocumentSummary,
): DocumentSummary[] {
    const exists = documents.some(
        (currentDocument) =>
            currentDocument.documentPublicId ===
            document.documentPublicId,
    );

    if (!exists) {
        return [document, ...documents];
    }

    return documents.map((currentDocument) =>
        currentDocument.documentPublicId ===
            document.documentPublicId
            ? document
            : currentDocument,
    );
}

function applyReplacementResult(
    documents: DocumentSummary[],
    result: ReplaceDocumentResult,
): DocumentSummary[] {
    const withoutPreviousDuplicate =
        documents.filter(
            (document) =>
                document.documentPublicId !==
                result.replacementDocument.documentPublicId,
        );

    const updatedDocuments =
        withoutPreviousDuplicate.map((document) =>
            document.documentPublicId ===
                result.previousDocument.documentPublicId
                ? result.previousDocument
                : document,
        );

    return [
        result.replacementDocument,
        ...updatedDocuments,
    ];
}

export function useDocuments(): UseDocumentsResult {
    const [hookState, setHookState] =
        useState<DocumentsHookState>(
            INITIAL_DOCUMENTS_STATE,
        );

    const filtersRef = useRef<DocumentFilters>(
        DEFAULT_DOCUMENT_FILTERS,
    );

    const applyFilters = useCallback(
        (filters: DocumentFilters): void => {
            filtersRef.current = filters;

            setHookState((currentState) => ({
                ...currentState,
                filters,
            }));
        },
        [],
    );

    const setError = useCallback(
        (message: string): void => {
            setHookState((currentState) => ({
                ...currentState,

                requestState: "error",

                errorMessage: message,
                successMessage: null,

                isLoading: false,
                isRefreshing: false,
                isUploading: false,
                isReplacing: false,
                isDeleting: false,
            }));
        },
        [],
    );

    const loadDocuments = useCallback(
        async (
            filters?: Partial<DocumentFilters>,
        ): Promise<DocumentCollection | null> => {
            const nextFilters: DocumentFilters = {
                ...filtersRef.current,
                ...filters,
                page: filters?.page ?? 1,
            };

            applyFilters(nextFilters);

            setHookState((currentState) => ({
                ...currentState,

                requestState: "loading",

                isLoading: true,
                isRefreshing: false,
                isEmpty: false,

                errorMessage: null,
                successMessage: null,
            }));

            try {
                const collection =
                    await documentsApi.getDocuments(
                        nextFilters,
                    );

                const noDocuments =
                    collection.items.length === 0;

                setHookState((currentState) => ({
                    ...currentState,

                    requestState: noDocuments
                        ? "empty"
                        : "success",

                    documents: collection.items,
                    requirements: collection.requirements,
                    statusSummary: collection.statusSummary,
                    pagination: collection.pagination,
                    filters: nextFilters,

                    isLoading: false,
                    isRefreshing: false,
                    isEmpty: noDocuments,

                    errorMessage: null,
                }));

                return collection;
            } catch {
                setError(
                    DOCUMENT_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        },
        [applyFilters, setError],
    );

    const refreshDocuments =
        useCallback(async (): Promise<DocumentCollection | null> => {
            setHookState((currentState) => ({
                ...currentState,

                requestState: "refreshing",

                isLoading: false,
                isRefreshing: true,

                errorMessage: null,
                successMessage: null,
            }));

            try {
                const collection =
                    await documentsApi.getDocuments(
                        filtersRef.current,
                    );

                const noDocuments =
                    collection.items.length === 0;

                setHookState((currentState) => ({
                    ...currentState,

                    requestState: noDocuments
                        ? "empty"
                        : "success",

                    documents: collection.items,
                    requirements: collection.requirements,
                    statusSummary: collection.statusSummary,
                    pagination: collection.pagination,

                    isRefreshing: false,
                    isEmpty: noDocuments,

                    errorMessage: null,
                }));

                return collection;
            } catch {
                setError(
                    DOCUMENT_SAFE_MESSAGES.loadError,
                );

                return null;
            }
        }, [setError]);

    const loadDocument = useCallback(
        async (
            documentPublicId: string,
        ): Promise<DocumentDetail | null> => {
            const normalizedPublicId =
                documentPublicId.trim();

            if (!normalizedPublicId) {
                setError(
                    DOCUMENT_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }

            setHookState((currentState) => ({
                ...currentState,

                requestState: "loading",
                isLoading: true,

                errorMessage: null,
                successMessage: null,
            }));

            try {
                const document =
                    await documentsApi.getDocument(
                        normalizedPublicId,
                    );

                setHookState((currentState) => ({
                    ...currentState,

                    requestState: "success",

                    selectedDocument: document,

                    documents: replaceDocumentSummary(
                        currentState.documents,
                        document,
                    ),

                    isLoading: false,
                    errorMessage: null,
                }));

                return document;
            } catch {
                setError(
                    DOCUMENT_SAFE_MESSAGES.detailLoadError,
                );

                return null;
            }
        },
        [setError],
    );

    const uploadDocument = useCallback(
        async (
            payload: DocumentUploadPayload,
        ): Promise<DocumentUploadResult> => {
            setHookState((currentState) => ({
                ...currentState,

                requestState: "uploading",
                isUploading: true,

                errorMessage: null,
                successMessage: null,
            }));

            try {
                const result =
                    await documentsApi.uploadDocument(
                        payload,
                    );

                setHookState((currentState) => ({
                    ...currentState,

                    requestState: "success",

                    documents: replaceDocumentSummary(
                        currentState.documents,
                        result.document,
                    ),

                    selectedDocument: result.document,

                    isUploading: false,
                    isEmpty: false,

                    errorMessage: null,

                    successMessage:
                        result.message ||
                        DOCUMENT_SAFE_MESSAGES.uploaded,
                }));

                return result;
            } catch {
                setError(
                    DOCUMENT_SAFE_MESSAGES.uploadError,
                );

                throw new Error(
                    DOCUMENT_SAFE_MESSAGES.uploadError,
                );
            }
        },
        [setError],
    );

    const replaceDocument = useCallback(
        async (
            documentPublicId: string,
            payload: ReplaceDocumentPayload,
        ): Promise<ReplaceDocumentResult> => {
            setHookState((currentState) => ({
                ...currentState,

                requestState: "replacing",
                isReplacing: true,

                errorMessage: null,
                successMessage: null,
            }));

            try {
                const result =
                    await documentsApi.replaceDocument(
                        documentPublicId,
                        payload,
                    );

                setHookState((currentState) => ({
                    ...currentState,

                    requestState: "success",

                    documents: applyReplacementResult(
                        currentState.documents,
                        result,
                    ),

                    selectedDocument:
                        result.replacementDocument,

                    isReplacing: false,
                    isEmpty: false,

                    errorMessage: null,

                    successMessage:
                        result.message ||
                        DOCUMENT_SAFE_MESSAGES.replaced,
                }));

                return result;
            } catch {
                setError(
                    DOCUMENT_SAFE_MESSAGES.replacementError,
                );

                throw new Error(
                    DOCUMENT_SAFE_MESSAGES.replacementError,
                );
            }
        },
        [setError],
    );

    const deleteDocument = useCallback(
        async (
            documentPublicId: string,
        ): Promise<DeleteDocumentResult> => {
            setHookState((currentState) => ({
                ...currentState,

                requestState: "deleting",
                isDeleting: true,

                errorMessage: null,
                successMessage: null,
            }));

            try {
                const result =
                    await documentsApi.deleteDocument(
                        documentPublicId,
                    );

                setHookState((currentState) => {
                    const nextDocuments =
                        currentState.documents.filter(
                            (document) =>
                                document.documentPublicId !==
                                result.documentPublicId,
                        );

                    return {
                        ...currentState,

                        requestState: "success",

                        documents: nextDocuments,

                        selectedDocument:
                            currentState.selectedDocument
                                ?.documentPublicId ===
                                result.documentPublicId
                                ? null
                                : currentState.selectedDocument,

                        isDeleting: false,
                        isEmpty:
                            nextDocuments.length === 0,

                        errorMessage: null,
                        successMessage:
                            DOCUMENT_SAFE_MESSAGES.deleted,
                    };
                });

                return result;
            } catch {
                setError(
                    DOCUMENT_SAFE_MESSAGES.deleteError,
                );

                throw new Error(
                    DOCUMENT_SAFE_MESSAGES.deleteError,
                );
            }
        },
        [setError],
    );

    const setFilters = useCallback(
        (
            filters: Partial<DocumentFilters>,
        ): void => {
            const filterKeys = Object.keys(filters);

            const changesSearchCriteria =
                filterKeys.some(
                    (key) =>
                        key !== "page" &&
                        key !== "pageSize",
                );

            const nextFilters: DocumentFilters = {
                ...filtersRef.current,
                ...filters,

                page:
                    filters.page ??
                    (changesSearchCriteria
                        ? 1
                        : filtersRef.current.page),
            };

            applyFilters(nextFilters);
        },
        [applyFilters],
    );

    const replaceFilters = useCallback(
        (filters: DocumentFilters): void => {
            applyFilters(filters);
        },
        [applyFilters],
    );

    const resetFilters = useCallback((): void => {
        const nextFilters = {
            ...DEFAULT_DOCUMENT_FILTERS,
        };

        applyFilters(nextFilters);

        setHookState((currentState) => ({
            ...currentState,

            requestState: "idle",

            documents: [],
            pagination: null,

            isEmpty: false,

            errorMessage: null,
            successMessage: null,
        }));
    }, [applyFilters]);

    const clearSelectedDocument =
        useCallback((): void => {
            setHookState((currentState) => ({
                ...currentState,
                selectedDocument: null,
            }));
        }, []);

    const clearMessages =
        useCallback((): void => {
            setHookState((currentState) => ({
                ...currentState,

                requestState:
                    currentState.documents.length > 0 ||
                        currentState.selectedDocument
                        ? "success"
                        : "idle",

                errorMessage: null,
                successMessage: null,
            }));
        }, []);

    const reset = useCallback((): void => {
        filtersRef.current = {
            ...DEFAULT_DOCUMENT_FILTERS,
        };

        setHookState({
            ...INITIAL_DOCUMENTS_STATE,

            filters: {
                ...DEFAULT_DOCUMENT_FILTERS,
            },
        });
    }, []);

    return {
        ...hookState,

        loadDocuments,
        refreshDocuments,
        loadDocument,

        uploadDocument,
        replaceDocument,
        deleteDocument,

        setFilters,
        replaceFilters,
        resetFilters,

        clearSelectedDocument,
        clearMessages,
        reset,
    };
}