import type { ScrubKeyOptions } from "@omnipink/logger/scrub";

/**
 * True for a key that only this app treats as content: `query` (search text)
 * and any key ending in `url` (`avatarUrl`, `previewUrl`, …: presigned media
 * URLs carry their credential in the query). Matched on the leaf of a dotted
 * key, like the logger's own list, which already has `answer`, `text`,
 * `message_text`, `messages`, `url` and `image_url`.
 *
 * Not `message` here: the logger applies these keys inside a logged error
 * too, so `message` would erase every error's message in Loki. Name a content
 * field after its content (`message_text`). The Sentry scrubbers add
 * `message` themselves (`lib/sentry/scrub.ts`).
 */
export function isAppContentBearingKey(key: string): boolean {
  const leaf = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  return leaf === "query" || leaf.endsWith("url");
}

/**
 * This app's keys, for `createLogger` (`lib/logger.ts`). The Sentry scrubbers
 * (`lib/sentry/scrub.ts`) use the same test, plus `message`. One object: the
 * logger caches the answer per key.
 *
 * Browser-safe: a type import only.
 */
export const APP_SCRUB_KEYS: ScrubKeyOptions = { isContentBearing: isAppContentBearingKey };
