import type { ErrorEvent } from "@sentry/nextjs";

import { isPageTranslated } from "../translated-dom-guard";

/**
 * Tags a browser event from a translated page with `page_translated`, because
 * translation rewrites the DOM under React (see `lib/translated-dom-guard.ts`).
 * Checked when the event is sent: a page is translated after it loads, so a
 * scope tag set at init would be wrong.
 */
export function tagTranslatedPage(event: ErrorEvent | null): ErrorEvent | null {
  if (event && isPageTranslated(document)) {
    event.tags = { ...event.tags, page_translated: true };
  }
  return event;
}
