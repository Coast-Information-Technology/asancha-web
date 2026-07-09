// File: src/lib/zod/zod-error-map.ts

/**
 * Asancha Zod Error Helpers
 *
 * Purpose:
 * Provides safe, consistent, user-facing validation error helpers for
 * Asancha Web Public forms.
 *
 * Main responsibilities:
 * - Convert Zod validation errors into safe form-level and field-level messages
 * - Avoid exposing internal implementation details in public UI validation
 * - Provide reusable helpers for React Hook Form and manual form parsing
 *
 * Important Asancha Web Public rule:
 * Frontend validation improves user experience only.
 * Backend validation and backend business-rule enforcement remain final.
 *
 * Security note:
 * Validation messages must not expose stack traces, database internals,
 * MongoDB ObjectIds, token details, API key data, webhook secrets,
 * private KYC notes, internal admin notes, or provider secrets.
 */

import { z } from "zod";

export type AsanchaFormFieldErrors<TFieldName extends string = string> =
  Partial<Record<TFieldName, string[]>>;

export interface AsanchaFormattedZodError<TFieldName extends string = string> {
  formErrors: string[];
  fieldErrors: AsanchaFormFieldErrors<TFieldName>;
}

const DEFAULT_VALIDATION_MESSAGE = "Please check this field and try again.";

const REQUIRED_VALIDATION_MESSAGE = "This field is required.";

/**
 * Converts a Zod issue path into a dot-notated field name.
 */
export function getZodIssueFieldName(path: readonly PropertyKey[]): string {
  return path.map((segment) => String(segment)).join(".");
}

/**
 * Checks whether a value is a non-empty string.
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Returns a safe user-facing message from a Zod issue.
 *
 * This intentionally accepts only the issue properties we actually use,
 * avoiding direct dependency on Zod v4 internal issue types.
 */
export function getSafeZodIssueMessage(issue: {
  code: string;
  message?: string;
}): string {
  if (isNonEmptyString(issue.message)) {
    return issue.message;
  }

  switch (issue.code) {
    case "invalid_type":
      return REQUIRED_VALIDATION_MESSAGE;

    case "too_small":
      return "This value is too short or below the allowed minimum.";

    case "too_big":
      return "This value is too long or above the allowed maximum.";

    case "invalid_format":
      return "Please enter a valid value.";

    case "not_multiple_of":
      return "Please enter a valid number.";

    case "unrecognized_keys":
      return "Some fields are not allowed.";

    case "invalid_union":
      return "Please choose a valid option.";

    case "invalid_key":
      return "Please check this field name.";

    case "invalid_element":
      return "Please check this item.";

    case "invalid_value":
      return "Please choose a valid value.";

    case "custom":
      return DEFAULT_VALIDATION_MESSAGE;

    default:
      return DEFAULT_VALIDATION_MESSAGE;
  }
}

/**
 * Converts a Zod error into safe form-level and field-level messages.
 */
export function formatZodError<TFieldName extends string = string>(
  error: z.ZodError,
): AsanchaFormattedZodError<TFieldName> {
  const formErrors: string[] = [];
  const fieldErrors: AsanchaFormFieldErrors<TFieldName> = {};

  error.issues.forEach((issue) => {
    const message = getSafeZodIssueMessage(issue);
    const issuePath = issue.path ?? [];

    if (issuePath.length === 0) {
      formErrors.push(message);
      return;
    }

    const fieldName = getZodIssueFieldName(issuePath) as TFieldName;
    const existingMessages = fieldErrors[fieldName] ?? [];

    fieldErrors[fieldName] = [...existingMessages, message];
  });

  return {
    formErrors,
    fieldErrors,
  };
}

/**
 * Returns the first available message for a field.
 */
export function getFirstFieldError<TFieldName extends string = string>(
  fieldErrors: AsanchaFormFieldErrors<TFieldName>,
  fieldName: TFieldName,
): string | null {
  const messages = fieldErrors[fieldName];

  if (!messages || messages.length === 0) {
    return null;
  }

  return messages[0] ?? null;
}

/**
 * Returns the first available form-level error message.
 */
export function getFirstFormError(
  formattedError: AsanchaFormattedZodError,
): string | null {
  return formattedError.formErrors[0] ?? null;
}

/**
 * Checks whether a formatted Zod error has any field or form error.
 */
export function hasFormattedZodError(
  formattedError: AsanchaFormattedZodError,
): boolean {
  return (
    formattedError.formErrors.length > 0 ||
    Object.keys(formattedError.fieldErrors).length > 0
  );
}
