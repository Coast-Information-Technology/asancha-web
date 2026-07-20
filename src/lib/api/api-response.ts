// File: src/lib/api/api-response.ts

/**
 * Asancha API Response Types and Guards
 *
 * Purpose:
 * Defines the shared frontend representation of the Asancha API response
 * envelope and provides safe helpers for detecting response shapes.
 *
 * Important notes:
 * - All API responses should follow the Asancha response envelope.
 * - Public UI must not expose internal stack traces, MongoDB ObjectIds,
 *   private KYC notes, internal admin notes, token hashes, API key hashes,
 *   webhook secrets, or payment provider secrets.
 * - These helpers intentionally use `unknown` instead of `any`.
 */

export type AsanchaFieldErrors = Record<string, string[]>;

export interface AsanchaApiErrorDetail {
  code: string;
  message: string;
  fieldErrors?: AsanchaFieldErrors;
}

export interface AsanchaApiMeta {
  requestId?: string;
  timestamp?: string;
  path?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export interface AsanchaApiResponse<TData = unknown> {
  success: boolean;
  message: string;
  data: TData;
  error: AsanchaApiErrorDetail | null;
  meta: AsanchaApiMeta;
}

export interface AsanchaApiSuccessResponse<
  TData = unknown,
> extends AsanchaApiResponse<TData> {
  success: true;
  error: null;
}

export interface AsanchaApiFailureResponse extends AsanchaApiResponse<null> {
  success: false;
  data: null;
  error: AsanchaApiErrorDetail;
}

export type AsanchaApiEnvelope<TData = unknown> =
  AsanchaApiSuccessResponse<TData> | AsanchaApiFailureResponse;

/**
 * Checks whether a value is a plain object-like record.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Safely checks whether a value has the minimum Asancha response envelope shape.
 */
export function isAsanchaApiResponse<TData = unknown>(
  value: unknown,
): value is AsanchaApiResponse<TData> {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.success === "boolean" &&
    typeof value.message === "string" &&
    "data" in value &&
    "error" in value &&
    isRecord(value.meta)
  );
}

/**
 * Safely checks whether a value has the Asancha API error detail shape.
 */
export function isAsanchaApiErrorDetail(
  value: unknown,
): value is AsanchaApiErrorDetail {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.code === "string" && typeof value.message === "string";
}

/**
 * Safely checks whether a response envelope is a successful response.
 */
export function isAsanchaApiSuccessResponse<TData = unknown>(
  value: unknown,
): value is AsanchaApiSuccessResponse<TData> {
  return isAsanchaApiResponse<TData>(value) && value.success === true;
}

/**
 * Safely checks whether a response envelope is a failed response.
 */
export function isAsanchaApiFailureResponse(
  value: unknown,
): value is AsanchaApiFailureResponse {
  return (
    isAsanchaApiResponse<null>(value) &&
    value.success === false &&
    isAsanchaApiErrorDetail(value.error)
  );
}

/**
 * Returns a safe fallback message for unknown API failures.
 */
export function getDefaultApiErrorMessage(statusCode?: number): string {
  if (statusCode === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (statusCode === 403) {
    return "You do not have permission to perform this action.";
  }

  if (statusCode === 404) {
    return "We could not find that record. Please refresh and try again.";
  }

  if (statusCode === 409) {
    return "This action could not be completed because the record has changed.";
  }

  if (statusCode === 422) {
    return "Please check the information provided and try again.";
  }

  if (statusCode && statusCode >= 500) {
    return "Something went wrong on our side. Please try again.";
  }

  return "Request failed. Please try again.";
}

/**
 * Extracts a safe message from an unknown API response body.
 */
export function getSafeMessageFromUnknown(
  value: unknown,
  fallbackMessage = "Request failed. Please try again.",
): string {
  if (isAsanchaApiResponse(value)) {
    return value.error?.message || value.message || fallbackMessage;
  }

  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }

  return fallbackMessage;
}

/**
 * Extracts a safe error code from an unknown API response body.
 */
export function getSafeErrorCodeFromUnknown(
  value: unknown,
  fallbackCode = "REQUEST_FAILED",
): string {
  if (isAsanchaApiFailureResponse(value)) {
    return value.error.code;
  }

  if (isRecord(value) && typeof value.code === "string") {
    return value.code;
  }

  return fallbackCode;
}

/**
 * Extracts safe field errors from an unknown API response body.
 */
export function getSafeFieldErrorsFromUnknown(
  value: unknown,
): AsanchaFieldErrors | undefined {
  if (isAsanchaApiFailureResponse(value)) {
    return value.error.fieldErrors;
  }

  if (!isRecord(value) || !isRecord(value.fieldErrors)) {
    return undefined;
  }

  const fieldErrors: AsanchaFieldErrors = {};

  Object.entries(value.fieldErrors).forEach(([fieldName, fieldValue]) => {
    if (
      Array.isArray(fieldValue) &&
      fieldValue.every((message) => typeof message === "string")
    ) {
      fieldErrors[fieldName] = fieldValue;
    }
  });

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}

/**
 * Creates a safe empty API meta object for fallback client-side errors.
 */
export function createFallbackApiMeta(statusCode?: number): AsanchaApiMeta {
  return {
    statusCode,
    timestamp: new Date().toISOString(),
  };
}
