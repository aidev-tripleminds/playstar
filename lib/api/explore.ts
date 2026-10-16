import { apiFetch } from "./client";
import type {
  CharacterDetail,
  MediaCardUrls,
  PublicCharacterListItem,
  UsersCharacterMediaItem,
} from "./types";

export const EXPLORE_TYPES = ["characters", "pictures", "videos"] as const;
export const EXPLORE_SORTS = ["relevance", "popularity", "newest", "oldest"] as const;
export const EXPLORE_AGES = ["teen", "young_adult", "adult", "mature"] as const;
export type ExploreType = (typeof EXPLORE_TYPES)[number];
export type ExploreFilters = {
  type: ExploreType;
  sort: (typeof EXPLORE_SORTS)[number];
  search?: string;
  gender?: string;
  style?: string;
  age?: (typeof EXPLORE_AGES)[number];
  categories?: string;
  following?: "true";
  saved?: "true";
};
export type ExploreCharacter = Omit<PublicCharacterListItem, "presigned_url"> &
  Pick<CharacterDetail, "webp_image_url_s3" | "voice_id">;
export type ExploreItem = ExploreCharacter | UsersCharacterMediaItem;
export type ExplorePage = { items: ExploreItem[]; next_cursor: string | null; has_more: boolean };
export type ExploreOption = { key: string; label: string };
/**
 * A category chip. `image_url` is per viewer: a blurred chip's URL is the
 * blurred still, even on the videos tab. Card fields as on `MediaCardUrls`.
 */
export type ExploreChip = ExploreOption &
  Pick<MediaCardUrls, "web_url" | "poster_url"> & {
    count: number;
    image_url: string | null;
    /** Absent on older responses. */
    blurred?: boolean;
  };
export type ExploreOptions = {
  categories: ExploreOption[];
  genders: ExploreOption[];
  styles: ExploreOption[];
};
function queryString(query: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    if (value !== undefined && value !== "") params.set(key, String(value));
  return params.toString();
}
export function fetchExploreFeed(query: ExploreFilters & { cursor?: string; limit?: number }) {
  return apiFetch<ExplorePage>(`/api/v1/explore/feed?${queryString(query)}`);
}
export function fetchExploreCategories(
  query: Pick<ExploreFilters, "type" | "gender" | "style" | "age">,
) {
  return apiFetch<{ items: ExploreChip[] }>(`/api/v1/explore/categories?${queryString(query)}`);
}
export function fetchExploreOptions(query: Pick<ExploreFilters, "type" | "gender" | "style">) {
  return apiFetch<ExploreOptions>(`/api/v1/explore/options?${queryString(query)}`);
}

export type ExplorePreview = {
  character: ExploreCharacter;
  is_owner: boolean;
  /** False for a guest. */
  is_following: boolean;
  media: UsersCharacterMediaItem[];
};
export function fetchExplorePreview(characterId: string) {
  return apiFetch<ExplorePreview>(
    `/api/v1/explore/preview?${new URLSearchParams({ character_id: characterId })}`,
  );
}
export function fetchExploreViewer() {
  return apiFetch<{ has_created_character: boolean }>("/api/v1/explore/viewer");
}
export function reportExploreOpen(itemType: "character" | "picture" | "video", itemId: string) {
  void apiFetch("/api/v1/explore/interactions", {
    method: "POST",
    body: JSON.stringify({ itemType, itemId, kind: "preview_open" }),
  }).catch(() => undefined);
}

export type ExploreInitialData = {
  filters: ExploreFilters;
  options: ExploreOptions;
  page: ExplorePage;
  categories?: Awaited<ReturnType<typeof fetchExploreCategories>>;
};
