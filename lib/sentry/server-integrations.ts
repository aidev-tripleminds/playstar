import * as Sentry from "@sentry/nextjs";

import { withoutConsoleIntegration } from "./options";

type Integration = Parameters<typeof withoutConsoleIntegration>[0][number];

/**
 * The Node.js server's integrations: the shared set, plus the logger's `warn`
 * and higher lines as Sentry Logs (INF-71). Loki keeps every line; Sentry gets
 * the lines near an error. `beforeSendLog` scrubs them like every other log.
 *
 * Server-only: the browser build of `@sentry/nextjs` has no `pinoIntegration`.
 */
export function serverIntegrations(defaults: Integration[]): Integration[] {
  return [
    ...withoutConsoleIntegration(defaults),
    Sentry.pinoIntegration({ log: { levels: ["warn", "error", "fatal"] } }),
  ];
}
