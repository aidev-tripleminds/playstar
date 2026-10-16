import { apiFetch } from "./client";
import type { GenerateOptionsResponse } from "./types";

/**
 * The actions, clothing and locations this brand's generate forms offer.
 *
 * Unauthenticated: the generate page shows its pickers before sign-up. The
 * brand is resolved server-side from the request origin, so there is nothing
 * brand-shaped to pass.
 */
export function fetchGenerateOptions(): Promise<GenerateOptionsResponse> {
  return apiFetch<GenerateOptionsResponse>("/api/v1/generate/options");
}
