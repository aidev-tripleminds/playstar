import { apiFetch } from "./client";
import type { InfoResponse } from "./types";

/** Public location policy for the current request IP; no account fields. */
export function fetchInfo(): Promise<InfoResponse> {
  return apiFetch<InfoResponse>("/api/v1/info", { cache: "no-store" });
}
