import { resolveAppPublicHost } from "./api/config";
import { logger } from "./logger";

const log = logger.child({ name: "startup" });

/**
 * Log a warning at server start when a production server has no
 * `APP_PUBLIC_HOST`. Its server-side API calls then cannot name their Brand,
 * so brand-scoped reads come back empty instead of failing (see
 * `resolveAppPublicHost`).
 *
 * `apiFetch` also reports this to Sentry, but Sentry is off when the DSN is not
 * set. This line goes to stdout and so to Loki in every case. It lives here and
 * not in `lib/api/client.ts` because that module also runs in the browser,
 * where the logger cannot load.
 */
export function checkAppPublicHost(): void {
  if (process.env.NODE_ENV !== "production" || resolveAppPublicHost()) return;
  log.warn(
    { reason: "app_public_host_missing" },
    "APP_PUBLIC_HOST is not set: brand-scoped server-side API reads return empty results",
  );
}
