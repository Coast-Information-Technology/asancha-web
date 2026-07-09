// File: src/lib/api/api-error.ts

/**
 * Asancha API Error
 *
 * Purpose:
 * Provides a safe typed error class for failed API requests.
 *
 * Important notes:
 * - This class stores safe error data only.
 * - It must not expose stack traces, database internals, token hashes,
 *   API key hashes, webhook secrets, private KYC notes, internal admin notes,
 *   or raw provider payloads in the UI.
 * - Use this error class when rendering form errors, toast messages,
 *   locked-action messages, and API failure states.
 */

import {
  AsanchaFieldErrors,
  AsanchaApiMeta,
  createFallbackApiMeta,
  getDefaultApiErrorMessage,
  getSafeErrorCodeFromUnknown,
  getSafeFieldErrorsFromUnknown,
  getSafeMessageFromUnknown,
  isAsanchaApiFailureResponse,
  isAsanchaApiResponse,
  isRecord,
} from "./api-response";

export interface AsanchaApiErrorOptions {
  code: string;
  message: string;
  statusCode?: number;
  fieldErrors?: AsanchaFieldErrors;
  meta?: AsanchaApiMeta;
  cause?: unknown;
}

/**
 * Safe frontend error type for Asancha API failures.
 */
export class AsanchaApiError extends Error {
  public readonly code: string;

  public readonly statusCode?: number;

  public readonly fieldErrors?: AsanchaFieldErrors;

  public readonly meta: AsanchaApiMeta;

  public readonly cause?: unknown;

  public constructor(options: AsanchaApiErrorOptions) {
    super(options.message);

    this.name = "AsanchaApiError";
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.fieldErrors = options.fieldErrors;
    this.meta = options.meta ?? createFallbackApiMeta(options.statusCode);
    this.cause = options.cause;
  }

  /**
   * Creates an AsanchaApiError from a failed fetch response and unknown body.
   */
  public static fromResponse(
    response: Response,
    responseBody: unknown,
  ): AsanchaApiError {
    const fallbackMessage = getDefaultApiErrorMessage(response.status);

    if (isAsanchaApiFailureResponse(responseBody)) {
      return new AsanchaApiError({
        code: responseBody.error.code,
        message: responseBody.error.message || responseBody.message,
        statusCode: response.status,
        fieldErrors: responseBody.error.fieldErrors,
        meta: responseBody.meta,
      });
    }

    if (isAsanchaApiResponse(responseBody)) {
      return new AsanchaApiError({
        code: getSafeErrorCodeFromUnknown(responseBody),
        message: getSafeMessageFromUnknown(responseBody, fallbackMessage),
        statusCode: response.status,
        fieldErrors: getSafeFieldErrorsFromUnknown(responseBody),
        meta: responseBody.meta,
      });
    }

    return new AsanchaApiError({
      code: getSafeErrorCodeFromUnknown(responseBody),
      message: getSafeMessageFromUnknown(responseBody, fallbackMessage),
      statusCode: response.status,
      fieldErrors: getSafeFieldErrorsFromUnknown(responseBody),
      meta: createFallbackApiMeta(response.status),
    });
  }

  /**
   * Creates a safe API error from an unknown thrown value.
   */
  public static fromUnknown(error: unknown): AsanchaApiError {
    if (error instanceof AsanchaApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new AsanchaApiError({
        code: "CLIENT_REQUEST_FAILED",
        message: error.message || "Request failed. Please try again.",
        meta: createFallbackApiMeta(),
        cause: error,
      });
    }

    if (isRecord(error)) {
      return new AsanchaApiError({
        code: getSafeErrorCodeFromUnknown(error, "CLIENT_REQUEST_FAILED"),
        message: getSafeMessageFromUnknown(
          error,
          "Request failed. Please try again.",
        ),
        fieldErrors: getSafeFieldErrorsFromUnknown(error),
        meta: createFallbackApiMeta(),
        cause: error,
      });
    }

    return new AsanchaApiError({
      code: "CLIENT_REQUEST_FAILED",
      message: "Request failed. Please try again.",
      meta: createFallbackApiMeta(),
      cause: error,
    });
  }

  /**
   * Returns true when the error means the user should be sent to sign in again.
   */
  public isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /**
   * Returns true when the error means the user is authenticated but not allowed.
   */
  public isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Returns true when the error is a validation-style failure.
   */
  public isValidationError(): boolean {
    return this.statusCode === 400 || this.statusCode === 422;
  }

  /**
   * Returns the safe user-facing error message.
   */
  public toUserMessage(): string {
    return this.message || getDefaultApiErrorMessage(this.statusCode);
  }
}

/**
 * Checks whether an unknown value is an AsanchaApiError.
 */
export function isAsanchaApiError(error: unknown): error is AsanchaApiError {
  return error instanceof AsanchaApiError;
}
