// File: src/features/notifications/schemas/notification-preferences.schema.ts

/**
 * Asancha Notification Preference Schema
 *
 * Purpose:
 * Provides client-side Zod validation for notification preference updates.
 *
 * Responsibilities:
 * - Validate in-app and email category choices.
 * - Validate timezone and digest preferences.
 * - Keep the form shape aligned with the public notification contract.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - The backend remains responsible for preventing critical categories from
 *   being fully disabled.
 */

import { z } from "zod";

const notificationCategoryPreferencesSchema =
    z.object({
        account: z.boolean(),
        security: z.boolean(),
        profile: z.boolean(),
        onboarding: z.boolean(),
        policy: z.boolean(),
        verification: z.boolean(),
        document: z.boolean(),
        listing: z.boolean(),
        reservation: z.boolean(),
        payment: z.boolean(),
        booking: z.boolean(),
        conversation: z.boolean(),
        ai: z.boolean(),
        apiPartner: z.boolean(),
        system: z.boolean(),
    });

export const notificationPreferencesSchema =
    z.object({
        inApp:
            notificationCategoryPreferencesSchema,

        email:
            notificationCategoryPreferencesSchema,

        timezone: z
            .string()
            .trim()
            .min(3, "Choose a valid timezone.")
            .max(
                100,
                "Timezone must contain no more than 100 characters.",
            ),

        digestEnabled: z.boolean(),

        digestFrequency: z.enum([
            "daily",
            "weekly",
            "never",
        ]),
    })
        .superRefine((values, context) => {
            if (
                values.digestEnabled &&
                values.digestFrequency === "never"
            ) {
                context.addIssue({
                    code: "custom",
                    path: ["digestFrequency"],
                    message:
                        "Choose a digest frequency when digests are enabled.",
                });
            }

            if (
                !values.digestEnabled &&
                values.digestFrequency !== "never"
            ) {
                context.addIssue({
                    code: "custom",
                    path: ["digestFrequency"],
                    message:
                        "Set digest frequency to never when digests are disabled.",
                });
            }
        });

export type NotificationPreferencesFormInput =
    z.input<
        typeof notificationPreferencesSchema
    >;

export type NotificationPreferencesFormValues =
    z.output<
        typeof notificationPreferencesSchema
    >;