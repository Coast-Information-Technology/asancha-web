// File: src/lib/zod/form-resolver.ts

/**
 * Asancha Form Resolver Helpers
 *
 * Purpose:
 * Provides React Hook Form resolver helpers for Zod schemas used in
 * Asancha Web Public forms.
 *
 * Main responsibilities:
 * - Wrap @hookform/resolvers/zod in one project-level helper
 * - Keep form validation usage consistent across public/user screens
 * - Provide safe schema parsing helpers before sending data to the API
 *
 * Important Asancha Web Public rule:
 * Frontend form validation is user guidance only.
 * Backend DTO validation, service validation, policy checks, verification,
 * payment, API partner approval, and resource permissions remain final.
 *
 * Security note:
 * Form validation must not expose internal backend errors, MongoDB ObjectIds,
 * secrets, private KYC notes, internal admin notes, token data, API key data,
 * webhook secrets, or payment provider secrets.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, Resolver } from "react-hook-form";
import { z } from "zod";

import { AsanchaFormattedZodError, formatZodError } from "./zod-error-map";

export type AsanchaZodSchema<TFieldValues extends FieldValues> = z.ZodType<
  TFieldValues,
  TFieldValues
>;

export interface SafeParseFormSuccess<TFieldValues extends FieldValues> {
  success: true;
  data: TFieldValues;
  formattedError: null;
}

export interface SafeParseFormFailure {
  success: false;
  data: null;
  formattedError: AsanchaFormattedZodError;
}

export type SafeParseFormResult<TFieldValues extends FieldValues> =
  SafeParseFormSuccess<TFieldValues> | SafeParseFormFailure;

/**
 * Creates a React Hook Form resolver from a Zod schema.
 */
export function createFormResolver<TFieldValues extends FieldValues>(
  schema: AsanchaZodSchema<TFieldValues>,
): Resolver<TFieldValues> {
  return zodResolver(schema);
}

/**
 * Safely parses unknown form values with a Zod schema.
 */
export function safeParseFormValues<TFieldValues extends FieldValues>(
  schema: AsanchaZodSchema<TFieldValues>,
  values: unknown,
): SafeParseFormResult<TFieldValues> {
  const result = schema.safeParse(values);

  if (!result.success) {
    return {
      success: false,
      data: null,
      formattedError: formatZodError(result.error),
    };
  }

  return {
    success: true,
    data: result.data,
    formattedError: null,
  };
}

/**
 * Parses form values and throws a safe validation error if invalid.
 *
 * Prefer safeParseFormValues for UI flows that should display field errors.
 */
export function parseFormValues<TFieldValues extends FieldValues>(
  schema: AsanchaZodSchema<TFieldValues>,
  values: unknown,
): TFieldValues {
  const result = safeParseFormValues(schema, values);

  if (!result.success) {
    const firstFormError = result.formattedError.formErrors[0];
    const firstFieldError = Object.values(result.formattedError.fieldErrors)
      .flat()
      .find((message) => typeof message === "string");

    throw new Error(
      firstFormError ||
        firstFieldError ||
        "Please check the form and try again.",
    );
  }

  return result.data;
}

/**
 * Checks whether unknown values pass a Zod schema.
 */
export function isValidFormValues<TFieldValues extends FieldValues>(
  schema: AsanchaZodSchema<TFieldValues>,
  values: unknown,
): values is TFieldValues {
  return schema.safeParse(values).success;
}
