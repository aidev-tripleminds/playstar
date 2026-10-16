export const REDACTED = "[redacted]";

export type ScrubKeyOptions = {
  extraKeys?: string[];
  isContentBearing?: (key: string) => boolean;
};

const LOGGER_CONTENT_KEYS = new Set([
  "answer",
  "text",
  "message_text",
  "messages",
  "url",
  "image_url",
]);

export function isContentBearingKey(key: string): boolean {
  const leaf = key.slice(key.lastIndexOf(".") + 1).toLowerCase();
  return LOGGER_CONTENT_KEYS.has(leaf);
}

export function redactUrlCredentials(value: string): string {
  const cut = value.search(/[?#]/);
  return cut === -1 ? value : value.slice(0, cut);
}

export function scrubAttributes(
  attributes: Record<string, unknown>,
  _options?: ScrubKeyOptions,
): Record<string, unknown> {
  return attributes;
}

export function scrubSentryLog<T>(log: T, _options?: ScrubKeyOptions): T {
  return log;
}
