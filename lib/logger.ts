import { createLogger, type Logger } from "@omnipink/logger";

import { APP_SCRUB_KEYS } from "@/lib/content-keys";
import { resolveSentryEnvironment } from "@/lib/sentry/environment";
import { SERVICE_NAME } from "@/lib/service-name";

/**
 * The server-side logger (INF-75). It writes one JSON line per log to stdout.
 * The Vercel log drain sends those lines to Loki.
 *
 * Use it only in Node.js server code: route handlers, server components and
 * `instrumentation.ts` (through a dynamic import, because that file also runs
 * on the Edge runtime). The package uses `node:async_hooks`, so a client
 * component that imports this module fails the build. Browser code reports to
 * Sentry instead.
 *
 * `service.version` is the deployed commit, the same value as the Sentry
 * release (`next.config.ts`). `deployment.environment` is the Sentry
 * environment, so a log line and a Sentry event from one deployment have the
 * same environment. The test site runs on a production-type Vercel project,
 * so `VERCEL_ENV` alone labels its lines "production".
 *
 * It redacts this app's content keys on top of the logger's list, the same
 * keys as the Sentry scrubbers (`lib/content-keys.ts`).
 */
export const logger: Logger = createLogger({
  ...APP_SCRUB_KEYS,
  service: SERVICE_NAME,
  environment: resolveSentryEnvironment(process.env),
  version: process.env.VERCEL_GIT_COMMIT_SHA,
});
