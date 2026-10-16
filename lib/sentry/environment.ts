/**
 * The Sentry environment, in its own module because `next.config.ts` imports
 * it through a relative path, and Next's config loader does not resolve the
 * `@/` alias. This module must stay free of that alias. It also keeps the
 * Sentry scrubbers and `@omnipink/logger` out of the config load.
 */

/** The variables the Sentry setup reads, so tests can pass a plain object. */
export type SentryEnv = Partial<
  Record<
    | "NEXT_PUBLIC_SENTRY_DSN"
    | "NEXT_PUBLIC_SENTRY_ENVIRONMENT"
    | "NEXT_PUBLIC_VERCEL_ENV"
    | "VERCEL_ENV"
    | "NODE_ENV",
    string | undefined
  >
>;

/**
 * The environment events are filed under, so previews (test.spicestars.ai and
 * every branch deploy) never mix with production in Sentry.
 *
 * `NEXT_PUBLIC_SENTRY_ENVIRONMENT` wins when set — for a deployment whose
 * Vercel environment does not say what it is (a test site served from a
 * production-type Vercel project). Otherwise Vercel's own `production` /
 * `preview` / `development`, and `development` for a local `next dev`.
 */
export function resolveSentryEnvironment(env: SentryEnv): string {
  return (
    env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
    env.NEXT_PUBLIC_VERCEL_ENV ||
    env.VERCEL_ENV ||
    (env.NODE_ENV === "production" ? "production" : "development")
  );
}
