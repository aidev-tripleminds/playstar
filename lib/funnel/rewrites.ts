// Relative import, not the `@/` alias: `next.config.ts` imports this module
// through Next's own config-ts transpiler, which does not apply the path
// alias the way `tsc`/Vitest do — verified by running `next dev`, which
// failed to resolve `@/lib/api/config` with `MODULE_NOT_FOUND` until this was
// changed to a relative path.
import { API_PATH_PREFIX } from "../api/config";
import { SENTRY_TUNNEL_ROUTE } from "../sentry/tunnel";
import { FUNNEL_HOSTS, type FunnelHostRoute } from "./config";

/**
 * Escape a literal string for safe use inside a regex.
 *
 * Both places this is used feed strings into a regex that Next compiles for
 * us, so an unescaped `.` would silently widen the match to any character.
 */
function escapeRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** First segment of {@link API_PATH_PREFIX}, e.g. `/api` -> `api`. */
const API_FIRST_SEGMENT = API_PATH_PREFIX.replace(/^\//, "").split("/")[0] ?? "api";

/**
 * First path segments the funnel host rewrite must NOT swallow.
 *
 * The funnel rule is `beforeFiles`, and per Next's documented evaluation order
 * (`node_modules/next/dist/docs/.../rewrites.md`) `beforeFiles` runs at step 4
 * — BEFORE step 5, "static files from the public directory, `_next/static`
 * files, and non-dynamic pages". So a catch-all here outranks the filesystem
 * and every un-excluded path returns the funnel's HTML instead of the file.
 *
 * That is the whole point for pages, and a bug for everything else:
 *
 * - `api`      — the backend proxy (`afterFiles`), or the funnel host can
 *                never reach the API at all.
 * - `_next`    — build output and the image optimizer, or the page cannot
 *                load its own JavaScript.
 * - `public/`  — every top-level entry, or every icon on the page is a
 *                200 `text/html` broken image. Pinned against the real
 *                directory by `rewrites.test.ts`, so adding a top-level
 *                folder to `public/` reddens a test rather than silently
 *                breaking the funnel host.
 * - `favicon.ico` — `app/favicon.ico`, served from the app root.
 * - `manifest.webmanifest` — home-screen app metadata, shared by all hosts.
 * - `policies` — the legal documents R4.3/R4.4 require to be reachable, and
 *                which the funnel's own footer and age gate link to. Without
 *                this, those links open a new tab containing the wizard again
 *                and the terms are unreachable at the one address paid
 *                traffic lands on. They render inside `(main)`'s chrome,
 *                which is acceptable in a new tab and strictly better than
 *                being unreachable.
 * - `.well-known` — ACME/domain-verification probes, which a funnel domain
 *                needs precisely because it is a separate domain.
 * - `fwd`      — the Sentry tunnel (`lib/sentry/tunnel.ts`), or error reports
 *                from a funnel domain get the funnel's HTML back. Excluded here
 *                so the result does not depend on `withSentryConfig` placing
 *                its own rewrite ahead of this one.
 */
export const FUNNEL_PASSTHROUGH_SEGMENTS = [
  API_FIRST_SEGMENT,
  "_next",
  "assets",
  "file.svg",
  "globe.svg",
  "vercel.svg",
  "window.svg",
  "favicon.ico",
  "manifest.webmanifest",
  "policies",
  ".well-known",
  SENTRY_TUNNEL_ROUTE.slice(1),
];

/**
 * Everything except {@link FUNNEL_PASSTHROUGH_SEGMENTS}. Anchored to a whole
 * first segment (`(?:/|$)`) so a route that merely starts with the same
 * letters (e.g. `/apitest`) is still served by the funnel.
 */
export const FUNNEL_REWRITE_SOURCE = `/:path((?!(?:${FUNNEL_PASSTHROUGH_SEGMENTS.map(
  escapeRegex,
).join("|")})(?:/|$)).*)`;

/**
 * `beforeFiles` host rewrites: on each configured host, every path except
 * {@link FUNNEL_PASSTHROUGH_SEGMENTS} is served from the mapped funnel route.
 *
 * Must be `beforeFiles` — `app/(main)/page.tsx` already serves `/`, and the
 * filesystem beats an `afterFiles` rewrite, so an `afterFiles` rule here would
 * never fire for the funnel host's own root. `next.config.test.ts` pins that.
 *
 * The host is escaped: Next compiles `has[].value` into `new RegExp('^' +
 * value + '$')` (`prepare-destination.js`), so an unescaped `spicestars.network`
 * would also match `spicestarsXnetwork`. Note the value is matched against the
 * `Host` header with the port stripped and lowercased, and it is anchored — so
 * `www.spicestars.network` needs its own entry or a redirect.
 */
export function buildFunnelHostRewrites(hosts: FunnelHostRoute[] = FUNNEL_HOSTS) {
  return hosts.map(({ host, path }) => ({
    source: FUNNEL_REWRITE_SOURCE,
    has: [{ type: "host" as const, value: escapeRegex(host) }],
    destination: path,
  }));
}
