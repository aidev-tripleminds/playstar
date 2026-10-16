import type { ErrorEvent } from "@sentry/nextjs";

import { scrubEvent } from "./scrub";

/**
 * Some visitors' browsers (seen from scanners with forged user agents) inject
 * a script that wraps `addEventListener` in a function named `addEL_hook`. The
 * wrapper reads `.tagName` from `null`, so every library that adds a listener
 * (the Next router, better-auth, web-vitals) throws "Cannot read properties of
 * null (reading 'tagName')". Sentry groups each caller as its own issue, so one
 * visit opens several (SPICESTARS-FRONTEND-M to -W).
 *
 * The app has no `addEL_hook`. Match the injected frame, not the message: a
 * real bug can throw the same message.
 */
const INJECTED_FILENAME = "<anonymous>";
const INJECTED_FUNCTION = "addEL_hook";

/** True when an exception was thrown inside the injected `addEL_hook` wrapper. */
export function isInjectedListenerHookError(event: ErrorEvent): boolean {
  return (event.exception?.values ?? []).some((exception) => {
    // Sentry orders frames oldest first: the last one threw.
    const frames = exception.stacktrace?.frames;
    const thrower = frames?.[frames.length - 1];
    return thrower?.filename === INJECTED_FILENAME && thrower.function === INJECTED_FUNCTION;
  });
}

/** The browser's `beforeSend`: drop injected-script errors, scrub the rest. */
export function beforeSendBrowserEvent(event: ErrorEvent): ErrorEvent | null {
  return isInjectedListenerHookError(event) ? null : scrubEvent(event);
}
