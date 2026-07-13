// File: src/features/payments/schemas/payment-proof.schema.ts

/**
 * Asancha External Payment Submission Schema
 *
 * Purpose:
 * Provides client-side Zod validation for external or offline payment detail
 * submission and Stripe Checkout initiation.
 *
 * Responsibilities:
 * - Validate payment reference and narration matching.
 * - Validate amount, payer, payment method, and payment date.
 * - Require bank transaction or session trace information where applicable.
 * - Validate optional proof-of-payment document public ID.
 * - Require accuracy and narration confirmations.
 * - Validate safe Stripe success and cancel paths.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend reference, ownership, amount, currency, expiry, narration, payer,
 *   trace, document, and lifecycle checks remain authoritative.
 * - Users cannot mark payments paid through this schema.
 * - Success and cancel paths must remain relative application paths.
 */

import { z } from "zod";

import { EXTERNAL_PAYMENT_METHOD_OPTIONS } from "../constants/payments.constants";

const externalPaymentMethodValues =
    EXTERNAL_PAYMENT_METHOD_OPTIONS.map(
        (option) => option.value,
    );

function enumFromValues<TValue extends string>(
    values: readonly TValue[],
) {
    return z.enum(values as [TValue, ...TValue[]]);
}

const paymentReferenceSchema = z
    .string()
    .trim()
    .toUpperCase()
    .min(8, "Enter a valid Asancha payment reference.")
    .max(60, "The payment reference is too long.")
    .regex(
        /^ASANCHA-[A-Z0-9-]+$/,
        "Enter a valid Asancha payment reference.",
    );

const optionalPublicIdSchema = z
    .union([
        z.string(),
        z.literal(""),
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
            .min(3, "Enter a valid document public identifier.")
            .max(120, "The document public identifier is too long.")
            .regex(
                /^[A-Za-z0-9_-]+$/,
                "The document public identifier contains invalid characters.",
            )
            .nullable(),
    );

const optionalTraceValueSchema = z
    .union([
        z.string(),
        z.literal(""),
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
                160,
                "Payment trace information must contain no more than 160 characters.",
            )
            .nullable(),
    );

const relativeApplicationPathSchema = z
    .union([
        z.string(),
        z.literal(""),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => {
        const normalizedValue = value?.trim();

        return normalizedValue
            ? normalizedValue
            : null;
    })
    .refine(
        (value) =>
            value === null ||
            (value.startsWith("/") &&
                !value.startsWith("//") &&
                !value.includes("://")),
        "Use a valid relative application path.",
    );

export const externalPaymentSubmissionSchema = z
    .object({
        paymentReference: paymentReferenceSchema,

        amountPaid: z
            .number()
            .finite()
            .positive(
                "Amount paid must be greater than zero.",
            ),

        currency: z.literal("GBP"),

        paymentMethod: enumFromValues(
            externalPaymentMethodValues,
        ),

        payerName: z
            .string()
            .trim()
            .min(
                2,
                "Payer name must contain at least 2 characters.",
            )
            .max(
                160,
                "Payer name must contain no more than 160 characters.",
            ),

        bankTransactionCode: optionalTraceValueSchema,

        bankSessionId: optionalTraceValueSchema,

        paymentDescriptionUsed: z
            .string()
            .trim()
            .min(
                8,
                "Enter the narration or payment description used.",
            )
            .max(
                240,
                "Payment description must contain no more than 240 characters.",
            ),

        paidAt: z
            .string()
            .trim()
            .min(1, "Payment date and time are required.")
            .refine(
                (value) =>
                    !Number.isNaN(Date.parse(value)),
                "Enter a valid payment date and time.",
            ),

        proofOfPaymentDocumentPublicId:
            optionalPublicIdSchema,

        informationAccurateConfirmed: z.literal(true, {
            error:
                "Confirm that the submitted payment information is accurate.",
        }),

        narrationReferenceConfirmed: z.literal(true, {
            error:
                "Confirm that the Asancha payment reference was used in the payment narration.",
        }),
    })
    .superRefine((values, context) => {
        const normalizedDescription =
            values.paymentDescriptionUsed.toUpperCase();

        if (
            !normalizedDescription.includes(
                values.paymentReference,
            )
        ) {
            context.addIssue({
                code: "custom",
                path: ["paymentDescriptionUsed"],
                message:
                    "The payment narration must include the Asancha payment reference.",
            });
        }

        if (
            values.paymentMethod === "bank_transfer" &&
            values.bankTransactionCode === null &&
            values.bankSessionId === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["bankTransactionCode"],
                message:
                    "Provide the bank transaction code or bank session ID.",
            });
        }

        if (
            Date.parse(values.paidAt) >
            Date.now() + 5 * 60 * 1000
        ) {
            context.addIssue({
                code: "custom",
                path: ["paidAt"],
                message:
                    "Payment date cannot be in the future.",
            });
        }
    });

export const startStripeCheckoutSchema = z.object({
    successPath: relativeApplicationPathSchema,
    cancelPath: relativeApplicationPathSchema,
});

export type ExternalPaymentSubmissionFormInput = z.input<
    typeof externalPaymentSubmissionSchema
>;

export type ExternalPaymentSubmissionFormValues = z.output<
    typeof externalPaymentSubmissionSchema
>;

export type StartStripeCheckoutFormValues = z.output<
    typeof startStripeCheckoutSchema
>;