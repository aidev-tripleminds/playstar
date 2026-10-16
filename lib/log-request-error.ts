import { REQUEST_ID_HEADER } from "@omnipink/logger";
import type { Instrumentation } from "next";

import { logger } from "./logger";

const log = logger.child({ name: "request-error" });

/** The first value of a request header that Next.js gives as a string or a list. */
function headerValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Write one log line for an error that Next.js caught on the server: in a
 * server component, a route handler, a server action or the proxy.
 *
 * - `request_id` is the ID that `proxy.ts` put on the request. It also finds
 *   the backend's lines for the same request.
 * - `digest` is the code that Next.js gives the browser in place of the error.
 *   The error screen shows it when it has no request ID.
 * - The route is the route file path (`/[...path]`), never the URL. A URL can
 *   hold IDs and a query string with a credential (`/auth/handoff`).
 */
export function logRequestError(
  ...[error, request, context]: Parameters<Instrumentation.onRequestError>
): void {
  const digest =
    typeof error === "object" && error !== null && "digest" in error
      ? String(error.digest)
      : undefined;
  log.error(
    {
      err: error,
      digest,
      request_id: headerValue(request.headers[REQUEST_ID_HEADER]),
      method: request.method,
      route: context.routePath,
      route_type: context.routeType,
    },
    "server request failed",
  );
}
