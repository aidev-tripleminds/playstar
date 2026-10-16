"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
function notifyLocation() {
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}
const snapshot = () => window.location.search.slice(1);
const serverSnapshot = () => "";

/** Reads the URL itself, never a mirrored filter object. SSR uses caller defaults. */
export function useExploreSearchParams() {
  return new URLSearchParams(useSyncExternalStore(subscribe, snapshot, serverSnapshot));
}

/** This tiny leaf alone suspends on static pages; the grid and heading do not. */
export function ExploreLocationBridge() {
  const params = useSearchParams();
  const path = usePathname();
  useEffect(notifyLocation, [params, path]);
  return null;
}
