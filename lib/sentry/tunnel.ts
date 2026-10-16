/**
 * Same-origin path the browser SDK sends events to. `withSentryConfig` turns it
 * into a rewrite to Sentry's ingest host, so ad-blockers that drop requests to
 * `*.sentry.io` do not drop our errors.
 *
 * A fixed string, not `tunnelRoute: true` (a random path per build), because
 * two other places have to recognise it: `proxy.ts`, or the preview-auth gate
 * would answer the browser's event upload with a 401, and the funnel host
 * rewrite (`lib/funnel/rewrites.ts`), or a funnel domain would answer it with
 * the funnel's HTML.
 *
 * Deliberately meaningless. Ad-block and privacy filter lists match Sentry's
 * documented tunnel path: a preview test found every upload to
 * `/monitoring?o=…&p=…` blocked in the browser, while the same request from
 * curl, and other paths with the same query, went through. So the path must
 * not contain words such lists look for (monitor, sentry, track, telemetry,
 * log, analytics, metrics, beacon, collect, …), must not sit under `/api`
 * (the backend proxy) or `/_next` (Next's own files), and must not clash with
 * a page or a `public/` entry. `tunnel.test.ts` checks the first two.
 *
 * Imported by next.config.ts through a relative path, so this module must stay
 * free of the `@/` alias and of runtime dependencies.
 */
export const SENTRY_TUNNEL_ROUTE = "/fwd";
