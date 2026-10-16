"use client";

import * as React from "react";

/**
 * The value as it settles, rather than as it changes.
 *
 * Intended for values that key a network request (a search box feeding a query
 * key): without this, every keystroke mints a fresh, uncached key and fires its
 * own request. `staleTime` does not help there — it is per-key.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeout);
  }, [delayMs, value]);

  return debouncedValue;
}
