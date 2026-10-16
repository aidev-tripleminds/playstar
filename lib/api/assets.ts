import type { TaggedAssetMap } from "@/lib/assets/asset-map.types";

import { apiFetch } from "./client";

type ActiveTagsResponse = { tags: string[] };

/**
 * Ordered tags active for the current request (A/B, festivities, geo). `main`
 * is always first. See backend `/api/v1/assets/active-tags` (task 3).
 */
export async function fetchActiveTags(init?: RequestInit): Promise<string[]> {
  const { tags } = await apiFetch<ActiveTagsResponse>("/api/v1/assets/active-tags", init);
  return tags;
}

/**
 * Asset map for the given tags — `main` first as the base. Returns
 * `{ tag: { key: { image?, video?, description } } }` (backend `/assets/map`).
 */
export function fetchAssetMap(tags: string[], init?: RequestInit): Promise<TaggedAssetMap> {
  const query = encodeURIComponent(tags.join(","));
  return apiFetch<TaggedAssetMap>(`/api/v1/assets/map?tags=${query}`, init);
}
