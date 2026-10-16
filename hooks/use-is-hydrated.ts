"use client";

import * as React from "react";

/**
 * `false` on the server and during the first client render, `true` afterwards.
 *
 * Use it to keep client-only state (auth session, media queries, localStorage)
 * out of the markup React compares during hydration. Reading such state
 * directly makes the first client render disagree with the server HTML, which
 * React reports as "Hydration failed ... server rendered HTML didn't match".
 */
export function useIsHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}

/** The value never changes after hydration, so there is nothing to subscribe to. */
function subscribeToNothing(): () => void {
  return () => {};
}
