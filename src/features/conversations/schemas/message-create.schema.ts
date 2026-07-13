// File: src/features/conversations/schemas/message-create.schema.ts

/**
 * Asancha Conversation Schemas
 *
 * Purpose:
 * Provides client-side validation for conversation creation, updates,
 * closure, and user message sending.
 *
 * Security notes:
 * - Plain-text validation improves UX only.
 * - Backend sanitisation, redaction, participant checks, target ownership, and
 *   lifecycle checks remain authoritative.
 * - Public users cannot send admin-note message types.
 */

import { z } from "zod";

import {
    CONVERSATION_MAX_DESCRIPTION_LENGTH,
    CONVERSATION_MAX_MESSAGE_LENGTH,
    CONVERSATION_MAX_SUBJECT_LENGTH,
    CONVERSATION_PRIORITY_OPTIONS,
    CONVERSATION_TARGET_TYPE_OPTIONS,
    CONVERSATION_TYPE_OPTIONS,
} from "../constants/conversations.constants";

const conversationTypeValues =
    CONVERSATION_TYPE_OPTIONS.map(
        (option) => option.value,
    );

const conversationPriorityValues =
    CONVERSATION_PRIORITY_OPTIONS.map(
        (option) => option.value,
    );

const targetTypeValues =
    CONVERSATION_TARGET_TYPE_OPTIONS.map(
        (option) => option.value,
    );

function enumFromValues<TValue extends string>(
    values: readonly TValue[],
) {
    return z.enum(
        values as [TValue, ...TValue[]],
    );
}

const optionalTextSchema = (
    maximumLength: number,
) =>
    z
        .union([
            z.string(),
            z.null(),
            z.undefined(),
        ])
        .transform((value) => {
            const normalizedValue = value?.trim();

            return normalizedValue || null;
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

const optionalPublicIdSchema = z
    .union([
        z.string(),
        z.literal(""),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => {
        const normalizedValue = value?.trim();

        return normalizedValue || null;
    })
    .pipe(
        z
            .string()
            .min(3, "Choose a valid related item.")
            .max(120, "The public identifier is too long.")
            .regex(
                /^[A-Za-z0-9_-]+$/,
                "The public identifier contains invalid characters.",
            )
            .nullable(),
    );

const safeMessageBodySchema = z
    .string()
    .trim()
    .min(1, "Enter a message.")
    .max(
        CONVERSATION_MAX_MESSAGE_LENGTH,
        `Message must contain no more than ${CONVERSATION_MAX_MESSAGE_LENGTH} characters.`,
    )
    .refine(
        (value) =>
            !/<script[\s>]/i.test(value),
        "Script content is not allowed.",
    );

export const createConversationSchema = z
    .object({
        conversationType: enumFromValues(
            conversationTypeValues,
        ),

        subject: z
            .string()
            .trim()
            .min(
                5,
                "Subject must contain at least 5 characters.",
            )
            .max(
                CONVERSATION_MAX_SUBJECT_LENGTH,
                `Subject must contain no more than ${CONVERSATION_MAX_SUBJECT_LENGTH} characters.`,
            ),

        description: optionalTextSchema(
            CONVERSATION_MAX_DESCRIPTION_LENGTH,
        ),

        targetType: enumFromValues(
            targetTypeValues,
        ),

        targetPublicId:
            optionalPublicIdSchema,

        initialMessage:
            safeMessageBodySchema,

        informationAccurateConfirmed:
            z.literal(true, {
                error:
                    "Confirm that the conversation information is accurate.",
            }),
    })
    .superRefine((values, context) => {
        if (
            !["support", "other"].includes(
                values.targetType,
            ) &&
            values.targetPublicId === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["targetPublicId"],
                message:
                    "Choose the related item for this conversation.",
            });
        }

        if (
            values.conversationType ===
            "listing_enquiry" &&
            values.targetType !== "listing"
        ) {
            context.addIssue({
                code: "custom",
                path: ["targetType"],
                message:
                    "A listing enquiry must relate to a listing.",
            });
        }

        if (
            values.conversationType ===
            "reservation" &&
            values.targetType !== "reservation"
        ) {
            context.addIssue({
                code: "custom",
                path: ["targetType"],
                message:
                    "A reservation conversation must relate to a reservation.",
            });
        }

        if (
            values.conversationType === "booking" &&
            values.targetType !== "booking"
        ) {
            context.addIssue({
                code: "custom",
                path: ["targetType"],
                message:
                    "A booking conversation must relate to a booking.",
            });
        }
    });

export const updateConversationSchema = z
    .object({
        subject: z
            .string()
            .trim()
            .min(5)
            .max(
                CONVERSATION_MAX_SUBJECT_LENGTH,
            )
            .optional(),

        description: optionalTextSchema(
            CONVERSATION_MAX_DESCRIPTION_LENGTH,
        ).optional(),

        priority: enumFromValues(
            conversationPriorityValues,
        ).optional(),
    })
    .refine(
        (values) =>
            Object.keys(values).length > 0,
        "Provide at least one change.",
    );

export const closeConversationSchema = z.object({
    reason: optionalTextSchema(500),

    closureConfirmed: z.literal(true, {
        error:
            "Confirm that you want to close this conversation.",
    }),
});

export const sendMessageSchema = z.object({
    body: safeMessageBodySchema,
});

export type CreateConversationFormValues =
    z.output<typeof createConversationSchema>;

export type UpdateConversationFormValues =
    z.output<typeof updateConversationSchema>;

export type CloseConversationFormValues =
    z.output<typeof closeConversationSchema>;

export type SendMessageFormValues =
    z.output<typeof sendMessageSchema>;