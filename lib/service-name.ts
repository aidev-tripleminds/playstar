/**
 * The one service name of this app (INF-83). Logger lines (`lib/logger.ts`)
 * and Sentry logs and spans from every runtime (`lib/sentry/options.ts`) carry
 * it as `service.name`, so one filter finds all of them. Sentry tells the
 * runtimes apart by the separate `runtime` attribute.
 */
export const SERVICE_NAME = "spicestars-frontend";
