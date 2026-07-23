// File: app/api/auth/_lib/backend-auth-proxy.ts

import { buildApiUrl } from "@/src/lib/api/api-routes";

export async function proxyBackendAuthRequest(
  path: string,
  init: RequestInit,
): Promise<Response> {
  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("X-Asancha-Client")) {
    headers.set("X-Asancha-Client", "asancha-web");
  }

  return fetch(buildApiUrl(path), {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function readJsonBody(response: Response): Promise<unknown> {
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

export function getEnvelopeData<TData>(body: unknown): TData | null {
  if (
    body &&
    typeof body === "object" &&
    "success" in body &&
    "data" in body &&
    (body as { success?: unknown }).success === true
  ) {
    return (body as { data: TData }).data;
  }

  return null;
}
