// File: src/features/verification/schemas/verification-response.schema.ts

/**
 * Asancha Verification Response Schema
 *
 * Purpose:
 * Provides client-side Zod validation for user responses to verification
 * correction and additional-information requests.
 *
 * Responsibilities:
 * - Validate verification response type.
 * - Validate optional response message.
 * - Validate related document public IDs.
 * - Require accuracy and response-authority confirmations.
 * - Require useful content for information-based responses.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend response eligibility and verification lifecycle rules remain final.
 * - Users cannot approve, reject, set risk, or alter review status through this
 *   schema.
 * - Public IDs are treated as opaque values.
 * - Private KYC information should not be entered unless explicitly requested
 *   through an approved secure field or document workflow.
 */

import { z } from "zod";

import { VERIFICATION_RESPONSE_TYPE_OPTIONS } from "../constants/verification.constants";

const responseTypeValues =
    VERIFICATION_RESPONSE_TYPE_OPTIONS.map(
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
    .min(3, "A valid document public identifier is required.")
    .max(120, "The document public identifier is too long.")
    .regex(
        /^[A-Za-z0-9_-]+$/,
        "The document public identifier contains invalid characters.",
    );

const optionalResponseMessageSchema = z
    .union([
        z.string(),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => {
        const normalizedValue = value?.trim();

        return normalizedValue
            ? normalizedValue
            : null;
    })
    .pipe(
        z
            .string()
            .max(
                2_000,
                "Response must contain no more than 2,000 characters.",
            )
            .nullable(),
    );

export const verificationResponseSchema = z
    .object({
        responseType: enumFromValues(
            responseTypeValues,
        ),

        message: optionalResponseMessageSchema,

        relatedDocumentPublicIds: z
            .array(publicIdSchema)
            .max(
                20,
                "Attach no more than 20 related documents.",
            )
            .default([])
            .superRefine((publicIds, context) => {
                if (
                    new Set(publicIds).size !==
                    publicIds.length
                ) {
                    context.addIssue({
                        code: "custom",
                        message:
                            "The same document cannot be attached more than once.",
                    });
                }
            }),

        informationAccurateConfirmed: z.literal(true, {
            error:
                "Confirm that the information in your response is accurate.",
        }),

        responseAuthorityConfirmed: z.literal(true, {
            error:
                "Confirm that you are authorised to provide this response.",
        }),
    })
    .superRefine((values, context) => {
        if (
            [
                "information",
                "correction",
                "declaration",
                "other",
            ].includes(values.responseType) &&
            values.message === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["message"],
                message:
                    "Enter the information requested by the verification review.",
            });
        }

        if (
            values.message !== null &&
            values.message.length < 5
        ) {
            context.addIssue({
                code: "custom",
                path: ["message"],
                message:
                    "Your response must contain at least 5 characters.",
            });
        }

        if (
            [
                "document_uploaded",
                "document_replaced",
            ].includes(values.responseType) &&
            values.relatedDocumentPublicIds.length === 0
        ) {
            context.addIssue({
                code: "custom",
                path: ["relatedDocumentPublicIds"],
                message:
                    "Choose at least one related document.",
            });
        }
    });

export type VerificationResponseFormInput = z.input<
    typeof verificationResponseSchema
>;

export type VerificationResponseFormValues = z.output<
    typeof verificationResponseSchema
>;