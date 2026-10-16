/**
 * Backend origin (`NEXT_PUBLIC_*` is inlined into the client bundle at build time).
 *
 * - Production builds require an explicit value (CI / Vercel / `.env.production*`).
 * - Local `next dev` may omit it and fall back to the local Fastify default.
 */
const LOCAL_DEV_API_BASE_URL = "http://localhost:3369";

function resolveApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_API_BASE_URL is not set. It is inlined at build time — " +
          "set it in the host/CI environment, or copy .env.local.example before building.",
      );
    }
    return LOCAL_DEV_API_BASE_URL;
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`NEXT_PUBLIC_API_BASE_URL is not a valid URL: ${JSON.stringify(raw)}`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      `NEXT_PUBLIC_API_BASE_URL must be http(s), got ${JSON.stringify(url.protocol)}`,
    );
  }

  return raw.replace(/\/+$/, "");
}

export const API_BASE_URL = resolveApiBaseUrl();

/**
 * True for local `next dev`, hosts pointed at the test/local API, or the
 * Vercel "dev" preview hostname. `NODE_ENV === "development"` alone is not
 * enough — preview/prod builds both run with `NODE_ENV=production`.
 */
export function isNonProductionClientTarget(): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  try {
    const host = new URL(API_BASE_URL).hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.includes("backend-test") ||
      host.startsWith("test.api.")
    ) {
      return true;
    }
  } catch {
    // Invalid URL already guarded at resolve time; keep this resilient for tests.
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    // Preview URL pattern from README: spicestars-frontend-dev-….vercel.app
    if (host.includes("-dev-") || host === "localhost" || host === "127.0.0.1") {
      return true;
    }
  }

  return false;
}

/**
 * Every backend route lives under this prefix (`/api/v1/...`, including Better
 * Auth at `/api/v1/auth`), so proxying it wholesale is enough. Shared with
 * `next.config.ts`, which rewrites it to {@link API_BASE_URL} — keep the two in
 * step or the browser will call a path nothing forwards.
 */
export const API_PATH_PREFIX = "/api";

/**
 * Origin the BROWSER prefixes onto API paths — its OWN origin, not the backend's.
 *
 * The backend is on a different registrable domain (`*.fly.dev` vs the app's
 * `*.vercel.app`; both are on the Public Suffix List, so they are separate sites
 * however similar the names look). A session cookie set from there is therefore
 * a third-party cookie, and every browser on iOS/iPadOS blocks those by default
 * — Safari's "Prevent Cross-Site Tracking", which Chrome/Firefox/Edge on iOS
 * inherit because they are all WebKit. The `Set-Cookie` from signup or login is
 * silently dropped and every authed call afterwards 401s. See BACK-54.
 *
 * Routing browser traffic through the app's own origin makes the backend
 * first-party: `next.config.ts` rewrites {@link API_PATH_PREFIX} to
 * {@link API_BASE_URL} server-side, so the browser only ever sees its own
 * origin and stores the cookie as first-party. This is Better Auth's own
 * recommendation for Safari.
 *
 * Server-side (SSR, route handlers) there is no origin to be relative to and no
 * cookie policy to satisfy, so calls go straight to the backend.
 */
export const CLIENT_API_ORIGIN =
  typeof window === "undefined" ? API_BASE_URL : window.location.origin;

/**
 * A new request ID for an outgoing API call, or `undefined` where the runtime
 * has no `crypto.randomUUID` (a browser on a plain-HTTP origin other than
 * localhost). The proxy and the backend keep a well-formed incoming ID, so the
 * ID made here is the one in every log line for the request.
 */
export function newRequestId(): string | undefined {
  return globalThis.crypto?.randomUUID?.();
}

/**
 * The app's own PUBLIC host, sent server-side so the backend can work out which
 * Brand a request belongs to. Server-only — deliberately not `NEXT_PUBLIC_`,
 * since the browser never needs it (see {@link CLIENT_API_ORIGIN}: browser
 * traffic is same-origin and already carries a real `Origin`).
 *
 * The backend resolves a Brand from `origin ?? x-forwarded-host ?? host`
 * (`src/plugins/brand.ts`) and matches it against `Brand.domain`. A server-side
 * `fetch` supplies neither of the first two, so it falls through to `host` —
 * which is the BACKEND's own hostname, never a `Brand.domain`. Brand resolution
 * is fail-closed, so every brand-scoped read then returns an empty list.
 *
 * That failure is invisible: `GET /characters/fetch-default` answers
 * `{"items":[],"total":0}`, indistinguishable from a filter that genuinely
 * matches nothing. It works in local dev only because a localhost origin hits
 * the backend's `DEV_BRAND_SLUG` fallback, so the bug appears exclusively on
 * deployed environments.
 *
 * Set to the host the app is served from, matching the `Brand.domain` row —
 * bare (`spicestars.ai`) or as a URL, both normalise to the host.
 *
 * Resolved on demand rather than into a module-level const: an eager const is
 * captured at import time, which makes it untestable without `vi.resetModules()`
 * and dynamic-import gymnastics, and freezes the value for the process.
 */
export function resolveAppPublicHost(): string | undefined {
  const raw = process.env.APP_PUBLIC_HOST?.trim();
  if (!raw) return undefined;

  // Accept a full URL as well as a bare host, so an operator pasting
  // "https://spicestars.ai/" gets the same result as "spicestars.ai".
  try {
    const parsedHost = new URL(raw).host;
    if (parsedHost) return parsedHost;
  } catch {
    // A bare hostname is expected and handled below.
  }

  return raw.replace(/^\/+|\/+$/g, "");
}

/**
 * Header the backend reads (second in its precedence chain) to resolve a Brand.
 * Not `Origin`: that is a browser-managed header whose meaning is "this request
 * was initiated by a document at X", which is untrue of a server-to-server
 * call. `X-Forwarded-Host` says "the public host this request is on behalf of",
 * which is exactly what we mean, and the backend honours it ahead of `Host`.
 */
export const BRAND_HOST_HEADER = "X-Forwarded-Host";

/**
 * Absolute URL for an app path, to hand Better Auth's client actions
 * (`changeEmail`, `sendVerificationEmail`, ...) as a `callbackURL`.
 *
 * Better Auth builds the emailed link against ITS OWN base URL (the backend
 * origin), not the app's, then 302-redirects the browser to `callbackURL`
 * once the token is verified — a bare path there (e.g. `ROUTES.settings`)
 * resolves relative to the backend, not the app, and sends the user to
 * `<backend origin>/settings`, a route that doesn't exist there. There is no
 * server-side hook for these client-invoked actions to fix this centrally the
 * way signup's `user.create.after` does with `config.FRONTEND_URL` — always
 * go through this helper instead of passing a `ROUTES.*` path directly, so
 * every one resolves against wherever this app is actually running (a
 * localhost port, a Vercel preview subdomain, production — {@link
 * CLIENT_API_ORIGIN} is already correct in every one of those).
 */
export function absoluteAppUrl(path: string): string {
  return `${CLIENT_API_ORIGIN}${path}`;
}
