import { REQUEST_ID_HEADER } from "@omnipink/logger/context";
import * as Sentry from "@sentry/nextjs";

import {
  IS_PRE_LAUNCH_LOCKED,
  isMutatingMethod,
  isPreLaunchLockedApiPath,
  PRE_LAUNCH_API_ERROR_CODE,
} from "../pre-launch";
import { BRAND_HOST_HEADER, CLIENT_API_ORIGIN, resolveAppPublicHost } from "./config";
import { fetchBackend } from "./report-api-failure";
import { outgoingRequestId } from "./request-id";
import type { FieldModeration, FieldModerationDetails } from "./types";

/** Error body shape produced by the backend's ApiError.toJSON(). */
type ApiErrorBody = {
  error?: string;
  message?: string;
  statusCode?: number;
  /** The request's `request_id` in the backend logs (INF-74). */
  requestId?: string;
  restorableUntil?: string;
  moderation?: FieldModeration;
  moderation_details?: FieldModerationDetails;
};

export class ApiRequestError extends Error {
  readonly status: number;
  /** Backend error code, e.g. "INSUFFICIENT_COINS", "UNAUTHORIZED". */
  readonly code: string;
  readonly restorableUntil?: string;
  /** Per-field content-moderation verdicts, on a moderation refusal (BACK-391). */
  readonly moderation?: FieldModeration;
  /** Why each rejected field was refused, on a moderation refusal. */
  readonly moderationDetails?: FieldModerationDetails;
  /**
   * The request ID that finds this request in the frontend and backend logs.
   * Error screens show it as a reference code (INF-75).
   */
  readonly requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    restorableUntil?: string,
    moderation?: FieldModeration,
    moderationDetails?: FieldModerationDetails,
    requestId?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.restorableUntil = restorableUntil;
    this.moderation = moderation;
    this.moderationDetails = moderationDetails;
    this.requestId = requestId;
  }
}

/** The request ID an `apiFetch` call that got no response was sent with. A
 * WeakMap, not a wrapper error, so the error keeps its own type. */
const networkFailureRequestIds = new WeakMap<object, string>();

/** The request ID of a failed API call, or undefined for any other error. */
export function requestIdOf(error: unknown): string | undefined {
  if (error instanceof ApiRequestError) return error.requestId;
  return typeof error === "object" && error !== null
    ? networkFailureRequestIds.get(error)
    : undefined;
}

export function isInsufficientCoinsError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 402;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 401;
}

/** 403 — missing permission or, on edit-image, no premium membership. */
export function isForbiddenError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 403;
}

/**
 * The server looked at the request and refused it (4xx), so it definitely did
 * not act on it.
 *
 * Anything else is ambiguous and must not be read as "nothing happened". A
 * dropped connection or an unreadable body on an otherwise successful response
 * surfaces as some other error; a 5xx surfaces as an {@link ApiRequestError}
 * (see {@link isServerErrorResponse}) and may have been raised after the work
 * was already done. Callers of non-idempotent, paid endpoints must treat all of
 * those as "possibly applied".
 */
export function isClientErrorResponse(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError && error.status >= 400 && error.status < 500;
}

/**
 * The server answered with a 5xx. Unlike a dropped connection, it DID respond —
 * so copy must not blame the network — but the outcome of a non-idempotent
 * request is still unknown (a gateway 502/504 can arrive while the backend
 * carries on).
 */
export function isServerErrorResponse(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError && error.status >= 500;
}

let warnedMissingAppPublicHost = false;

/**
 * Tell the backend which Brand a SERVER-SIDE request is for.
 *
 * Browser requests need nothing: they are same-origin (see
 * {@link CLIENT_API_ORIGIN}) and carry a real `Origin` the backend resolves
 * from. Server-side there is no such header, so without this every brand-scoped
 * read comes back empty — see {@link resolveAppPublicHost} for the mechanism.
 */
function brandHostHeaders(): Record<string, string> {
  if (typeof window !== "undefined") return {};

  const appPublicHost = resolveAppPublicHost();

  if (!appPublicHost) {
    // Warn rather than throw: a missing brand host degrades brand-scoped reads
    // to empty results, which must not take the whole app down. But it must not
    // be silent either — an empty list is indistinguishable from "nothing
    // matched", which is precisely how this went unnoticed before. Sentry, not
    // the logger: this module also runs in the browser, and the logger is
    // Node-only. The log line comes from `checkAppPublicHost` at server start,
    // so the warning is not lost when Sentry has no DSN.
    if (!warnedMissingAppPublicHost && process.env.NODE_ENV === "production") {
      warnedMissingAppPublicHost = true;
      Sentry.captureMessage(
        "[api] APP_PUBLIC_HOST is not set. Server-side requests cannot identify " +
          "their Brand, so brand-scoped endpoints will return EMPTY results " +
          "instead of failing. Set it to this deployment's public host.",
        "warning",
      );
    }
    return {};
  }

  return { [BRAND_HOST_HEADER]: appPublicHost };
}

/**
 * Fetch against the backend with the session cookie attached.
 *
 * In the browser this goes to the app's own origin and is proxied to the
 * backend by the `next.config.ts` rewrite, which is what keeps the session
 * cookie first-party (see {@link CLIENT_API_ORIGIN}). `credentials: "include"`
 * stays regardless: it is required for the server-side path, which is still
 * cross-origin, and is harmless same-origin.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Pre-launch lock backstop. The UI gate (`PreLaunchGateProvider`) is what the
  // user actually sees; this is what makes the lock true — a stale tab, an
  // un-intercepted click or a console call cannot spend money or queue
  // generation work while the site is closed. Browser-only: server-side render
  // paths only read, and failing them would take the public pages down with it.
  if (
    IS_PRE_LAUNCH_LOCKED &&
    typeof window !== "undefined" &&
    isMutatingMethod(init?.method) &&
    isPreLaunchLockedApiPath(path)
  ) {
    // 423 Locked: the resource exists and the request was well-formed; the
    // deployment is simply not open yet.
    throw new ApiRequestError(
      423,
      PRE_LAUNCH_API_ERROR_CODE,
      "Spicestars is not open yet — this will be available at launch.",
    );
  }

  // See `outgoingRequestId` for which calls get which ID, and why a cached
  // server-side read gets none.
  const requestId = new Headers(init?.headers).get(REQUEST_ID_HEADER) ?? outgoingRequestId(init);
  const fetchInit: RequestInit = {
    ...init,
    credentials: "include",
    headers: {
      // FormData bodies must NOT get a JSON content type — the browser sets
      // the multipart boundary itself.
      ...(init?.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      // Made here, not only in `proxy.ts`: when the backend cannot be reached,
      // the error response comes from a proxy and carries no request ID, but
      // the reference code must still match the Sentry report of the failure.
      ...(requestId ? { [REQUEST_ID_HEADER]: requestId } : {}),
      ...brandHostHeaders(),
      // Caller-supplied headers win, so a route that must speak for a different
      // host can still override the brand header explicitly.
      ...init?.headers,
    },
  };
  let response: Response;
  try {
    response = await fetchBackend(`${CLIENT_API_ORIGIN}${path}`, fetchInit);
  } catch (error) {
    // No response, so no ApiRequestError: keep the ID beside the error, so the
    // reference code still matches the Sentry report of the network failure.
    if (requestId && typeof error === "object" && error !== null) {
      networkFailureRequestIds.set(error, requestId);
    }
    throw error;
  }

  if (!response.ok) {
    let body: ApiErrorBody = {};
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      // Non-JSON error body — fall through to the generic message.
    }

    throw new ApiRequestError(
      response.status,
      body.error ?? "REQUEST_FAILED",
      body.message ?? `Request failed with status ${response.status}`,
      body.restorableUntil,
      body.moderation,
      body.moderation_details,
      // The body carries it on a backend error. A proxy's error page has no
      // body field, but the response can still carry the header. Else it is
      // the ID this call was sent with.
      (typeof body.requestId === "string" && body.requestId) ||
        response.headers.get(REQUEST_ID_HEADER) ||
        requestId,
    );
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text.trim()) return {} as T;

  return JSON.parse(text) as T;
}
