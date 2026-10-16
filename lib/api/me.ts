import { apiFetch } from "./client";
import type { MeResponse } from "./types";

/** Real per-user billing snapshot: coin balance + server-derived premium flag. Auth required. */
export function fetchMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/api/v1/me");
}
