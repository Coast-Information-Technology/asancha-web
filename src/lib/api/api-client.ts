// File: src/lib/api/api-client.ts

/**
 * Asancha API Client
 *
 * Purpose:
 * Provides a typed fetch wrapper for communicating with the Asancha backend API.
 *
 * Important notes:
 * - The client expects the Asancha response envelope by default.
 * - It throws AsanchaApiError for failed requests.
 * - It does not expose raw backend errors, stack traces, ObjectIds,
 *   private KYC notes, internal admin notes, token hashes, API key hashes,
 *   webhook secrets, or payment provider secrets.
 * - Frontend checks are only UX guidance; backend enforcement remains final.
 */

import { AsanchaApiError } from "./api-error";
import { buildApiUrl } from "./api-routes";
import {
  AsanchaApiResponse,
  getDefaultApiErrorMessage,
  isAsanchaApiResponse,
} from "./api-response";

export type ApiHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestBody =
  BodyInit | Record<string, unknown> | readonly unknown[] | null | undefined;

export interface ApiClientRequestOptions<TBody = ApiRequestBody> extends Omit<
  RequestInit,
  "body" | "method"
> {
  method?: ApiHttpMethod;
  body?: TBody;
  skipEnvelope?: boolean;
}

export interface ApiClientConfig {
  defaultHeaders?: HeadersInit;
  credentials?: RequestCredentials;
}

/**
 * Checks whether a request body should be sent directly to fetch.
 */
function isNativeBodyInit(body: unknown): body is BodyInit {
  return (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  );
}

/**
 * Checks whether a request body is FormData.
 */
function isFormDataBody(body: unknown): body is FormData {
  return body instanceof FormData;
}

/**
 * Creates request headers while avoiding incorrect Content-Type for FormData.
 */
function createRequestHeaders(body: unknown, headers?: HeadersInit): Headers {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  if (
    body !== undefined &&
    body !== null &&
    !isFormDataBody(body) &&
    !requestHeaders.has("Content-Type")
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  return requestHeaders;
}

/**
 * Serializes supported request bodies.
 */
function serializeRequestBody(body: ApiRequestBody): BodyInit | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (isNativeBodyInit(body)) {
    return body;
  }

  return JSON.stringify(body);
}

/**
 * Safely parses response body as JSON when possible.
 */
async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await response.text();

    return text ? { message: text } : null;
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

/**
 * Handles a successful HTTP response and unwraps the Asancha response envelope.
 */
function unwrapApiResponse<TResponse>(
  response: Response,
  responseBody: unknown,
  skipEnvelope: boolean,
): TResponse {
  if (skipEnvelope) {
    return responseBody as TResponse;
  }

  if (!isAsanchaApiResponse<TResponse>(responseBody)) {
    throw new AsanchaApiError({
      code: "INVALID_API_RESPONSE",
      message: "The server returned an unexpected response. Please try again.",
      statusCode: response.status,
    });
  }

  if (!responseBody.success) {
    throw new AsanchaApiError({
      code: responseBody.error?.code ?? "REQUEST_FAILED",
      message:
        responseBody.error?.message ||
        responseBody.message ||
        getDefaultApiErrorMessage(response.status),
      statusCode: response.status,
      fieldErrors: responseBody.error?.fieldErrors,
      meta: responseBody.meta,
    });
  }

  return responseBody.data;
}

/**
 * Sends a request to the Asancha API and returns the typed response data.
 */
export async function apiRequest<TResponse, TBody = ApiRequestBody>(
  path: string,
  options: ApiClientRequestOptions<TBody> = {},
  config: ApiClientConfig = {},
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    headers,
    skipEnvelope = false,
    ...requestOptions
  } = options;

  const url = buildApiUrl(path);
  const requestBody = serializeRequestBody(body as ApiRequestBody);

  const requestHeaders = createRequestHeaders(body, {
    ...config.defaultHeaders,
    ...headers,
  });

  const response = await fetch(url, {
    ...requestOptions,
    method,
    body: requestBody,
    headers: requestHeaders,
    credentials: config.credentials ?? requestOptions.credentials ?? "include",
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    throw AsanchaApiError.fromResponse(response, responseBody);
  }

  return unwrapApiResponse<TResponse>(response, responseBody, skipEnvelope);
}

/**
 * Sends a GET request to the Asancha API.
 */
export function apiGet<TResponse>(
  path: string,
  options: Omit<ApiClientRequestOptions, "method" | "body"> = {},
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    ...options,
    method: "GET",
  });
}

/**
 * Sends a POST request to the Asancha API.
 */
export function apiPost<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  return apiRequest<TResponse, TBody>(path, {
    ...options,
    method: "POST",
    body,
  });
}

/**
 * Sends a PUT request to the Asancha API.
 */
export function apiPut<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  return apiRequest<TResponse, TBody>(path, {
    ...options,
    method: "PUT",
    body,
  });
}

/**
 * Sends a PATCH request to the Asancha API.
 */
export function apiPatch<TResponse, TBody = ApiRequestBody>(
  path: string,
  body?: TBody,
  options: Omit<ApiClientRequestOptions<TBody>, "method" | "body"> = {},
): Promise<TResponse> {
  return apiRequest<TResponse, TBody>(path, {
    ...options,
    method: "PATCH",
    body,
  });
}

/**
 * Sends a DELETE request to the Asancha API.
 */
export function apiDelete<TResponse>(
  path: string,
  options: Omit<ApiClientRequestOptions, "method" | "body"> = {},
): Promise<TResponse> {
  return apiRequest<TResponse>(path, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Sends a request and returns the full Asancha response envelope.
 *
 * Use this only when the UI needs response metadata directly.
 */
export async function apiEnvelopeRequest<TResponse, TBody = ApiRequestBody>(
  path: string,
  options: ApiClientRequestOptions<TBody> = {},
): Promise<AsanchaApiResponse<TResponse>> {
  return apiRequest<AsanchaApiResponse<TResponse>, TBody>(path, {
    ...options,
    skipEnvelope: true,
  });
}
