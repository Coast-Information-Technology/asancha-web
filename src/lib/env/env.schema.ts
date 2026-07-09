// File: src/lib/env/env.schema.ts

/**
 * Asancha Public Environment Schema
 *
 * Purpose:
 * Defines and validates browser-safe environment variables for
 * Asancha Web Public.
 *
 * Main responsibilities:
 * - Validate required public environment variables
 * - Prevent invalid runtime environment names
 * - Keep production-specific values deployment-controlled
 * - Avoid exposing secrets through NEXT_PUBLIC_* variables
 *
 * Important Asancha Web Public rule:
 * This file must only validate browser-safe public configuration.
 * It must not define or expose backend secrets, JWT secrets, database URLs,
 * Stripe secret keys, webhook secrets, API key hashes, admin bootstrap
 * secrets, mail provider secrets, storage secrets, full API keys,
 * private document URLs, private KYC/admin values, or admin/staff portal URLs.
 *
 * Security note:
 * NEXT_PUBLIC_* values are bundled into the browser.
 * Only non-secret configuration is allowed here.
 */

import { z } from "zod";

export const PUBLIC_ENVIRONMENT_VALUES = [
  "development",
  "test",
  "staging",
  "production",
] as const;

export type PublicEnvironment = (typeof PUBLIC_ENVIRONMENT_VALUES)[number];

const requiredPublicUrlSchema = z
  .string()
  .trim()
  .min(1, "This environment variable is required.")
  .url("Expected a valid URL.");

const optionalPublicUrlSchema = z
  .string()
  .trim()
  .url("Expected a valid URL.")
  .optional()
  .or(z.literal(""));

/**
 * Public environment schema for Asancha Web Public.
 *
 * These values are safe to expose to the browser.
 */
export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_APP_NAME is required.")
    .default("Asancha"),

  NEXT_PUBLIC_APP_URL: requiredPublicUrlSchema,

  NEXT_PUBLIC_API_BASE_URL: requiredPublicUrlSchema,

  NEXT_PUBLIC_ENVIRONMENT: z
    .enum(PUBLIC_ENVIRONMENT_VALUES)
    .default("development"),

  /**
   * Optional public support URL.
   *
   * Keep optional because support may be handled by an internal public route.
   */
  NEXT_PUBLIC_SUPPORT_URL: optionalPublicUrlSchema,

  /**
   * Optional browser-safe analytics flag.
   *
   * This should only enable public-safe analytics.
   * It must not expose analytics secret keys.
   */
  NEXT_PUBLIC_ANALYTICS_ENABLED: z.enum(["true", "false"]).default("false"),

  /**
   * Optional public maintenance banner flag.
   *
   * This is only for public UI messaging.
   */
  NEXT_PUBLIC_MAINTENANCE_BANNER_ENABLED: z
    .enum(["true", "false"])
    .default("false"),
});

export type PublicEnv = z.output<typeof publicEnvSchema>;

export interface PublicEnvValidationResult {
  success: boolean;
  env?: PublicEnv;
  formattedErrors?: Record<string, string[]>;
}

/**
 * Converts a Zod validation error into a safe field-error map.
 */
function formatEnvValidationErrors(
  error: z.ZodError,
): Record<string, string[]> {
  const flattenedError = error.flatten();
  const formattedErrors: Record<string, string[]> = {};

  Object.entries(flattenedError.fieldErrors).forEach(
    ([fieldName, messages]) => {
      if (
        Array.isArray(messages) &&
        messages.length > 0 &&
        messages.every((message) => typeof message === "string")
      ) {
        formattedErrors[fieldName] = messages;
      }
    },
  );

  if (
    Array.isArray(flattenedError.formErrors) &&
    flattenedError.formErrors.length > 0
  ) {
    formattedErrors._form = flattenedError.formErrors;
  }

  return formattedErrors;
}

/**
 * Safely validates public environment variables.
 *
 * The input is unknown on purpose because process.env values are typed as
 * string | undefined. Zod should validate the runtime shape.
 */
export function validatePublicEnv(input: unknown): PublicEnvValidationResult {
  const result = publicEnvSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      formattedErrors: formatEnvValidationErrors(result.error),
    };
  }

  return {
    success: true,
    env: result.data,
  };
}

/**
 * Parses public environment variables and throws a safe startup error
 * when required values are missing or invalid.
 */
export function parsePublicEnv(input: unknown): PublicEnv {
  const result = validatePublicEnv(input);

  if (!result.success || !result.env) {
    const errorDetails = JSON.stringify(result.formattedErrors, null, 2);

    throw new Error(
      `Invalid Asancha public environment configuration: ${errorDetails}`,
    );
  }

  return result.env;
}
