// File: src/features/documents/schemas/document-upload.schema.ts

/**
 * Asancha Document Upload Schema
 *
 * Purpose:
 * Provides client-side Zod validation for document upload and replacement
 * forms.
 *
 * Responsibilities:
 * - Validate document type and related-resource context.
 * - Validate file type and file size.
 * - Validate custom document labels.
 * - Require user accuracy and upload-authority confirmations.
 * - Validate replacement reasons and replacement files.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend authorization, file-signature inspection, malware scanning,
 *   storage, MIME verification, replacement eligibility, and review rules
 *   remain authoritative.
 * - File names must not be treated as trusted metadata.
 * - A successful browser validation does not mean a document is approved.
 */

import { z } from "zod";

import {
    DOCUMENT_ACCEPTED_MIME_TYPES,
    DOCUMENT_MAX_FILE_SIZE_BYTES,
    DOCUMENT_RELATED_TYPE_OPTIONS,
    DOCUMENT_TYPE_OPTIONS,
} from "../constants/documents.constants";

const documentTypeValues = DOCUMENT_TYPE_OPTIONS.map(
    (option) => option.value,
);

const relatedTypeValues =
    DOCUMENT_RELATED_TYPE_OPTIONS.map(
        (option) => option.value,
    );

function enumFromValues<TValue extends string>(
    values: readonly TValue[],
) {
    return z.enum(values as [TValue, ...TValue[]]);
}

const publicIdSchema = z
    .string()
    .trim()
    .min(3, "A valid related public identifier is required.")
    .max(120, "The public identifier is too long.")
    .regex(
        /^[A-Za-z0-9_-]+$/,
        "The public identifier contains invalid characters.",
    );

const optionalPublicIdSchema = z
    .union([
        publicIdSchema,
        z.literal(""),
        z.null(),
        z.undefined(),
    ])
    .transform((value: any) => {
        if (!value) {
            return null;
        }

        return value;
    });

const optionalTrimmedTextSchema = (
    maximumLength: number,
) =>
    z
        .union([
            z.string(),
            z.null(),
            z.undefined(),
        ])
        .transform((value: any) => {
            const normalized = value?.trim();

            return normalized ? normalized : null;
        })
        .pipe(
            z
                .string()
                .max(
                    maximumLength,
                    `Enter no more than ${maximumLength} characters.`,
                )
                .nullable(),
        );

const documentFileSchema = z
    .custom<File>(
        (value: any) =>
            typeof File !== "undefined" &&
            value instanceof File,
        {
            message: "Choose a document to upload.",
        },
    )
    .superRefine((file: any, context: any) => {
        if (file.size <= 0) {
            context.addIssue({
                code: "custom",
                message: "The selected file is empty.",
            });
        }

        if (file.size > DOCUMENT_MAX_FILE_SIZE_BYTES) {
            context.addIssue({
                code: "custom",
                message:
                    "The selected file must not exceed 10 MB.",
            });
        }

        if (
            !DOCUMENT_ACCEPTED_MIME_TYPES.includes(
                file.type as
                | "application/pdf"
                | "image/jpeg"
                | "image/png"
                | "image/webp",
            )
        ) {
            context.addIssue({
                code: "custom",
                message:
                    "Upload a PDF, JPEG, PNG, or WebP file.",
            });
        }
    });

export const documentUploadSchema = z
    .object({
        documentType: enumFromValues(
            documentTypeValues,
        ),

        customDocumentType:
            optionalTrimmedTextSchema(120),

        relatedType: enumFromValues(
            relatedTypeValues,
        ),

        relatedPublicId: optionalPublicIdSchema,

        displayName: z
            .string()
            .trim()
            .min(
                3,
                "Document name must contain at least 3 characters.",
            )
            .max(
                160,
                "Document name must contain no more than 160 characters.",
            ),

        description: optionalTrimmedTextSchema(1_000),

        file: documentFileSchema,

        informationAccurateConfirmed: z.literal(true, {
            error:
                "Confirm that the document information is accurate.",
        }),

        uploadAuthorityConfirmed: z.literal(true, {
            error:
                "Confirm that you are authorised to upload this document.",
        }),
    })
    .superRefine((values: any, context: any) => {
        if (
            values.documentType === "other" &&
            values.customDocumentType === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["customDocumentType"],
                message: "Describe the document type.",
            });
        }

        if (
            values.relatedType !== "general_profile" &&
            values.relatedType !== "other" &&
            values.relatedPublicId === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["relatedPublicId"],
                message:
                    "Choose the item this document relates to.",
            });
        }
    });

export const documentReplacementSchema = z.object({
    replacementReason: z
        .string()
        .trim()
        .min(
            5,
            "Provide a short reason for replacing the document.",
        )
        .max(
            500,
            "Replacement reason must contain no more than 500 characters.",
        ),

    file: documentFileSchema,

    informationAccurateConfirmed: z.literal(true, {
        error:
            "Confirm that the replacement document information is accurate.",
    }),
});

export type DocumentUploadFormInput = z.input<
    typeof documentUploadSchema
>;

export type DocumentUploadFormValues = z.output<
    typeof documentUploadSchema
>;

export type DocumentReplacementFormInput = z.input<
    typeof documentReplacementSchema
>;

export type DocumentReplacementFormValues = z.output<
    typeof documentReplacementSchema
>;