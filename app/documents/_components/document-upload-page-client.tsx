"use client";

// File: app/documents/_components/document-upload-page-client.tsx

/**
 * Asancha Document Upload Page Client
 *
 * Purpose:
 * Uploads a new authenticated business, compliance, verification, property,
 * payment-supporting, or profile document.
 *
 * Security notes:
 * - File validation in the browser is UX guidance only.
 * - Backend MIME-type, extension, content, malware, ownership, profile,
 *   company-membership, related-resource, and size validation remain final.
 * - Uploaded files must not be placed into browser storage.
 * - Proof of payment does not make a payment valid.
 */

import Link from "next/link";
import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

import { useDocuments } from "../../../src/features/documents/hooks/use-documents";
import {
    DOCUMENT_RELATED_TYPE_OPTIONS,
    DOCUMENT_TYPE_OPTIONS,
} from "../../../src/features/documents/constants/documents.constants";
import type {
    DocumentRelatedType,
    DocumentType,
    DocumentUploadPayload,
} from "../../../src/features/documents/types/documents.types";

const MAX_FILE_SIZE_BYTES =
    10 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

const RELATED_TYPES_WITHOUT_PUBLIC_ID:
    readonly DocumentRelatedType[] = [
    "general_profile",
    "business_profile",
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

export function DocumentUploadPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        uploadDocument,
        isUploading,
        errorMessage,
        successMessage,
        clearMessages,
    } = useDocuments();

    const initialDocumentType =
        searchParams.get(
            "documentType",
        ) as DocumentType | null;

    const initialRelatedType =
        searchParams.get(
            "relatedType",
        ) as DocumentRelatedType | null;

    const initialRelatedPublicId =
        searchParams.get(
            "relatedPublicId",
        );

    const [documentType, setDocumentType] =
        useState<DocumentType>(
            initialDocumentType ??
                "identity_document",
        );

    const [relatedType, setRelatedType] =
        useState<DocumentRelatedType>(
            initialRelatedType ??
                "business_profile",
        );

    const [
        relatedPublicId,
        setRelatedPublicId,
    ] = useState(
        initialRelatedPublicId ?? "",
    );

    const [description, setDescription] =
        useState("");

    const [file, setFile] =
        useState<File | null>(null);

    const [
        informationAccurateConfirmed,
        setInformationAccurateConfirmed,
    ] = useState(false);

    const [
        localErrorMessage,
        setLocalErrorMessage,
    ] = useState<string | null>(null);

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

        if (!file) {
            setLocalErrorMessage(
                "Select a document file.",
            );
            return;
        }

        if (
            !RELATED_TYPES_WITHOUT_PUBLIC_ID.includes(
                relatedType,
            ) &&
            !relatedPublicId.trim()
        ) {
            setLocalErrorMessage(
                "Enter the public ID of the related record.",
            );
            return;
        }

        if (
            !informationAccurateConfirmed
        ) {
            setLocalErrorMessage(
                "Confirm that the document and related information are accurate.",
            );
            return;
        }

        const payload:
            DocumentUploadPayload = {
            data: {
                documentType,
                customDocumentType: null,
                relatedType,
                relatedPublicId:
                    RELATED_TYPES_WITHOUT_PUBLIC_ID.includes(
                        relatedType,
                    )
                        ? null
                        : relatedPublicId.trim(),
                displayName:
                    file.name ||
                    formatValue(documentType),
                description:
                    description.trim() || null,
                file,
                informationAccurateConfirmed:
                    true,
                uploadAuthorityConfirmed: true,
            },
        };

        try {
            const result =
                await uploadDocument(
                    payload,
                );

            router.push(
                `/documents/${encodeURIComponent(
                    result.documentPublicId,
                )}`,
            );

            router.refresh();
        } catch {
            // The hook exposes the approved safe error.
        }
    };

    const fieldClassName =
        "mt-2 min-h-11 w-full rounded-[var(--asancha-radius-md)] border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--asancha-focus-ring)]";

    return (
        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <header>
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                    Verification documents
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    Upload document
                </h1>

                <p className="mt-3 max-w-3xl leading-7 text-[var(--muted-foreground)]">
                    Submit a document for the active
                    account, profile, company, property,
                    listing, payment, reservation, or
                    verification process.
                </p>
            </header>

            <div className="mt-5 rounded-[var(--asancha-radius-md)] border border-[var(--border)] bg-[var(--muted)] p-4 text-sm leading-6 text-[var(--muted-foreground)]">
                Files are reviewed after upload. Upload
                does not mean approval. Do not upload
                passwords, secret keys, one-time codes,
                card details, or unrelated personal
                information.
            </div>

            {documentType ===
            "proof_of_payment" ? (
                <div className="mt-4 rounded-[var(--asancha-radius-md)] border border-[var(--warning)] p-4 text-sm leading-6">
                    Proof of payment supports payment
                    review but does not make the payment
                    valid. The payment must still be
                    linked to an Asancha payment record
                    and verified.
                </div>
            ) : null}

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
                        Document information
                    </h2>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="documentType"
                                className="text-sm font-semibold"
                            >
                                Document type
                            </label>

                            <select
                                id="documentType"
                                required
                                value={documentType}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void =>
                                    setDocumentType(
                                        event.target
                                            .value as DocumentType,
                                    )
                                }
                                className={
                                    fieldClassName
                                }
                            >
                                {DOCUMENT_TYPE_OPTIONS.map(
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

                        <div>
                            <label
                                htmlFor="relatedType"
                                className="text-sm font-semibold"
                            >
                                Related record type
                            </label>

                            <select
                                id="relatedType"
                                required
                                value={relatedType}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ): void => {
                                    const nextType =
                                        event.target
                                            .value as DocumentRelatedType;

                                    setRelatedType(
                                        nextType,
                                    );

                                    if (
                                        RELATED_TYPES_WITHOUT_PUBLIC_ID.includes(
                                            nextType,
                                        )
                                    ) {
                                        setRelatedPublicId(
                                            "",
                                        );
                                    }
                                }}
                                className={
                                    fieldClassName
                                }
                            >
                                {DOCUMENT_RELATED_TYPE_OPTIONS.map(
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

                        {!RELATED_TYPES_WITHOUT_PUBLIC_ID.includes(
                            relatedType,
                        ) ? (
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="relatedPublicId"
                                    className="text-sm font-semibold"
                                >
                                    Related public ID
                                </label>

                                <input
                                    id="relatedPublicId"
                                    required
                                    value={
                                        relatedPublicId
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ): void =>
                                        setRelatedPublicId(
                                            event.target
                                                .value,
                                        )
                                    }
                                    autoComplete="off"
                                    className={
                                        fieldClassName
                                    }
                                />

                                <p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">
                                    Use the public ID
                                    shown in the relevant
                                    profile, property,
                                    listing, payment,
                                    reservation, company,
                                    or verification screen.
                                </p>
                            </div>
                        ) : null}

                        <div className="md:col-span-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-semibold"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                rows={4}
                                value={description}
                                onChange={(
                                    event: ChangeEvent<HTMLTextAreaElement>,
                                ): void =>
                                    setDescription(
                                        event.target
                                            .value,
                                    )
                                }
                                placeholder="Add a safe description that helps identify the document."
                                className={`${fieldClassName} resize-y`}
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-[var(--asancha-radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-7">
                    <h2 className="text-xl font-bold">
                        Select file
                    </h2>

                    <input
                        id="documentFile"
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
                        <dl className="mt-4 grid gap-3 rounded-[var(--asancha-radius-md)] bg-[var(--muted)] p-4 text-sm sm:grid-cols-3">
                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    File
                                </dt>

                                <dd className="mt-1 break-all font-semibold">
                                    {file.name}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Type
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {file.type}
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[var(--muted-foreground)]">
                                    Size
                                </dt>

                                <dd className="mt-1 font-semibold">
                                    {(
                                        file.size /
                                        1024 /
                                        1024
                                    ).toFixed(2)}{" "}
                                    MB
                                </dd>
                            </div>
                        </dl>
                    ) : null}
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
                            I confirm that this document
                            is relevant to the selected
                            record and that the
                            information supplied is
                            accurate.
                        </span>
                    </label>

                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                        <Link
                            href="/documents"
                            className="inline-flex min-h-11 items-center justify-center rounded-[var(--asancha-radius-md)] border border-[var(--border)] px-5 py-2 text-sm font-semibold"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={isUploading}
                            className="min-h-11 rounded-[var(--asancha-radius-md)] bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-wait disabled:opacity-60"
                        >
                            {isUploading
                                ? "Uploading…"
                                : "Upload document"}
                        </button>
                    </div>
                </section>
            </form>
        </main>
    );
}
