"use client";

// File: app/documents/_components/document-replace-page-client.tsx

/**
 * Asancha Document Replacement Page Client
 *
 * Purpose:
 * Replaces an eligible document while preserving backend-controlled document
 * version and review history.
 *
 * Security notes:
 * - Replacement eligibility remains backend-controlled.
 * - Replacement must not overwrite or erase review and audit history.
 * - File validation in the browser is UX guidance only.
 * - Private file URLs, ObjectIds, internal notes, and provider data must not
 *   be exposed.
 */

import Link from "next/link";
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { useDocuments } from "../../../src/features/documents/hooks/use-documents";
import type {
    ReplaceDocumentPayload,
} from "../../../src/features/documents/types/documents.types";

export interface DocumentReplacePageClientProps {
    documentPublicId: string;
}

const MAX_FILE_SIZE_BYTES =
    10 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

function formatValue(value: string): string {
    return value
        .replace(/_/g, " ")
        .replace(
            /\b\w/g,
            (character: string): string =>
                character.toUpperCase(),
        );
}

export function DocumentReplacePageClient({
    documentPublicId,
}: DocumentReplacePageClientProps) {
    const router = useRouter();

    const {
        selectedDocument,

        isLoading,
        isReplacing,

        errorMessage,
        successMessage,

        loadDocument,
        replaceDocument,

        clearMessages,
        clearSelectedDocument,
    } = useDocuments();

    const [file, setFile] =
        useState<File | null>(null);

    const [replacementNote, setReplacementNote] =
        useState("");

    const [
        informationAccurateConfirmed,
        setInformationAccurateConfirmed,
    ] = useState(false);

    const [
        localErrorMessage,
        setLocalErrorMessage,
    ] = useState<string | null>(null);

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

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        const selectedFile =
            event.target.files?.[0] ??
            null;

        setLocalErrorMessage(null);
        clearMessages();

        if (!selectedFile) {
            setFile(null);
            return;
        }

        if (
            !ACCEPTED_FILE_TYPES.includes(
                selectedFile.type as
                    (typeof ACCEPTED_FILE_TYPES)[number],
            )
        ) {
            setFile(null);

            setLocalErrorMessage(
                "Upload a PDF, JPEG, PNG, or WebP file.",
            );

            event.target.value = "";
            return;
        }

        if (
            selectedFile.size >
            MAX_FILE_SIZE_BYTES
        ) {
            setFile(null);

            setLocalErrorMessage(
                "The selected file exceeds the 10 MB upload limit.",
            );

            event.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();

        setLocalErrorMessage(null);
        clearMessages();

        if (!selectedDocument) {
            setLocalErrorMessage(
                "The document is unavailable.",
            );
            return;
        }

        if (
            !selectedDocument.replacementAllowed
        ) {
            setLocalErrorMessage(
                "This document cannot currently be replaced.",
            );
            return;
        }

        if (!file) {
            setLocalErrorMessage(
                "Select the replacement file.",
            );
            return;
        }

        if (
            !informationAccurateConfirmed
        ) {
            setLocalErrorMessage(
                "Confirm that the replacement document is accurate and suitable for review.",
            );
            return;
        }

        const payload:
            ReplaceDocumentPayload = {
            data: {
                replacementReason:
                    replacementNote.trim() ||
                    "Replacement uploaded for review.",
                file,
                informationAccurateConfirmed:
                    true,
            },
        };

        try {
            const result =
                await replaceDocument(
                    selectedDocument.documentPublicId,
                    payload,
                );

            router.push(
                `/documents/${encodeURIComponent(
                    result.replacementDocument
                        .documentPublicId,
                )}`,
            );

            router.refresh();
        } catch {
            // The hook exposes the approved safe error.
        }
    };

    if (isLoading) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="h-80 animate-pulse rounded-[var(--asancha-radius-xl)] bg-[var(--muted)]" />
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

    if (!selectedDocument.replacementAllowed) {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-6">
                    <h1 className="text-2xl font-bold">
                        Replacement unavailable
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
                        This document cannot currently
                        be replaced. The backend may
                        restrict replacement after
                        approval, deletion, supersession,
                        or another lifecycle condition.
                    </p>

                    <Link
                        href={`/documents/${encodeURIComponent(
                            selectedDocument.documentPublicId,
                        )}`}
                        className="mt-5 inline-flex text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                        Return to document
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Document correction
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Replace document
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Upload a new version of{" "}
                    <strong className="text-[var(--foreground)]">
                        {
                            selectedDocument.displayName
                        }
                    </strong>
                    . The previous version and review
                    history remain preserved.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Current status:{" "}
                <strong className="text-[var(--foreground)]">
                    {formatValue(
                        selectedDocument.reviewStatus,
                    )}
                </strong>
                .
                {selectedDocument.safeUserMessage
                    ? ` ${selectedDocument.safeUserMessage}`
                    : ""}
            </div>

            {localErrorMessage ||
            errorMessage ? (
                <div
                    role="alert"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                >
                    {localErrorMessage ??
                        errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div
                    role="status"
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--secondary)] p-4 text-sm"
                >
                    {successMessage}
                </div>
            ) : null}

            <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-6"
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Replacement file
                    </h2>

                    <input
                        id="replacementFile"
                        type="file"
                        required
                        accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="mt-5 block w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] p-3 text-sm file:mr-4 file:rounded-[var(--asancha-radius-md)] file:border-0 file:bg-[var(--muted)] file:px-4 file:py-2 file:font-semibold"
                    />

                    <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                        Accepted formats: PDF, JPEG,
                        PNG, and WebP. Maximum size:
                        10 MB.
                    </p>

                    {file ? (
                        <div className="mt-4 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm">
                            <p className="font-semibold">
                                {file.name}
                            </p>

                            <p className="mt-1 text-[var(--muted-foreground)]">
                                {(
                                    file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)}{" "}
                                MB
                            </p>
                        </div>
                    ) : null}
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <label
                        htmlFor="replacementNote"
                        className="text-sm font-semibold"
                    >
                        Replacement note
                    </label>

                    <textarea
                        id="replacementNote"
                        rows={5}
                        value={replacementNote}
                        onChange={(
                            event: ChangeEvent<HTMLTextAreaElement>,
                        ): void =>
                            setReplacementNote(
                                event.target.value,
                            )
                        }
                        placeholder="Briefly explain how the replacement addresses the review request."
                        className="mt-2 w-full resize-y rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm"
                    />
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={
                                informationAccurateConfirmed
                            }
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ): void =>
                                setInformationAccurateConfirmed(
                                    event.target
                                        .checked,
                                )
                            }
                            className="mt-1 h-4 w-4 accent-[var(--primary)]"
                        />

                        <span className="text-sm leading-6">
                            I confirm that this
                            replacement document is
                            accurate, relevant, and
                            suitable for review.
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <Link
                            href={`/documents/${encodeURIComponent(
                                selectedDocument.documentPublicId,
                            )}`}
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isReplacing}
                            className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                        >
                            {isReplacing
                                ? "Uploading replacement…"
                                : "Replace document"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}
