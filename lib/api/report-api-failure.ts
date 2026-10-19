import * as Sentry from "@sentry/nextjs";

/**
 * Report the API failures the backend cannot see (BACK-413).
 *
 * The backend reports every 5xx it sends itself. Two failures never reach it:
 *
 * - `network` — `fetch` rejected, so no response arrived at all.
 * - `gateway` — a 5xx without {@link BACKEND_RESPONSE_HEADER}: a proxy in front
 *   of the backend answered instead. During a deploy of a single-machine app,
 *   Fly's proxy answers 503 and the backend never hears of the request.
 *
 * A 5xx that carries the header is not reported here, so one failure files one
 * Sentry issue, not two.
 *
 * All `network` failures are one Sentry issue, whatever the endpoint: when the
 * user's connection drops (a Wi-Fi change, a wake from sleep), every call the
 * page has in flight fails at once, and `navigator.onLine` often stays `true`.
 * The `api_route` tag still tells the endpoints apart.
 */
export type ApiFailure = (
  | { kind: "network"; method: string; path: string; error: unknown }
  | { kind: "gateway"; method: string; path: string; status: number }
) & {
  /**
   * The `x-request-id` the request was sent with, if any. The error toast shows
   * it as the reference code, so the report carries it as a tag.
   */
  requestId?: string;
};

/** The backend sets it on every response it sends; a proxy's response lacks it. */
export const BACKEND_RESPONSE_HEADER = "x-spicestars-backend";

/**
 * At most one report per page (or server process) in this window: per endpoint
 * for a `gateway` failure, for all endpoints together for a `network` one.
 */
export const API_FAILURE_REPORT_INTERVAL_MS = 60_000;
const lastReport = new Map<string, number>();

/**
 * The endpoint a pathname calls, with no ids, so Sentry groups by endpoint and
 * never stores an id: `/api/v1/characters/fetch-by-id/cmuw…` →
 * `/api/v1/characters/fetch-by-id/:id`. A segment with a digit and at least
 * eight characters is an id (a cuid, a uuid, an idempotency key); `v1` is not.
 */
export function apiRouteOf(pathname: string): string {
  return pathname
    .split("/")
    .map((segment) => (segment.length >= 8 && /\d/.test(segment) ? ":id" : segment))
    .join("/");
}

/** A failure that is the user's own doing or their connection's, not ours. */
function isExpectedNetworkFailure(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") return true;
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

export function reportApiFailure(failure: ApiFailure, now: number = Date.now()): void {
  const { kind, method } = failure;
  if (kind === "network" && isExpectedNetworkFailure(failure.error)) return;

  const route = apiRouteOf(failure.path);
  const status = kind === "network" ? "none" : String(failure.status);
  const fingerprint =
    kind === "network" ? ["api-failure", kind] : ["api-failure", kind, method, route, status];

  const key = fingerprint.join(" ");
  const last = lastReport.get(key);
  if (last !== undefined && now - last < API_FAILURE_REPORT_INTERVAL_MS) return;
  lastReport.set(key, now);

  const error =
    kind === "network"
      ? new Error(`API request got no response: ${method} ${route}`)
      : new Error(`API ${status} from a proxy, not the backend: ${method} ${route}`);
  error.name = kind === "network" ? "ApiNetworkError" : "ApiGatewayError";

  try {
    Sentry.withScope((scope) => {
      scope.setLevel("warning");
      scope.setFingerprint(fingerprint);
      scope.setTags({
        api_failure: kind,
        api_method: method,
        api_route: route,
        api_status: status,
        ...(failure.requestId ? { request_id: failure.requestId } : {}),
      });
      if (kind === "network" && failure.error instanceof Error) {
        // The browser's own wording ("Failed to fetch", "Load failed"), never content.
        scope.setExtra("fetch_error", `${failure.error.name}: ${failure.error.message}`);
      }
      Sentry.captureException(error);
    });
  } catch {
    // A reporting failure must never change what the caller sees.
  }
}

/** Backend calls are disabled. This returns an empty response and does not use the network. */
export async function fetchBackend(
  input: string | URL | Request,
  _init?: RequestInit,
): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  return new Response(null, {
    status: 204,
    headers: { "x-playstar-api": "disabled", "x-playstar-path": url },
  });
}
