import { apiFetch } from "./client";
import type { VoicesQuery, VoicesResponse } from "./types";

/**
 * The voice catalogue this brand's visitors may choose from.
 *
 * Unauthenticated — the create wizard shows the picker before sign-up, so this
 * must work with no session. The brand is resolved server-side from the request
 * origin, which is why there is nothing brand-shaped to pass: an unrecognised
 * origin gets the system voices only, never some default brand's catalogue.
 */
export function fetchVoices(query: VoicesQuery = {}): Promise<VoicesResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    // An empty search string is not a filter — sending it would narrow nothing
    // while forcing a distinct cache key.
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return apiFetch<VoicesResponse>(`/api/v1/voices${queryString ? `?${queryString}` : ""}`);
}
