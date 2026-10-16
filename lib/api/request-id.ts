import { getLogContext } from "@omnipink/logger/context";

import { isMutatingMethod } from "../pre-launch";
import { newRequestId } from "./config";

/**
 * True for a server-side read that Next.js never keeps in its data cache.
 *
 * Next keys that cache (and its per-render fetch dedupe) on the request
 * headers, and it cannot leave a header out of the key (only
 * `traceparent`/`tracestate`). A per-request ID on a cached fetch would make
 * every request a cache miss and write a new cache entry each time. So a read
 * gets the ID only when it opts out of the cache explicitly: a wrong guess then
 * costs an ID in the log, never the cache.
 */
function isUncachedRead(init: RequestInit | undefined): boolean {
  return init?.cache === "no-store" || init?.cache === "no-cache" || init?.next?.revalidate === 0;
}

/**
 * The `x-request-id` to send on a backend call that has none (INF-75, INF-83).
 *
 * - Browser: a new ID on every call. The `/api/*` proxy and the backend keep a
 *   well-formed incoming ID, so this ID is in every log line of the request.
 *   It is also the reference code when a gateway answers instead of the
 *   backend (a Fly 503 has no `x-request-id`).
 * - Server, inside a request context (`lib/request-context.ts`): the ID of the
 *   incoming request, read from the logger's context, so the backend lines
 *   match the frontend lines and the reference code of a server-rendered page.
 *   Only on a mutation or an uncached read (see {@link isUncachedRead}).
 * - Server, outside a context: a new ID for a mutation (it is never cached),
 *   else none.
 *
 * This module also runs in the browser. There, `@omnipink/logger/context`
 * resolves to its `browser` build, which has no Node import and no context
 * (logger 2.0, INF-90).
 */
export function outgoingRequestId(init?: RequestInit): string | undefined {
  if (typeof window !== "undefined") return newRequestId();
  const mutating = isMutatingMethod(init?.method);
  if (!mutating && !isUncachedRead(init)) return undefined;
  return getLogContext()?.request_id ?? (mutating ? newRequestId() : undefined);
}
