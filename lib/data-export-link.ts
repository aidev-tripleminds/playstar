"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";

import {
  DATA_EXPORT_PARAM,
  DATA_EXPORT_TOKEN_PARAM,
  type DataExportStep,
  parseDataExportStep,
} from "./routes";

export type DataExportLink = { step: DataExportStep; token: string };

/** The same URL with both data-export params removed, as a router-ready path. */
export function dataExportUrlWithoutToken(href: string, base: string): string {
  const url = new URL(href, base);
  url.searchParams.delete(DATA_EXPORT_PARAM);
  url.searchParams.delete(DATA_EXPORT_TOKEN_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

/**
 * Reads a mailed data-export link out of the URL, once.
 *
 * Latched rather than re-derived every render because the dialog strips its own
 * token from the URL (see `useStripDataExportToken`), and `replaceState` is
 * wired into the App Router — `useSearchParams` re-reads after it, so a dialog
 * driven straight off the URL would close the instant it removed its own
 * credential.
 *
 * Latching at mount is also all the flow needs: an export link is only ever
 * arrived at from an email client, which is a fresh page load. There is no
 * in-app route that produces one.
 */
export function useDataExportLink(): DataExportLink | null {
  const searchParams = useSearchParams();
  const [link] = React.useState<DataExportLink | null>(() => {
    const step = parseDataExportStep(searchParams.get(DATA_EXPORT_PARAM));
    const token = searchParams.get(DATA_EXPORT_TOKEN_PARAM);
    return step && token ? { step, token } : null;
  });
  return link;
}

/**
 * Removes the mailed token from the browser's current history entry.
 *
 * The token IS the credential (BACK-123) and it arrives as a query parameter,
 * so the entry that opened the dialog holds it for as long as the tab's session
 * history does. Dismissing did not help: the dialog pushes a same-URL entry for
 * back-button trapping, so `router.replace` on close overwrote only that
 * synthetic top entry and left the token-bearing one directly underneath — one
 * Back press re-exposed it and remounted the flow, on what is routinely a
 * shared or borrowed device.
 *
 * A LAYOUT effect on purpose, and load-bearing: `use-modal-history-back` pushes
 * that synthetic entry from a passive `useEffect`, and React flushes every
 * layout effect before any passive one. So this runs while the token-bearing
 * entry is still the current one — which is the only moment it can be rewritten.
 * Demote this to `useEffect` and it silently starts rewriting the synthetic
 * entry instead, leaving the credential exactly where it was.
 */
export function useStripDataExportToken(): void {
  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const stripped = dataExportUrlWithoutToken(window.location.href, window.location.origin);
    if (
      stripped === `${window.location.pathname}${window.location.search}${window.location.hash}`
    ) {
      return;
    }
    window.history.replaceState(window.history.state, "", stripped);
  }, []);
}
