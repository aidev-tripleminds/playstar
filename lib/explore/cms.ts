import type { Content } from "@prismicio/client";

import {
  type ExploreFilters,
  type ExploreInitialData,
  fetchExploreCategories,
  fetchExploreFeed,
  fetchExploreOptions,
} from "@/lib/api/explore";
import { logger } from "@/lib/logger";

import {
  exploreSearchParams,
  parseExploreFilters,
  resolveExploreCategoryKey,
  validateExploreOptions,
} from "./filters";

/**
 * A published slice keeps its dropped keys until an editor fixes it, so the
 * warning repeats on each render and revalidation. A warning reaches Sentry,
 * so warn at most once an hour for each set of keys.
 */
export const DROPPED_KEYS_WARNING_INTERVAL_MS = 60 * 60_000;
const lastDroppedKeysWarning = new Map<string, number>();

function warnDroppedKeys(dropped: string[]): void {
  const key = dropped.join(",");
  const now = Date.now();
  const last = lastDroppedKeysWarning.get(key);
  if (last !== undefined && now - last < DROPPED_KEYS_WARNING_INTERVAL_MS) return;
  lastDroppedKeysWarning.set(key, now);
  logger.warn(
    { name: "explore-cms", category_keys: dropped },
    "ignored inactive or unknown category keys",
  );
}

export function exploreFiltersFromSlice(
  primary: Partial<Content.ExploreSliceDefaultPrimary>,
): ExploreFilters {
  const params = new URLSearchParams();
  if (primary.content_type) params.set("type", primary.content_type);
  if (primary.gender) params.set("gender", primary.gender);
  for (const key of ["style", "age"] as const) {
    const value = primary[key];
    if (value && value !== "all") params.set(key, value);
  }
  const keys = (primary.categories ?? []).flatMap((row) => (row.key ? [row.key] : []));
  if (keys.length) params.set("categories", keys.join(","));
  return parseExploreFilters(params);
}

/** Public SSR only: no cookie/session read, so CMS routes keep ISR. */
export async function loadExploreSlice(
  primary: Partial<Content.ExploreSliceDefaultPrimary>,
  realContent: boolean,
): Promise<{ initialQuery: string; initialData?: ExploreInitialData }> {
  if (!realContent) return { initialQuery: "" };
  let filters = exploreFiltersFromSlice(primary);
  try {
    const options = await fetchExploreOptions({
      type: filters.type,
      gender: filters.gender,
      style: filters.style,
    });
    const validated = validateExploreOptions(filters, options);
    const dropped =
      filters.categories
        ?.split(",")
        .filter((key) => !resolveExploreCategoryKey(key, filters.type, options).length) ?? [];
    if (dropped.length) warnDroppedKeys(dropped);
    filters = validated;
    const [page, categories] = await Promise.all([
      fetchExploreFeed({ ...filters, limit: 30 }),
      fetchExploreCategories({
        type: filters.type,
        gender: filters.gender,
        style: filters.style,
        age: filters.age,
      }),
    ]);
    return {
      initialQuery: exploreSearchParams(filters).toString(),
      initialData: { filters, options, page, categories },
    };
  } catch (error) {
    logger.error({ name: "explore-cms", err: error }, "failed to fetch public content");
    return { initialQuery: exploreSearchParams(filters).toString() };
  }
}
