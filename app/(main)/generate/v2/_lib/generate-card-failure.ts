import { ApiRequestError } from "@/lib/api/client";

/** `apiFetch` invents this when the error body has no `message`. */
const CLIENT_STATUS_MESSAGE = /^Request failed with status \d+$/;

/**
 * The failed card's only sentence: the backend `message`.
 *
 * Returns nothing when the failure did not come with one, so the card does
 * not invent a title or a fallback.
 */
export function backendFailureMessage(error: unknown): string | undefined {
  if (!(error instanceof ApiRequestError)) return undefined;
  const message = error.message.trim();
  if (!message || CLIENT_STATUS_MESSAGE.test(message)) return undefined;
  return message;
}
