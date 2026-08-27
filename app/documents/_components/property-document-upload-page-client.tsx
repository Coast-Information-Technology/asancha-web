"use client";

// File: app/documents/_components/property-document-upload-page-client.tsx

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    DOCUMENT_ACCEPT_ATTRIBUTE,
    DOCUMENT_ACCEPTED_MIME_TYPES,
    DOCUMENT_MAX_FILE_SIZE_BYTES,
    DOCUMENT_MAX_FILE_SIZE_LABEL,
    DOCUMENT_PAGE_ROUTES,
    PROPERTY_DOCUMENT_TYPE_OPTIONS,
} from "../../../src/features/documents/constants/documents.constants";
import { useDocuments } from "../../../src/features/documents/hooks/use-documents";
import type {
    PropertyDocumentsUploadPayload,
    PropertyDocumentType,
    PropertyDocumentUploadPayload,
} from "../../../src/features/documents/types/documents.types";

interface PropertyDocumentUploadPageClientProps {
    mode: "single" | "multiple";
}

function formatFileSize(fileSizeBytes: number): string {
    return `${(fileSizeBytes / 1024 / 1024).toFixed(2)} MB`;
}

function validateFiles(files: File[]): string | null {
    if (files.length === 0) {
        return "Select at least one document file.";
    }

    const emptyFile = files.find((file) => file.size <= 0);

    if (emptyFile) {
        return `${emptyFile.name} is empty.`;
    }

    const oversizedFile = files.find(
        (file) =>
            file.size > DOCUMENT_MAX_FILE_SIZE_BYTES,
    );

    if (oversizedFile) {
        return `${oversizedFile.name} exceeds the ${DOCUMENT_MAX_FILE_SIZE_LABEL} upload limit.`;
    }

    const unsupportedFile = files.find(
        (file) =>
            !DOCUMENT_ACCEPTED_MIME_TYPES.includes(
                file.type as
                    (typeof DOCUMENT_ACCEPTED_MIME_TYPES)[number],
            ),
    );

    if (unsupportedFile) {
        return `${unsupportedFile.name} is not a supported PDF, JPEG, PNG, or WebP file.`;
    }

    return null;
}

export function PropertyDocumentUploadPageClient({
    mode,
}: PropertyDocumentUploadPageClientProps) {
    const router = useRouter();
    const isMultiple = mode === "multiple";
    const {
        uploadPropertyDocument,
        uploadPropertyDocuments,
        isUploading,
        errorMessage,
        clearMessages,
    } = useDocuments();

    const [documentType, setDocumentType] =
        useState<PropertyDocumentType>(
            "proof_of_ownership",
        );
    const [files, setFiles] = useState<File[]>([]);
    const [accuracyConfirmed, setAccuracyConfirmed] =
        useState(false);
    const [localErrorMessage, setLocalErrorMessage] =
        useState<string | null>(null);

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>,
    ): void => {
        const selectedFiles = Array.from(
            event.target.files ?? [],
        );
        const nextFiles = isMultiple
            ? selectedFiles
            : selectedFiles.slice(0, 1);
        const validationMessage =
            validateFiles(nextFiles);

        clearMessages();
        setLocalErrorMessage(validationMessage);
        setFiles(validationMessage ? [] : nextFiles);

        if (validationMessage) {
            event.target.value = "";
        }
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        event.preventDefault();
        clearMessages();
        setLocalErrorMessage(null);

        const validationMessage = validateFiles(files);

        if (validationMessage) {
            setLocalErrorMessage(validationMessage);
            return;
        }

        if (!accuracyConfirmed) {
            setLocalErrorMessage(
                "Confirm that you are authorised to upload these documents and that the information is accurate.",
            );
            return;
        }

        try {
            if (isMultiple) {
                const payload:
                    PropertyDocumentsUploadPayload = {
                    data: {
                        documentType,
                        files,
                    },
                };

                await uploadPropertyDocuments(payload);

                router.push(
                    `${DOCUMENT_PAGE_ROUTES.root}?documentType=${encodeURIComponent(documentType)}`,
                );
            } else {
                const payload:
                    PropertyDocumentUploadPayload = {
                    data: {
                        documentType,
                        file: files[0],
                    },
                };
                const result =
                    await uploadPropertyDocument(payload);

                router.push(
                    DOCUMENT_PAGE_ROUTES.detail(
                        result.document.documentPublicId,
                    ),
                );
            }

            router.refresh();
        } catch {
            // useDocuments exposes the approved safe error message.
        }
    };

    const visibleError =
        localErrorMessage ?? errorMessage;
    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]";

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Property documents
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight">
                    {isMultiple
                        ? "Upload multiple documents"
                        : "Upload a document"}
                </h1>

                <p className="mt-3 leading-7 text-[var(--muted-foreground)]">
                    {isMultiple
                        ? "Choose one property-document type and submit multiple files in a single upload request."
                        : "Choose the property-document type and submit one protected file."}
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Documents are private by default. Upload
                does not mean that a document has been
                reviewed or approved.
            </div>

            {visibleError ? (
                <p
                    className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--destructive)] p-4 text-sm text-[var(--destructive)]"
                    role="alert"
                >
                    {visibleError}
                </p>
            ) : null}

            <form
                className="mt-6 grid gap-6"
                onSubmit={handleSubmit}
            >
                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Document information
                    </h2>

                    <div className="mt-5">
                        <label
                            className="text-sm font-semibold"
                            htmlFor="propertyDocumentType"
                        >
                            Document type
                        </label>

                        <select
                            className={fieldClassName}
                            id="propertyDocumentType"
                            onChange={(event) =>
                                setDocumentType(
                                    event.target
                                        .value as PropertyDocumentType,
                                )
                            }
                            required
                            value={documentType}
                        >
                            {PROPERTY_DOCUMENT_TYPE_OPTIONS.map(
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
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        {isMultiple
                            ? "Select files"
                            : "Select file"}
                    </h2>

                    <input
                        accept={DOCUMENT_ACCEPT_ATTRIBUTE}
                        className="mt-5 block w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] p-3 text-sm file:mr-4 file:rounded-[var(--asancha-radius-md)] file:border-0 file:bg-[var(--muted)] file:px-4 file:py-2 file:font-semibold"
                        id="propertyDocumentFiles"
                        multiple={isMultiple}
                        onChange={handleFileChange}
                        required
                        type="file"
                    />

                    <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                        PDF, JPEG, PNG, or WebP. Maximum
                        size per file: {DOCUMENT_MAX_FILE_SIZE_LABEL}.
                    </p>

                    {files.length > 0 ? (
                        <ul className="mt-4 grid gap-2">
                            {files.map((file) => (
                                <li
                                    className="flex flex-col gap-1 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                                    key={`${file.name}:${file.size}:${file.lastModified}`}
                                >
                                    <span className="break-all font-semibold">
                                        {file.name}
                                    </span>
                                    <span className="text-[var(--muted-foreground)]">
                                        {formatFileSize(file.size)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5">
                    <label className="flex items-start gap-3">
                        <input
                            checked={accuracyConfirmed}
                            className="mt-1 size-4 accent-[var(--primary)]"
                            onChange={(event) =>
                                setAccuracyConfirmed(
                                    event.target.checked,
                                )
                            }
                            type="checkbox"
                        />
                        <span className="text-sm leading-6">
                            I confirm that I am authorised
                            to upload {isMultiple
                                ? "these documents"
                                : "this document"} and that
                            the selected type is accurate.
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <Link
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                            href={DOCUMENT_PAGE_ROUTES.root}
                        >
                            Cancel
                        </Link>

                        <button
                            className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                            disabled={isUploading}
                            type="submit"
                        >
                            {isUploading
                                ? "Uploading…"
                                : isMultiple
                                  ? "Upload documents"
                                  : "Upload document"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}
