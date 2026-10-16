import {
  getLogContext,
  REQUEST_ID_HEADER,
  resolveRequestId,
  runWithLogContext,
} from "@omnipink/logger/context";
import { headers } from "next/headers";

/*
 * The log context of one server request (INF-83). Node.js server code only:
 * the context needs `AsyncLocalStorage`, and the helpers read `headers()`.
 *
 * Inside the context, every logger line carries the request's `request_id`,
 * and every backend call through `fetchBackend` (and so `apiFetch`) sends it
 * as `x-request-id` (`outgoingRequestId` in `lib/api/request-id.ts`). The ID
 * is the one `proxy.ts` put on the request, so the frontend lines, the backend
 * lines and the reference code all match.
 *
 * The logger keeps its context on `globalThis` (2.0, INF-90), so every server
 * bundle (pages, route handlers, `instrumentation.ts`) reads the same context
 * even when each bundles its own copy of the package. Keep this code on the
 * Node.js runtime: the logger (pino) cannot run on the Edge runtime.
 */

/**
 * Run `fn` in the log context of the request with these headers. A nested call
 * keeps the ID of the outer context, so a page and the session check it calls
 * log one ID even when the request came without one.
 */
function runWithRequestContext<T>(requestHeaders: Pick<Headers, "get">, fn: () => T): T {
  const requestId =
    getLogContext()?.request_id ?? resolveRequestId(requestHeaders.get(REQUEST_ID_HEADER));
  return runWithLogContext({ request_id: requestId }, fn);
}

/**
 * A route handler that runs in the log context of its request:
 * `export const GET = withRequestContext(async (request) => { ... })`.
 */
export function withRequestContext<Args extends [Request, ...unknown[]], Result>(
  handler: (...args: Args) => Result,
): (...args: Args) => Result {
  return (...args) => runWithRequestContext(args[0].headers, () => handler(...args));
}

/**
 * Run `fn` in the log context of the current request, for a server action or
 * a server component. It reads `headers()`, which makes the route render on
 * each request: use it only in code that is already dynamic (it reads cookies
 * or headers), never in a prerendered or ISR page.
 *
 * The context covers only `fn`. React renders the child components of a server
 * component outside it, so wrap the code that calls the backend or logs.
 */
export async function runInRequestContext<T>(fn: () => Promise<T>): Promise<T> {
  return runWithRequestContext(await headers(), fn);
}

/**
 * A dynamic page, `generateMetadata` or page helper that runs in the log
 * context of its request:
 * `export default withPageRequestContext(async function Page(props) { ... })`.
 *
 * Everything the function awaits gets the request's `request_id`: the session
 * check, but also a CMS fetch after it that logs an outage. The same rule as
 * {@link runInRequestContext}: only in code that is already dynamic. The child
 * components that the page returns still render outside the context.
 */
export function withPageRequestContext<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result> {
  return (...args) => runInRequestContext(() => fn(...args));
}
