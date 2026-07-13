// File: src/features/api-partner/schemas/api-partner-application.schema.ts

/**
 * Asancha API Partner Schemas
 *
 * Purpose:
 * Provides client-side validation for API-partner applications, API keys,
 * webhook endpoints, and key revocation.
 *
 * Security notes:
 * - Client-side validation improves UX only.
 * - Backend company, policy, verification, plan, scope, payment, environment,
 *   URL-safety, and lifecycle checks remain authoritative.
 * - Full API keys and webhook secrets must never be accepted as form input.
 */

import { z } from "zod";

import {
    API_ENVIRONMENT_OPTIONS,
    API_PARTNER_SCOPE_OPTIONS,
    API_WEBHOOK_EVENT_OPTIONS,
} from "../constants/api-partner.constants";

const scopeValues =
    API_PARTNER_SCOPE_OPTIONS.map(
        (option) => option.value,
    );

const webhookEventValues =
    API_WEBHOOK_EVENT_OPTIONS.map(
        (option) => option.value,
    );

const environmentValues =
    API_ENVIRONMENT_OPTIONS.map(
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
            const normalized = value?.trim();

            return normalized || null;
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

const optionalUrlSchema = z
    .union([
        z.string(),
        z.null(),
        z.undefined(),
    ])
    .transform((value) => {
        const normalized = value?.trim();

        return normalized || null;
    })
    .pipe(
        z
            .string()
            .url("Enter a valid URL.")
            .refine(
                (value) =>
                    value.startsWith("https://"),
                "Use a secure HTTPS URL.",
            )
            .nullable(),
    );

export const apiPartnerApplicationSchema = z
    .object({
        company: z.object({
            companyName: z
                .string()
                .trim()
                .min(
                    2,
                    "Company name must contain at least 2 characters.",
                )
                .max(180),

            companyRegistrationNumber: z
                .string()
                .trim()
                .min(
                    2,
                    "Enter the company registration number.",
                )
                .max(100),

            companyWebsite: z
                .string()
                .trim()
                .url("Enter a valid company website.")
                .refine(
                    (value) =>
                        value.startsWith("https://"),
                    "Use a secure HTTPS company website.",
                ),

            country: z
                .string()
                .trim()
                .min(2)
                .max(100),

            registeredAddress: z
                .string()
                .trim()
                .min(
                    10,
                    "Enter the registered company address.",
                )
                .max(500),
        }),

        contacts: z.object({
            businessContactName: z
                .string()
                .trim()
                .min(2)
                .max(160),

            businessContactEmail: z
                .string()
                .trim()
                .email(),

            businessContactPhone:
                optionalTextSchema(40),

            technicalContactName: z
                .string()
                .trim()
                .min(2)
                .max(160),

            technicalContactEmail: z
                .string()
                .trim()
                .email(),

            technicalContactPhone:
                optionalTextSchema(40),
        }),

        businessUseCase: z
            .string()
            .trim()
            .min(
                50,
                "Describe the business use case in at least 50 characters.",
            )
            .max(5_000),

        integrationDescription: z
            .string()
            .trim()
            .min(
                50,
                "Describe the proposed integration in at least 50 characters.",
            )
            .max(5_000),

        intendedUsers: z
            .string()
            .trim()
            .min(
                20,
                "Describe the intended users.",
            )
            .max(2_000),

        estimatedMonthlyCalls: z
            .number()
            .int()
            .positive()
            .max(100_000_000),

        requestedScopes: z
            .array(enumFromValues(scopeValues))
            .min(
                1,
                "Choose at least one requested API scope.",
            )
            .max(30),

        requestedPlanCode:
            optionalTextSchema(80),

        sandboxRequired: z.boolean(),
        productionAccessRequested: z.boolean(),

        privacyPolicyUrl: optionalUrlSchema,
        termsUrl: optionalUrlSchema,

        dataProtectionConfirmed:
            z.literal(true, {
                error:
                    "Confirm your data-protection responsibilities.",
            }),

        securityResponsibilityConfirmed:
            z.literal(true, {
                error:
                    "Confirm your API security responsibilities.",
            }),

        partnerTermsAccepted:
            z.literal(true, {
                error:
                    "Accept the API partner terms.",
            }),

        informationAccurateConfirmed:
            z.literal(true, {
                error:
                    "Confirm that the application information is accurate.",
            }),
    })
    .superRefine((values, context) => {
        if (
            values.productionAccessRequested &&
            values.privacyPolicyUrl === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["privacyPolicyUrl"],
                message:
                    "A privacy policy URL is required when production access is requested.",
            });
        }

        if (
            values.productionAccessRequested &&
            values.termsUrl === null
        ) {
            context.addIssue({
                code: "custom",
                path: ["termsUrl"],
                message:
                    "A terms URL is required when production access is requested.",
            });
        }
    });

export const createApiKeySchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            3,
            "Key name must contain at least 3 characters.",
        )
        .max(120),

    environment: enumFromValues(
        environmentValues,
    ),

    scopes: z
        .array(enumFromValues(scopeValues))
        .min(
            1,
            "Choose at least one approved scope.",
        )
        .max(30),

    expiresAt: z
        .union([
            z.string(),
            z.null(),
            z.undefined(),
        ])
        .transform((value) => {
            const normalized = value?.trim();

            return normalized || null;
        })
        .refine(
            (value) =>
                value === null ||
                !Number.isNaN(Date.parse(value)),
            "Enter a valid expiry date.",
        ),

    keySecurityAcknowledged:
        z.literal(true, {
            error:
                "Confirm that you understand the key will be shown only once.",
        }),
});

export const revokeApiKeySchema = z.object({
    reason: z
        .string()
        .trim()
        .min(
            10,
            "Provide a short revocation reason.",
        )
        .max(500),

    revocationConfirmed:
        z.literal(true, {
            error:
                "Confirm that you want to revoke this API key.",
        }),
});

export const createApiWebhookSchema = z.object({
    url: z
        .string()
        .trim()
        .url("Enter a valid webhook URL.")
        .refine(
            (value) =>
                value.startsWith("https://"),
            "Webhook endpoints must use HTTPS.",
        ),

    events: z
        .array(
            enumFromValues(webhookEventValues),
        )
        .min(
            1,
            "Choose at least one webhook event.",
        )
        .max(20),

    environment: enumFromValues(
        environmentValues,
    ),

    webhookSecurityAcknowledged:
        z.literal(true, {
            error:
                "Confirm that you will securely store and verify the webhook signing secret.",
        }),
});

export type ApiPartnerApplicationFormInput =
    z.input<
        typeof apiPartnerApplicationSchema
    >;

export type ApiPartnerApplicationFormValues =
    z.output<
        typeof apiPartnerApplicationSchema
    >;

export type CreateApiKeyFormValues =
    z.output<typeof createApiKeySchema>;

export type RevokeApiKeyFormValues =
    z.output<typeof revokeApiKeySchema>;

export type CreateApiWebhookFormValues =
    z.output<typeof createApiWebhookSchema>;