"use client";

// File: app/documents/_components/document-detail-page-client.tsx

/**
 * Asancha Document Detail Page Client
 *
 * Purpose:
 * Displays one safe, authorised document detail record and its permitted
 * replacement history and actions.
 *
 * Security notes:
 * - Backend document ownership and view policy remain authoritative.
 * - Do not render private storage URLs directly.
 * - Downloads must use a short-lived, backend-authorised action route.
 * - Internal notes, private KYC notes, ObjectIds, risk flags, and file storage
 *   keys must never be displayed.
 */

import Link from "next/link";
import {
    useEffect,
    type ReactNode,
} from "react";

import { useDocuments } from "../../../src/features/documents/hooks/use-documents";
import type {
    DocumentReplacementSummary,
    DocumentReviewStatus,
} from "../../../src/features/documents/types/documents.types";

export interface DocumentDetailPageClientProps {
    documentPublicId: string;
}

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

function formatDateTime(
    value: string | null,
): string {
    if (!value) {
        return "Not available";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString(
        "en-GB",
    );
}

function getStatusClassName(
    status: DocumentReviewStatus,
): string {
    switch (status) {
        case "approved":
            return "border-[var(--secondary)]";

        case "rejected":
        case "replacement_required":
            return "border-[var(--destructive)] text-[var(--destructive)]";

        case "on_hold":
            return "border-[var(--warning)]";

        case "pending":
        default:
            return "border-[var(--border)] text-[var(--muted-foreground)]";
    }
}

export function DocumentDetailPageClient({
    documentPublicId,
}: DocumentDetailPageClientProps) {
    const {
        selectedDocument,
        isLoading,
        errorMessage,
        successMessage,

        loadDocument,
        deleteDocument,
        isDeleting,

        clearMessages,
        clearSelectedDocument,
    } = useDocuments();

    useEffect((): (() => void) => {
        void loadDocument(
            documentPublicId,
        );

        return (): void => {
            clearSelectedDocument();
        };
    }, [
        clearSelectedDocument,
        documentPublicId,
        loadDocument,
    ]);

    const handleDelete =
        async (): Promise<void> => {
            if (
                !selectedDocument?.deletionAllowed
            ) {
                return;
            }

            const confirmed =
                window.confirm(
                    "Delete this document? This action is subject to document policy and may not be available after review has started.",
                );

            if (!confirmed) {
                return;
            }

            await deleteDocument(
                selectedDocument.documentPublicId,
            );

            window.location.assign(
                "/documents",
            );
        };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-96 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
            </main>
        );
    }

    if (!selectedDocument) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div
                    role="alert"
                    className="rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-5 text-sm text-[var(--destructive)]"
                >
                    {errorMessage ??
                        "You do not have access to this document."}
                </div>

                <Link
                    href="/documents"
                    className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                >
                    Return to documents
                </Link>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                            selectedDocument.reviewStatus,
                        )}`}
                    >
                        {formatValue(
                            selectedDocument.reviewStatus,
                        )}
                    </span>

                    <h1 className="mt-3 text-3xl font-bold">
                        {
                            selectedDocument.displayName
                        }
                    </h1>

                    <p className="mt-2 text-[var(--muted-foreground)]">
                        {formatValue(
                            selectedDocument.documentType,
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {selectedDocument.viewingAllowed &&
                    selectedDocument.viewActionPath ? (
                        <Link
                            href={
                                selectedDocument.viewActionPath
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            View file
                        </Link>
                    ) : null}

                    {selectedDocument.downloadingAllowed &&
                    selectedDocument.downloadActionPath ? (
                        <Link
                            href={
                                selectedDocument.downloadActionPath
                            }
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Download
                        </Link>
                    ) : null}

                    {selectedDocument.replacementAllowed ? (
                        <Link
                            href={`/documents/${encodeURIComponent(
                                selectedDocument.documentPublicId,
                            )}/replace`}
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                        >
                            Replace document
                        </Link>
                    ) : null}
                </div>
            </header>

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

            {selectedDocument.safeUserMessage ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                    <strong className="text-[var(--foreground)]">
                        Review message:
                    </strong>{" "}
                    {
                        selectedDocument.safeUserMessage
                    }
                </div>
            ) : null}

            {selectedDocument.reviewStatus ===
            "replacement_required" ? (
                <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm leading-6 text-[var(--destructive)]">
                    This document needs to be replaced.
                    Please upload a clearer or more
                    suitable document for review.
                </div>
            ) : null}

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                <div className="grid gap-6">
                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Document information
                        </h2>

                        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Document type
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {formatValue(
                                        selectedDocument.documentType,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Review status
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {formatValue(
                                        selectedDocument.reviewStatus,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Related type
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {formatValue(
                                        selectedDocument
                                            .relatedResource
                                            .relatedType,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Related item
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {
                                        selectedDocument
                                            .relatedResource
                                            .displayLabel
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Uploaded
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {formatDateTime(
                                        selectedDocument.uploadedAt,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    Reviewed
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {formatDateTime(
                                        selectedDocument.reviewedAt,
                                    )}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    File name
                                </dt>

                                <dd className="mt-1 break-all font-semibold">
                                    {
                                        selectedDocument
                                            .fileMetadata
                                            .originalFileName
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-sm text-[var(--muted-foreground)]">
                                    File size
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {selectedDocument
                                        .fileMetadata
                                        .fileSizeBytes !== null
                                        ? `${(
                                              selectedDocument
                                                  .fileMetadata
                                                  .fileSizeBytes /
                                              1024 /
                                              1024
                                          ).toFixed(
                                              2,
                                          )} MB`
                                        : "Not available"}
                                </dd>
                            </div>
                        </dl>

                        {selectedDocument.description ? (
                            <div className="mt-6 border-t border-[var(--border)] pt-5">
                                <h3 className="font-bold">
                                    Description
                                </h3>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--muted-foreground)]">
                                    {
                                        selectedDocument.description
                                    }
                                </p>
                            </div>
                        ) : null}
                    </article>

                    <article className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                        <h2 className="text-xl font-bold">
                            Replacement history
                        </h2>

                        {selectedDocument
                            .replacementHistory
                            .length > 0 ? (
                            <ol className="mt-5 grid gap-4">
                                {selectedDocument.replacementHistory.map(
                                    (
                                        item:
                                            DocumentReplacementSummary,
                                    ): ReactNode => (
                                        <li
                                            key={
                                                item.documentPublicId
                                            }
                                            className="rounded-[var(--asancha-radius-md)] border border-[var(--border)] p-4"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold">
                                                        Document version
                                                    </p>

                                                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                                        Uploaded{" "}
                                                        {formatDateTime(
                                                            item.uploadedAt,
                                                        )}
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-xs font-semibold">
                                                    {formatValue(
                                                        item.reviewStatus,
                                                    )}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/documents/${encodeURIComponent(
                                                    item.documentPublicId,
                                                )}`}
                                                className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                                            >
                                                View version
                                            </Link>
                                        </li>
                                    ),
                                )}
                            </ol>
                        ) : (
                            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                                This document has no
                                replacement history.
                            </p>
                        )}
                    </article>
                </div>

                <aside className="grid content-start gap-6">
                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                        <h2 className="font-bold">
                            Available actions
                        </h2>

                        <div className="mt-4 grid gap-2">
                            {selectedDocument.replacementAllowed ? (
                                <Link
                                    href={`/documents/${encodeURIComponent(
                                        selectedDocument.documentPublicId,
                                    )}/replace`}
                                    className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
                                >
                                    Replace document
                                </Link>
                            ) : null}

                            <Link
                                href="/documents"
                                className="inline-flex min-h-10 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                            >
                                All documents
                            </Link>

                            {selectedDocument.deletionAllowed ? (
                                <button
                                    type="button"
                                    disabled={isDeleting}
                                    onClick={(): void => {
                                        void handleDelete();
                                    }}
                                    className="min-h-10 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] px-4 py-2 text-sm font-semibold text-[var(--destructive)] disabled:opacity-60"
                                >
                                    {isDeleting
                                        ? "Deleting…"
                                        : "Delete document"}
                                </button>
                            ) : null}
                        </div>
                    </section>

                    <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--muted)] p-5 text-sm leading-6 text-[var(--muted-foreground)]">
                        <h2 className="font-bold text-[var(--foreground)]">
                            Privacy
                        </h2>

                        <p className="mt-2">
                            Document access is logged
                            where required. File access
                            may use a short-lived
                            authorised link that should
                            not be shared.
                        </p>
                    </section>
                </aside>
            </section>
        </main>
    );
}
