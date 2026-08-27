"use client";

// File: app/documents/_components/documents-page-client.tsx

/**
 * Asancha Documents Page Client
 *
 * Purpose:
 * Displays active-profile-scoped document requirements, submitted documents,
 * approved documents, documents on hold, and documents requiring replacement.
 *
 * Responsibilities:
 * - Load the authenticated user's documents.
 * - Display document requirements and review summaries.
 * - Support safe status filtering.
 * - Link to upload, detail, and replacement routes.
 * - Display loading, error, and empty states.
 *
 * Security notes:
 * - Frontend document visibility does not authorise access.
 * - Backend ownership, active-profile, company-membership, verification,
 *   document-visibility, and lifecycle checks remain authoritative.
 * - Private storage URLs, ObjectIds, internal review notes, raw KYC files,
 *   provider payloads, and risk flags must never be rendered.
 */

import Link from "next/link";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import {
    useEffect,
    useRef,
    type ChangeEvent,
    type ReactNode,
} from "react";

import { useDocuments } from "../../../src/features/documents/hooks/use-documents";
import {
    DOCUMENT_PAGE_ROUTES,
    DOCUMENT_TYPE_OPTIONS,
} from "../../../src/features/documents/constants/documents.constants";
import type {
    DocumentRequirement,
    DocumentReviewStatus,
    DocumentSummary,
    DocumentType,
} from "../../../src/features/documents/types/documents.types";

const STATUS_OPTIONS: ReadonlyArray<{
    value: "" | DocumentReviewStatus;
    label: string;
}> = [
    {
        value: "",
        label: "All statuses",
    },
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
];

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

function formatDate(
    value: string | null,
): string {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        },
    );
}

function getStatusClassName(
    status: DocumentReviewStatus,
): string {
    switch (status) {
        case "approved":
            return "border-[var(--secondary)] text-[var(--foreground)]";

        case "rejected":
        case "replacement_required":
            return "border-[var(--destructive)] text-[var(--destructive)]";

        case "on_hold":
            return "border-[var(--warning)] text-[var(--foreground)]";

        case "pending":
        default:
            return "border-[var(--border)] text-[var(--muted-foreground)]";
    }
}

export function DocumentsPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasLoadedDocuments = useRef(false);
    const {
        documents,
        requirements,
        statusSummary,
        filters,
        pagination,

        isLoading,
        isRefreshing,
        isEmpty,

        errorMessage,
        successMessage,

        loadDocuments,
        refreshDocuments,
        setFilters,
        clearMessages,
    } = useDocuments();

    const requestedDocumentType =
        searchParams.get("documentType");
    const initialDocumentType =
        DOCUMENT_TYPE_OPTIONS.some(
            (option) =>
                option.value === requestedDocumentType,
        )
            ? (requestedDocumentType as DocumentType)
            : "";

    useEffect((): void => {
        if (hasLoadedDocuments.current) {
            return;
        }

        hasLoadedDocuments.current = true;

        void loadDocuments({
            documentTypes: initialDocumentType
                ? [initialDocumentType]
                : [],
        });
    }, [initialDocumentType, loadDocuments]);

    const activeReviewStatus =
        filters.reviewStatuses[0] ?? "";
    const activeDocumentType =
        filters.documentTypes[0] ??
        initialDocumentType;

    const handleDocumentTypeChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const documentType = event.target.value as
            | DocumentType
            | "";
        const nextDocumentTypes = documentType
            ? [documentType]
            : [];
        const nextSearchParams = new URLSearchParams(
            searchParams.toString(),
        );

        if (documentType) {
            nextSearchParams.set(
                "documentType",
                documentType,
            );
        } else {
            nextSearchParams.delete("documentType");
        }

        setFilters({
            documentTypes: nextDocumentTypes,
            page: 1,
        });
        void loadDocuments({
            documentTypes: nextDocumentTypes,
            page: 1,
        });

        const queryString = nextSearchParams.toString();

        router.replace(
            queryString
                ? `${DOCUMENT_PAGE_ROUTES.root}?${queryString}`
                : DOCUMENT_PAGE_ROUTES.root,
            { scroll: false },
        );
    };

    const handleStatusChange = (
        event: ChangeEvent<HTMLSelectElement>,
    ): void => {
        const status =
            event.target.value as
                | DocumentReviewStatus
                | "";

        setFilters({
            reviewStatuses: status ? [status] : [],

            page: 1,
        });

        void loadDocuments({
            reviewStatuses: status ? [status] : [],

            page: 1,
        });
    };

    const handlePageChange = (
        nextPage: number,
    ): void => {
        setFilters({
            page: nextPage,
        });

        void loadDocuments({
            page: nextPage,
        });
    };

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                        Verification documents
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight">
                        Documents
                    </h1>

                    <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                        Review required documents,
                        uploaded documents, approval
                        states, correction requests, and
                        replacement requirements for your
                        active business profile.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Link
                        href={DOCUMENT_PAGE_ROUTES.uploadMultiple}
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                    >
                        Upload multiple
                    </Link>

                    <Link
                        href={DOCUMENT_PAGE_ROUTES.upload}
                        className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                    >
                        Upload document
                    </Link>
                </div>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Sensitive documents are private and are
                only available through authorised actions. Uploading
                proof of payment does not approve or
                validate a payment.
            </div>

            {errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 flex items-start justify-between gap-4 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    <span>{errorMessage}</span>

                    <button
                        type="button"
                        onClick={clearMessages}
                        className="font-semibold underline"
                    >
                        Dismiss
                    </button>
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 flex items-start justify-between gap-4 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm"
                >
                    <span>{successMessage}</span>

                    <button
                        type="button"
                        onClick={clearMessages}
                        className="font-semibold underline"
                    >
                        Dismiss
                    </button>
                </div>
            ) : null}

            {statusSummary ? (
                <section
                    aria-labelledby="document-status-summary-heading"
                    className="mt-6"
                >
                    <h2
                        id="document-status-summary-heading"
                        className="text-xl font-bold"
                    >
                        Document status
                    </h2>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {[
                            {
                                label: "Total",
                                value:
                                    statusSummary.required,
                            },
                            {
                                label: "Pending",
                                value:
                                    statusSummary.pending,
                            },
                            {
                                label: "Approved",
                                value:
                                    statusSummary.approved,
                            },
                            {
                                label: "On hold",
                                value:
                                    statusSummary.onHold,
                            },
                            {
                                label:
                                    "Needs replacement",
                                value:
                                    statusSummary.replacementRequired,
                            },
                        ].map(
                            (
                                item,
                            ): ReactNode => (
                                <article
                                    key={item.label}
                                    className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <p className="text-sm text-[var(--muted-foreground)]">
                                        {item.label}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold">
                                        {item.value}
                                    </p>
                                </article>
                            ),
                        )}
                    </div>
                </section>
            ) : null}

            <section
                aria-labelledby="document-requirements-heading"
                className="mt-8"
            >
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2
                            id="document-requirements-heading"
                            className="text-xl font-bold"
                        >
                            Required documents
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            Requirements are based on your
                            active profile and current
                            verification state.
                        </p>
                    </div>
                </div>

                {requirements.length > 0 ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {requirements.map(
                            (
                                requirement:
                                    DocumentRequirement,
                            ): ReactNode => (
                                <article
                                    key={
                                        requirement.requirementKey
                                    }
                                    className="rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold">
                                                {
                                                    requirement.title
                                                }
                                            </h3>

                                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                                                {formatValue(
                                                    requirement.documentType,
                                                )}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                                requirement.status ===
                                                "approved"
                                                    ? "border-[var(--secondary)]"
                                                    : "border-[var(--border)] text-[var(--muted-foreground)]"
                                            }`}
                                        >
                                            {requirement.status ===
                                            "approved"
                                                ? "Completed"
                                                : formatValue(
                                                      requirement.status,
                                                  )}
                                        </span>
                                    </div>

                                    {requirement.description ? (
                                        <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                            {
                                                requirement.description
                                            }
                                        </p>
                                    ) : null}

                                    {requirement.safeUserMessage ? (
                                        <p className="mt-3 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                            {
                                                requirement.safeUserMessage
                                            }
                                        </p>
                                    ) : null}

                                    {requirement.status !==
                                        "approved" &&
                                    requirement.uploadPath ? (
                                        <Link
                                            href={
                                                requirement.uploadPath
                                            }
                                            className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                        >
                                            Upload document
                                        </Link>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                ) : (
                    <p className="mt-4 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm text-[var(--muted-foreground)]">
                        There are no outstanding document
                        requirements for the active
                        profile.
                    </p>
                )}
            </section>

            <section
                aria-labelledby="submitted-documents-heading"
                className="mt-8"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2
                            id="submitted-documents-heading"
                            className="text-xl font-bold"
                        >
                            Submitted documents
                        </h2>

                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            View the safe status and
                            available actions for each
                            submitted document.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="document-type-filter"
                                className="text-sm font-semibold"
                            >
                                Filter by type
                            </label>

                            <select
                                id="document-type-filter"
                                value={activeDocumentType}
                                onChange={handleDocumentTypeChange}
                                className="mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                            >
                                <option value="">
                                    All document types
                                </option>
                                {DOCUMENT_TYPE_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="document-status-filter"
                                className="text-sm font-semibold"
                            >
                                Filter by status
                            </label>

                            <select
                                id="document-status-filter"
                                value={
                                    activeReviewStatus
                                }
                                onChange={
                                    handleStatusChange
                                }
                                className="mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                            >
                                {STATUS_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div
                        aria-busy="true"
                        className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                    >
                        {Array.from({
                            length: 6,
                        }).map(
                            (
                                _value: unknown,
                                index: number,
                            ): ReactNode => (
                                <div
                                    key={index}
                                    className="h-64 animate-pulse rounded-[var(--asancha-radius-lg)] bg-[var(--muted)]"
                                />
                            ),
                        )}
                    </div>
                ) : null}

                {!isLoading &&
                (isEmpty ||
                    documents.length === 0) ? (
                    <div className="mt-5 rounded-[var(--asancha-radius-xl)] border border-dashed border-[var(--border)] p-8 text-center">
                        <h3 className="text-xl font-bold">
                            No documents have been
                            uploaded yet
                        </h3>

                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
                            Upload the required documents
                            to continue verification and
                            unlock eligible profile
                            actions.
                        </p>

                        <Link
                            href="/documents/upload"
                            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                        >
                            Upload document
                        </Link>
                    </div>
                ) : null}

                {!isLoading &&
                documents.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {documents.map(
                            (
                                document:
                                    DocumentSummary,
                            ): ReactNode => (
                                <article
                                    key={
                                        document.documentPublicId
                                    }
                                    className="flex flex-col rounded-[var(--asancha-radius-lg)] border border-[var(--border)] bg-[var(--card)] p-5"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                                                {formatValue(
                                                    document.documentType,
                                                )}
                                            </p>

                                            <h3 className="mt-1 font-bold">
                                                {
                                                    document.displayName
                                                }
                                            </h3>
                                        </div>

                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClassName(
                                                document.reviewStatus,
                                            )}`}
                                        >
                                            {formatValue(
                                                document.reviewStatus,
                                            )}
                                        </span>
                                    </div>

                                    {document.relatedResource
                                        .displayLabel ? (
                                        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                                            Related to:{" "}
                                            <strong className="text-[var(--foreground)]">
                                                {
                                                    document
                                                        .relatedResource
                                                        .displayLabel
                                                }
                                            </strong>
                                        </p>
                                    ) : null}

                                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                                        Uploaded:{" "}
                                        {formatDate(
                                            document.uploadedAt,
                                        )}
                                    </p>

                                    {document.safeUserMessage ? (
                                        <p className="mt-4 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm leading-6 text-[var(--muted-foreground)]">
                                            {
                                                document.safeUserMessage
                                            }
                                        </p>
                                    ) : null}

                                    {document.reviewStatus ===
                                    "replacement_required" ? (
                                        <p className="mt-3 text-sm font-semibold text-[var(--destructive)]">
                                            This document needs to
                                            be replaced. Please
                                            upload a clearer or more
                                            suitable document for
                                            review.
                                        </p>
                                    ) : null}

                                    <div className="mt-auto flex flex-wrap gap-2 pt-5">
                                        {document.viewingAllowed ? (
                                            <Link
                                                href={`/documents/${encodeURIComponent(
                                                    document.documentPublicId,
                                                )}`}
                                                className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                                            >
                                                View
                                            </Link>
                                        ) : null}

                                        {document.replacementAllowed ? (
                                            <Link
                                                href={`/documents/${encodeURIComponent(
                                                    document.documentPublicId,
                                                )}/replace`}
                                                className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                                            >
                                                Replace
                                            </Link>
                                        ) : null}
                                    </div>
                                </article>
                            ),
                        )}
                    </div>
                ) : null}

                {pagination &&
                pagination.totalPages > 1 ? (
                    <nav
                        aria-label="Document pagination"
                        className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5"
                    >
                        <button
                            type="button"
                            disabled={
                                !pagination.hasPreviousPage ||
                                isRefreshing
                            }
                            onClick={(): void =>
                                handlePageChange(
                                    pagination.page - 1,
                                )
                            }
                            className="min-h-10 rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-[var(--muted-foreground)]">
                            Page {pagination.page} of{" "}
                            {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={
                                !pagination.hasNextPage ||
                                isRefreshing
                            }
                            onClick={(): void =>
                                handlePageChange(
                                    pagination.page + 1,
                                )
                            }
                            className="min-h-10 rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </nav>
                ) : null}

                <button
                    type="button"
                    disabled={isRefreshing}
                    onClick={(): void => {
                        void refreshDocuments();
                    }}
                    className="mt-5 text-sm font-semibold text-[var(--primary)] hover:underline disabled:opacity-50"
                >
                    {isRefreshing
                        ? "Refreshing…"
                        : "Refresh documents"}
                </button>
            </section>
        </main>
    );
}
