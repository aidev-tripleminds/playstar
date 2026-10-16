import {
  EXPLORE_AGES,
  EXPLORE_SORTS,
  EXPLORE_TYPES,
  type ExploreFilters,
  type ExploreOptions,
} from "@/lib/api/explore";
import { resolveReturnTo } from "@/lib/auth/return-to";

export const EXPLORE_FILTER_KEYS = [
  "type",
  "sort",
  "search",
  "gender",
  "style",
  "age",
  "categories",
  "following",
  "saved",
] as const;
export function parseExploreFilters(params: URLSearchParams): ExploreFilters {
  const type = EXPLORE_TYPES.find((value) => value === params.get("type")) ?? "characters";
  const sort = EXPLORE_SORTS.find((value) => value === params.get("sort")) ?? "relevance";
  const age = EXPLORE_AGES.find((value) => value === params.get("age"));
  const search = params.get("search")?.trim().slice(0, 200) || undefined;
  const categories =
    [
      ...new Set(
        (params.get("categories") ?? "")
          .split(",")
          .map((value) => value.trim())
          .filter((value) => value && value.length <= 80),
      ),
    ]
      .slice(0, 25)
      .join(",") || undefined;
  // Closed backend axes; active dropdown options are loaded separately.
  const gender =
    ["female", "male", "trans"].find((value) => value === params.get("gender")) ?? "female";
  const style = ["realistic", "anime"].find((value) => value === params.get("style"));
  return {
    type,
    sort,
    age,
    search,
    categories,
    gender,
    style,
    following: type === "characters" && params.get("following") === "true" ? "true" : undefined,
    saved: params.get("saved") === "true" ? "true" : undefined,
  };
}
/**
 * Active category keys a requested key resolves to; empty when it is inactive
 * or unknown. Published Prismic slices and saved URLs can still contain
 * unqualified character keys. Resolve them through the active vocabulary,
 * including both size traits when an old generic "small" category matched both.
 */
export function resolveExploreCategoryKey(
  key: string,
  type: ExploreFilters["type"],
  options: ExploreOptions,
): string[] {
  if (options.categories.some((option) => option.key === key)) return [key];
  if (type !== "characters" || key.includes(":")) return [];
  return options.categories
    .filter((option) => option.key.endsWith(`:${key}`))
    .map((option) => option.key);
}
export function validateExploreOptions(
  filters: ExploreFilters,
  options: ExploreOptions,
): ExploreFilters {
  const categories = (filters.categories?.split(",") ?? []).flatMap((key) =>
    resolveExploreCategoryKey(key, filters.type, options),
  );
  return {
    ...filters,
    categories: [...new Set(categories)].join(",") || undefined,
    gender: options.genders.some((option) => option.key === filters.gender)
      ? filters.gender
      : "female",
    style: options.styles.some((option) => option.key === filters.style)
      ? filters.style
      : undefined,
  };
}
export function exploreSearchParams(filters: ExploreFilters, existing = new URLSearchParams()) {
  const params = new URLSearchParams(existing);
  for (const key of EXPLORE_FILTER_KEYS) {
    const value = filters[key];
    if (value) params.set(key, value);
    else params.delete(key);
  }
  // Feed cursors never survive a changed page filter or enter a signup handoff.
  params.delete("cursor");
  return params;
}
export function exploreReturnTo(filters: ExploreFilters) {
  return resolveExploreReturnTo(`/explore?${exploreSearchParams(filters)}`);
}

/** Narrower than the shared auth contract: this feature can only return to Explore. */
export function resolveExploreReturnTo(raw: string | null | undefined): string {
  if (
    !raw ||
    raw.length > 2048 ||
    resolveReturnTo(raw) !== raw ||
    raw.split("?")[0] !== "/explore" ||
    raw.includes("#")
  )
    return "/explore";
  // Validate encoded query values too, without weakening the general validator.
  let decoded = raw;
  try {
    for (let depth = 0; depth < 8; depth++) {
      if (
        /[\u0000-\u001f\u007f]/.test(decoded) ||
        decoded.includes("\\") ||
        decoded.includes("://")
      )
        return "/explore";
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      if (depth === 7) return "/explore";
      decoded = next;
    }
  } catch {
    return "/explore";
  }
  const filters = parseExploreFilters(new URLSearchParams(raw.slice(raw.indexOf("?") + 1)));
  const params = exploreSearchParams(filters);
  if (filters.type === "characters") params.delete("type");
  if (filters.sort === "relevance") params.delete("sort");
  if (filters.gender === "female") params.delete("gender");
  const query = params.toString();
  return resolveReturnTo(query ? `/explore?${query}` : "/explore");
}
