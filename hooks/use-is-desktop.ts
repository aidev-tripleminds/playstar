"use client";

import * as React from "react";

type MediaQueryStore = {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => boolean;
  getServerSnapshot: () => boolean;
};

const mediaQueryStores = new Map<number, MediaQueryStore>();

function getMediaQueryStore(breakpoint: number): MediaQueryStore {
  const cached = mediaQueryStores.get(breakpoint);

  if (cached) {
    return cached;
  }

  const query = `(min-width: ${breakpoint}px)`;

  const store: MediaQueryStore = {
    subscribe(callback) {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    getSnapshot() {
      return window.matchMedia(query).matches;
    },
    getServerSnapshot() {
      return false;
    },
  };

  mediaQueryStores.set(breakpoint, store);
  return store;
}

export function useIsDesktop(breakpoint = 768) {
  const store = React.useMemo(() => getMediaQueryStore(breakpoint), [breakpoint]);

  return React.useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
