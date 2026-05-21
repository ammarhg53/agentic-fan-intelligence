import type { ApiEnvelope, ApiErrorBody } from "@/types";

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(status: number, error: ApiErrorBody) {
    super(error.message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = error.code;
    this.details = error.details;
  }
}

interface ApiRequestOptions<TBody> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: TBody;
  signal?: AbortSignal;
}

export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<TResponse> | null;

  if (!payload) {
    throw new ApiClientError(response.status, {
      code: "INVALID_API_RESPONSE",
      message: "The API returned an unreadable response."
    });
  }

  if (!response.ok || !payload.success) {
    const error = payload.success
      ? {
          code: "HTTP_ERROR",
          message: `Request failed with status ${response.status}.`
        }
      : payload.error;

    throw new ApiClientError(response.status, error);
  }

  return payload.data;
}
