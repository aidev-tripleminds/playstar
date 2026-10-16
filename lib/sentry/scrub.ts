import {
  isContentBearingKey as isLoggerContentBearingKey,
  REDACTED,
  redactUrlCredentials,
  scrubAttributes as scrubLoggerAttributes,
  type ScrubKeyOptions,
  scrubSentryLog as scrubLoggerSentryLog,
} from "@omnipink/logger/scrub";
import type { Breadcrumb, BrowserOptions, ErrorEvent, Log } from "@sentry/nextjs";

import { isAppContentBearingKey } from "../content-keys";

/**
 * Redaction rules for everything this app sends to Sentry.
 *
 * Spicestars renders private chats, generation prompts and paywalled media, and
 * Sentry is a third party. Nothing that quotes a user's own content may reach
 * it, and neither may a presigned media URL: its query string IS the credential
 * for that object (`t3.storage.dev` serves paywalled media only through one).
 *
 * The key list, the size caps, the walk over nested values and the removal of
 * URL credentials (`?token=…`, `X-Amz-Signature`, …) come from
 * `@omnipink/logger/scrub`, the same rules as the server logger (INF-90). That
 * module imports nothing, so it is safe here: the browser, Node and Edge
 * `Sentry.init` calls all import this file, and anything imported here lands
 * in the client bundle. This file adds the keys only this app has
 * ({@link SENTRY_SCRUB_KEYS}) and the Sentry glue
 * (events, breadcrumbs, spans, Session Replay).
 */

export { REDACTED };

/**
 * The keys this app redacts in Sentry on top of the logger's list: the app's
 * keys (`lib/content-keys.ts`) and `message`, the text of a chat message. The
 * server logger leaves `message` out, because the package applies these keys
 * inside an error too and the error's message must stay in Loki. In Sentry it
 * stays redacted, as before 2.0: the event's exception still carries the
 * error's message. One object: the package caches the answer per key.
 */
const SENTRY_SCRUB_KEYS: ScrubKeyOptions = {
  extraKeys: ["message"],
  isContentBearing: isAppContentBearingKey,
};

/** The logger's list, plus {@link SENTRY_SCRUB_KEYS}, for the flat checks below. */
function isContentBearingKey(key: string): boolean {
  const leaf = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  return leaf === "message" || isLoggerContentBearingKey(key) || isAppContentBearingKey(key);
}

/**
 * Redact content-bearing keys, remove URL credentials, cap sizes, and
 * stringify structured values: the logger's `scrubAttributes`, with this app's
 * keys.
 */
export function scrubAttributes(attributes: Record<string, unknown>): Record<string, unknown> {
  return scrubLoggerAttributes(attributes, SENTRY_SCRUB_KEYS);
}

/**
 * Drop the query string and fragment from a URL or path. A presigned media URL
 * carries its credential there, the auth handoff route carries a single-use
 * login token there, and search queries are user text.
 */
export function stripQueryString(url: string): string {
  const cut = url.search(/[?#]/);
  return cut === -1 ? url : url.slice(0, cut);
}

/**
 * A URL or path inside free text: anything with a scheme (`https://…`), a
 * protocol-relative `//host/…`, or a `/path` that does not follow a word
 * character (so `w-1/2` and `a/b` stay as they are). The path part ends at
 * whitespace, a quote or a bracket; the query part runs on to whitespace, a
 * quote or a closing `)`, so a `(` inside a query cannot cut it short and
 * leave the rest behind, and `url(/a.svg#x)` keeps its `)`.
 */
const URL_IN_TEXT =
  /(?:\b[a-z][a-z\d+.-]*:\/\/|(?<![\w.~%-])\/)[^\s"'`()<>\\?#]*(?:[?#][^\s"'`<>\\)]*)?/gi;

/**
 * {@link stripQueryString} applied to every URL and path inside a string, for
 * text that is not a URL itself: rrweb DOM attributes such as `srcset`,
 * inlined CSS with `url(…)`, span descriptions such as `GET https://…`. A
 * string that is only a query (`?token=…`) is dropped whole.
 */
export function stripQueryStringsInText(text: string): string {
  if (!text.includes("?") && !text.includes("#")) return text;
  if (text.startsWith("?")) return "";
  return text.replace(URL_IN_TEXT, (url) => stripQueryString(url));
}

/**
 * {@link stripQueryStringsInText} on every string in a JSON-like value, at any
 * depth. Keys are kept. For Session Replay, whose recording is an rrweb event
 * tree (DOM snapshots, the page URL, network spans) with URLs at any depth.
 */
export function stripQueryStringsDeep(value: unknown, path = new WeakSet<object>()): unknown {
  if (typeof value === "string") return stripQueryStringsInText(value);
  if (value === null || typeof value !== "object") return value;
  if (path.has(value)) return "[circular]";
  path.add(value);
  try {
    if (Array.isArray(value)) return value.map((item) => stripQueryStringsDeep(item, path));
    const scrubbed: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      scrubbed[key] = stripQueryStringsDeep(nested, path);
    }
    return scrubbed;
  } finally {
    path.delete(value);
  }
}

/**
 * `beforeSendLog`: the logger's `scrubSentryLog` (attributes scrubbed, URL
 * credentials removed from the message), with this app's keys. Keep messages
 * fixed strings: key redaction does not apply to them.
 */
export function scrubSentryLog(log: Log): Log {
  return scrubLoggerSentryLog(log, SENTRY_SCRUB_KEYS);
}

/** Breadcrumb data keys that hold a URL or a path: kept, minus the query string. */
const BREADCRUMB_URL_KEYS = new Set(["url", "from", "to"]);

/**
 * `beforeBreadcrumb`.
 *
 * - `console` breadcrumbs are dropped: a `console.log` of a chat message or an
 *   API error body would otherwise ride along with the next error. The error
 *   itself is still captured as an event.
 * - fetch / xhr / navigation breadcrumbs keep their method, status and path but
 *   lose the query string.
 * - The message loses the query of a URL with a credential (`?token=…`).
 */
export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
  if (breadcrumb.category === "console") return null;

  if (typeof breadcrumb.message === "string") {
    breadcrumb = { ...breadcrumb, message: redactUrlCredentials(breadcrumb.message) };
  }
  if (!breadcrumb.data) return breadcrumb;

  const data = { ...breadcrumb.data };
  for (const key of Object.keys(data)) {
    if (BREADCRUMB_URL_KEYS.has(key)) {
      data[key] = stripAttributeValue(data[key]);
    } else if (isContentBearingKey(key)) {
      data[key] = REDACTED;
    }
  }
  return { ...breadcrumb, data };
}

/**
 * The only request headers that may leave the app, in events and in span
 * attributes. Mirrored by `dataCollection.httpHeaders` in options.ts, which
 * stops the SDK collecting the rest; this list removes anything that got
 * through another way. No Cookie or Authorization, and no Referer, which can
 * carry another page's query string.
 */
export const ALLOWED_REQUEST_HEADERS = ["user-agent", "content-type", "accept-language"] as const;
/** The only response headers that may leave the app. */
export const ALLOWED_RESPONSE_HEADERS = ["content-type"] as const;

const ALLOWED_REQUEST_HEADER_NAMES = new Set<string>(ALLOWED_REQUEST_HEADERS);

/**
 * `beforeSend`. Strips the query string from the request URL and the
 * transaction name, drops the request body, cookies, query string and every
 * header outside {@link ALLOWED_REQUEST_HEADERS}, removes URL credentials from
 * the message and the exception values (an error message can quote a
 * presigned URL), and re-applies the breadcrumb rules (the server SDK records
 * breadcrumbs without calling `beforeBreadcrumb` on every path).
 */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (typeof event.message === "string") event.message = redactUrlCredentials(event.message);
  if (event.exception?.values) {
    event.exception = {
      ...event.exception,
      values: event.exception.values.map((exception) =>
        typeof exception.value === "string"
          ? { ...exception, value: redactUrlCredentials(exception.value) }
          : exception,
      ),
    };
  }
  if (event.request) {
    const request = { ...event.request };
    if (request.url) request.url = stripQueryString(request.url);
    delete request.query_string;
    delete request.data;
    delete request.cookies;
    if (request.headers) {
      const headers: Record<string, string> = {};
      for (const [name, value] of Object.entries(request.headers)) {
        if (ALLOWED_REQUEST_HEADER_NAMES.has(name.toLowerCase())) headers[name] = value;
      }
      request.headers = headers;
    }
    event.request = request;
  }
  if (typeof event.transaction === "string") {
    event.transaction = stripQueryString(event.transaction);
  }
  if (event.extra) {
    event.extra = scrubAttributes(event.extra);
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs
      .map((breadcrumb) => scrubBreadcrumb(breadcrumb))
      .filter((breadcrumb): breadcrumb is Breadcrumb => breadcrumb !== null);
  }
  return event;
}

/**
 * The span shape `beforeSendSpan` receives. v11 streams spans by default, so
 * this is `StreamedSpanJSON`: `name` (was `description`), `attributes` (was
 * `data`), `attributes["sentry.op"]` (was `op`).
 */
export type StreamedSpan = Parameters<NonNullable<BrowserOptions["beforeSendSpan"]>>[0];

/**
 * Span attributes that hold a URL or a path, possibly with its query string.
 * v11 writes `url.full` / `url.path`; the legacy names stay listed so a span
 * from any instrumentation that still writes them is cleaned too.
 */
const URL_KEYS = new Set(["url", "url.full", "url.path", "http.url", "http.target", "http.route"]);
/** Span attributes that hold the query string or fragment alone. */
const QUERY_KEYS = new Set(["url.query", "url.fragment", "http.query", "http.fragment"]);

/** Any request or response header attribute, whatever the case of its key. */
const HEADER_ATTRIBUTE = /^http\.(?:request|response)\.header\./i;
/** The header attributes that may stay: the two allowlists, in lower case. */
const ALLOWED_HEADER_ATTRIBUTES = new Set([
  ...ALLOWED_REQUEST_HEADERS.map((name) => `http.request.header.${name}`),
  ...ALLOWED_RESPONSE_HEADERS.map((name) => `http.response.header.${name}`),
]);

/** Strip a query string from a raw attribute value: a string, an array, or a `{ value }` object. */
function stripAttributeValue(value: unknown): unknown {
  if (typeof value === "string") return stripQueryString(value);
  if (Array.isArray(value)) return value.map((item) => stripAttributeValue(item));
  if (value && typeof value === "object" && "value" in value) {
    return { ...value, value: stripAttributeValue((value as { value: unknown }).value) };
  }
  return value;
}

function scrubSpanName(name: string): string {
  // Nearly every span name has no query string; skip the split for those.
  if (!/[?#]/.test(name)) return name;
  return name
    .split(" ")
    .map((part) =>
      part.startsWith("/") || /^https?:\/\//.test(part) ? stripQueryString(part) : part,
    )
    .join(" ");
}

/**
 * `beforeSendSpan`. Runs on every streamed span as it ends — the root
 * ("segment") span that used to be the transaction included, which is why
 * there is no `beforeSendTransaction` any more. HTTP client spans (every
 * gallery image loads through a presigned URL, every API call) record the URL
 * in their attributes and their name; without this every sampled trace would
 * send them as is.
 *
 * - URL attributes and the span name lose their query string and fragment.
 * - Query and fragment attributes are removed.
 * - Header attributes outside the allowlists are removed.
 * - Any other content-bearing key (`gen_ai.prompt`, `db.query.text`, …) is redacted.
 */
export function scrubSentrySpan(span: StreamedSpan): StreamedSpan {
  const attributes: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(span.attributes ?? {})) {
    if (QUERY_KEYS.has(key)) continue;
    if (HEADER_ATTRIBUTE.test(key)) {
      if (ALLOWED_HEADER_ATTRIBUTES.has(key.toLowerCase())) attributes[key] = value;
      continue;
    }
    if (URL_KEYS.has(key)) {
      attributes[key] = stripAttributeValue(value);
    } else if (isContentBearingKey(key)) {
      attributes[key] = REDACTED;
    } else {
      attributes[key] = value;
    }
  }
  return {
    ...span,
    name: scrubSpanName(span.name),
    attributes: attributes as StreamedSpan["attributes"],
  };
}
