import type { BrowserOptions, getDefaultIntegrations, replayIntegration } from "@sentry/nextjs";

import { SERVICE_NAME } from "../service-name";
import { resolveSentryEnvironment, type SentryEnv } from "./environment";
import {
  ALLOWED_REQUEST_HEADERS,
  ALLOWED_RESPONSE_HEADERS,
  scrubBreadcrumb,
  scrubEvent,
  scrubSentryLog,
  scrubSentrySpan,
} from "./scrub";

/**
 * The `Sentry.init` options the browser, Node and Edge runtimes share.
 *
 * One definition, so a privacy rule cannot be added to one runtime and
 * forgotten in another. The caller keeps `Sentry.init` itself and adds what is
 * specific to its runtime (Session Replay and trace propagation in the browser).
 */

/** Which runtime is reporting. Becomes the `runtime` attribute and tag. */
export type SentryRuntime = "browser" | "server" | "edge";

/** Production traces 10 % of page loads and requests; everywhere else traces all of them. */
export function resolveTracesSampleRate(environment: string): number {
  return environment === "production" ? 0.1 : 1.0;
}

/**
 * Read the variables explicitly, one by one. `next build` inlines each
 * `process.env.NEXT_PUBLIC_*` it sees written out in full; passing
 * `process.env` around as an object would leave them undefined in the browser.
 */
function readSentryEnv(): SentryEnv {
  return {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
  };
}

/**
 * What the SDK may collect. v11 replaced `sendDefaultPii` with this, and an
 * unset `dataCollection` now collects MORE than v10 did (user IP, cookies,
 * request/response bodies, local variables, AI inputs/outputs). So every
 * category is spelled out here, each as strict as or stricter than v10 with
 * `sendDefaultPii: false`:
 *
 * - `userInfo: false` — no `user.*` from instrumentation, and the browser tells
 *   Sentry's ingest never to infer the IP address (`infer_ip: never`).
 * - `cookies: false`, `httpBodies: []` — never collected.
 * - `httpHeaders` — an allowlist of harmless headers. v10 sent every header
 *   minus a PII denylist; no Cookie, Authorization or Referer can get through.
 * - `urlQueryParams: false` — stricter than v10, which collected them. Presigned
 *   media URLs and the auth handoff token live in query strings.
 * - `stackFrameVariables: false` — local variables can hold a chat message.
 * - `genAI`, `graphQL`, `databaseQueryData`, `queues` — all off.
 *
 * `scrub.ts` still runs on top of this; this decides what is collected, the
 * scrubbers clean what is collected.
 */
export const SENTRY_DATA_COLLECTION = {
  userInfo: false,
  cookies: false,
  httpHeaders: {
    request: { allow: [...ALLOWED_REQUEST_HEADERS] },
    response: { allow: [...ALLOWED_RESPONSE_HEADERS] },
  },
  httpBodies: [],
  urlQueryParams: false,
  genAI: { inputs: false, outputs: false },
  graphQL: { document: false, variables: false },
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
} satisfies NonNullable<BrowserOptions["dataCollection"]>;

/** `@sentry/nextjs` does not re-export the `Integration` type itself. */
type Integration = ReturnType<typeof getDefaultIntegrations>[number];

/**
 * The default integrations minus `Console`, in every runtime. A `console.log`
 * of a chat message or an API error body would otherwise ride along with the
 * next error as a breadcrumb. `scrubBreadcrumb` drops any console breadcrumb
 * that arrives another way.
 */
export function withoutConsoleIntegration(defaults: Integration[]): Integration[] {
  return defaults.filter((integration) => integration.name !== "Console");
}

export function sharedSentryOptions(runtime: SentryRuntime, env: SentryEnv = readSentryEnv()) {
  const dsn = env.NEXT_PUBLIC_SENTRY_DSN || undefined;
  const environment = resolveSentryEnvironment(env);

  return {
    // Unset DSN = SDK disabled: local dev and any deployment without the
    // variable send nothing. `enabled` says so explicitly instead of relying on
    // the SDK treating an undefined DSN as off.
    dsn,
    enabled: Boolean(dsn),
    environment,
    // The release is not set here: `withSentryConfig` injects
    // VERCEL_GIT_COMMIT_SHA into every bundle and creates the release itself.
    tracesSampleRate: resolveTracesSampleRate(environment),
    integrations: withoutConsoleIntegration,
    // No IP address, cookies, request bodies or user details. This is an
    // adult platform with private chats; Sentry gets stack traces, not people.
    dataCollection: SENTRY_DATA_COLLECTION,
    // Sentry Logs are captured whenever `Sentry.logger.*` is called (v11 has no
    // `enableLogs` switch); `beforeSendLog` scrubs them like every other channel.
    beforeSendLog: scrubSentryLog,
    beforeBreadcrumb: scrubBreadcrumb,
    beforeSend: scrubEvent,
    // Spans are streamed (the v11 default), so there are no transaction events
    // and `beforeSendTransaction` would never run: the root ("segment") span is
    // scrubbed by `beforeSendSpan` like every other span.
    beforeSendSpan: scrubSentrySpan,
    // Tags reach errors only; spans and logs get `service.name` and `runtime`
    // from `sentryServiceAttributes`.
    initialScope: { tags: { runtime } },
  } satisfies BrowserOptions;
}

/**
 * Same-origin `/api` only. The browser reaches the backend through this app's
 * own origin (the `/api/*` rewrite in next.config.ts), so that is the only
 * place a `sentry-trace` / `baggage` header can join a backend trace. Every
 * third party — Prismic, Tigris, Google, analytics — must never receive them.
 *
 * The routes the app polls every few seconds are left out. A tab sampled at
 * page load sends `sampled=1` on every later fetch, so each poll became a
 * backend trace and used most of the Sentry span quota (October 2026). The
 * backend samples these routes at a low rate of its own.
 */
const POLLED_API_PATHS = [
  "v1/characters/media/image-jobs(?:/[^/?]+)?",
  "v1/characters/media/get-users-character-media",
  "v1/characters/media/video-status/[^/?]+",
  "v1/characters/fetch-by-id/[^/?]+",
  "v1/characters/fetch-loggedin-user",
  "v1/age-verification/status",
  "v1/me",
].join("|");

export function apiTracePropagationTargets(origin: string): RegExp[] {
  const notPolled = `(?!(?:${POLLED_API_PATHS})(?:[?#]|$))`;
  return [
    new RegExp(`^${escapeRegExp(origin)}/api/${notPolled}`),
    new RegExp(`^/api/${notPolled}`),
  ];
}

/**
 * The browser's `allowUrls`: report an error only when the frame that threw
 * is in this app's own bundle (`<origin>/_next/static/`). Scripts that a
 * visitor's extension or automation tool adds throw from their own files, and
 * one visit can open several issues (SPICESTARS-FRONTEND-Z, -10:
 * `executors/200.js`). Errors from third-party scripts we load (Google One Tap,
 * analytics) are not ours to fix either.
 *
 * Sentry's event filter runs before the Next.js SDK rewrites frames to
 * `app:///_next/...`, so it sees the full URL. Anchored on the origin, so an
 * extension built with Next.js (`chrome-extension://<id>/_next/...`) does not
 * match. An error with no stack trace, or with only `<anonymous>` frames, is
 * still reported.
 */
export function browserAllowUrls(origin: string): RegExp[] {
  return [new RegExp(`^${escapeRegExp(origin)}/_next/static/`)];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * The browser SDK's fetch transport. Events go to the same-origin tunnel
 * (`lib/sentry/tunnel.ts`), so a default fetch would attach the session
 * cookie and any cached Basic auth, and the tunnel's rewrite would forward
 * them to Sentry. `proxy.ts` also strips them server-side.
 */
export const SENTRY_BROWSER_TRANSPORT_OPTIONS = {
  fetchOptions: { credentials: "omit" },
} satisfies NonNullable<BrowserOptions["transportOptions"]>;

/**
 * Session Replay's privacy options. This app renders private chats, prompts
 * and paid media, and an unmasked replay would copy them into Sentry.
 *
 * - `maskAllText`, `maskAllInputs`, `blockAllMedia` default to true; they are
 *   set explicitly so nobody turns them off by accident. Never turn them off.
 * - `networkDetailAllowUrls: []` (the default) records no request or response
 *   headers or bodies for any URL; `networkCaptureBodies: false` makes the
 *   bodies impossible even if a URL is ever allowed.
 *
 * URLs in the recording are scrubbed separately, by `replay-transport.ts`.
 */
export const SENTRY_REPLAY_OPTIONS = {
  maskAllText: true,
  maskAllInputs: true,
  blockAllMedia: true,
  networkDetailAllowUrls: [],
  networkCaptureBodies: false,
} satisfies Parameters<typeof replayIntegration>[0];

/**
 * Attributes every log and span from this runtime carries. Every runtime has
 * the same `service.name` as the logger lines (INF-83); `runtime` tells them
 * apart.
 */
export function sentryServiceAttributes(runtime: SentryRuntime): Record<string, string> {
  return { "service.name": SERVICE_NAME, runtime };
}
