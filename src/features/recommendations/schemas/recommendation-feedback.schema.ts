// File: src/features/recommendations/schemas/recommendation-feedback.schema.ts

/**
 * Asancha Recommendation Feedback Schemas
 *
 * Purpose:
 * Provides client-side validation for recommendation feedback and dismissal.
 *
 * Responsibilities:
 * - Validate approved feedback types.
 * - Validate optional feedback explanations and comments.
 * - Require meaningful context for selected negative or custom feedback.
 * - Validate recommendation dismissal reasons.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend recommendation ownership and lifecycle checks remain final.
 * - Feedback must not accept hidden scoring instructions, prompts, or private
 *   staff notes.
 */

import { z } from "zod";

import { RECOMMENDATION_FEEDBACK_OPTIONS } from "../constants/recommendations.constants";

const feedbackTypeValues =
    RECOMMENDATION_FEEDBACK_OPTIONS.map(
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

export const recommendationFeedbackSchema = z
    .object({
        feedbackType: enumFromValues(
            feedbackTypeValues,
        ),

        feedbackReason: optionalTextSchema(240),

        comment: optionalTextSchema(1_000),

        feedbackAccurateConfirmed:
            z.literal(true, {
                error:
                    "Confirm that this feedback reflects your view of the recommendation.",
            }),
    })
    .superRefine((values, context) => {
        if (
            values.feedbackType === "other" &&
            values.comment === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["comment"],
                message:
                    "Add a short comment explaining your feedback.",
            });
        }

        if (
            values.feedbackType === "bad_match" &&
            values.feedbackReason === null &&
            values.comment === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["feedbackReason"],
                message:
                    "Briefly explain why this was not a suitable match.",
            });
        }

        if (
            values.feedbackReason !== null &&
            values.feedbackReason.length < 3
        ) {
            context.addIssue({
                code: "custom",
                path: ["feedbackReason"],
                message:
                    "Feedback reason must contain at least 3 characters.",
            });
        }

        if (
            values.comment !== null &&
            values.comment.length < 3
        ) {
            context.addIssue({
                code: "custom",
                path: ["comment"],
                message:
                    "Comment must contain at least 3 characters.",
            });
        }
    });

export const dismissRecommendationSchema = z.object({
    reason: optionalTextSchema(500),

    dismissalConfirmed: z.literal(true, {
        error:
            "Confirm that you want to dismiss this recommendation.",
    }),
});

export type RecommendationFeedbackFormInput =
    z.input<
        typeof recommendationFeedbackSchema
    >;

export type RecommendationFeedbackFormValues =
    z.output<
        typeof recommendationFeedbackSchema
    >;

export type DismissRecommendationFormValues =
    z.output<
        typeof dismissRecommendationSchema
    >;