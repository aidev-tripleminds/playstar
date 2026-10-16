import type { SelectFileItem } from "@/components/common/general/select-file-v2";

import { characterMediaIdFromGalleryItem, isPersistedCharacterId } from "../../_lib/generate-media";
import type { GenerateGalleryItem } from "./types";

/** Same picture the gallery tile paints: card, then the original, then a poster. */
function imageSrcOf(item: GenerateGalleryItem) {
  if (item.cardSrc) return item.cardSrc;
  if (typeof item.src === "string" && item.src) return item.src;
  if (item.src && typeof item.src === "object" && "src" in item.src && item.src.src) {
    return item.src.src;
  }
  return item.posterSrc;
}

/**
 * Image to Video lists every still in the signed-in library. Videos stay out,
 * and so does a local placeholder with no persisted id — create-video can only
 * send `source_media_id`. A still with no linked character stays out too:
 * create-video also needs `character_id`. Uploads stay in: this list is all of
 * the account's character images, not the seedable subset Edit Image uses.
 * Order follows the gallery, newest first.
 */
export function imageToVideoPickerItems(items: readonly GenerateGalleryItem[]): SelectFileItem[] {
  const seen = new Set<string>();
  const eligible: { item: GenerateGalleryItem; id: string }[] = [];

  for (const item of items) {
    if (item.kind === "video") continue;
    const id = characterMediaIdFromGalleryItem(item);
    if (!id || seen.has(id)) continue;
    if (!isPersistedCharacterId(item.characterId)) continue;
    if (!imageSrcOf(item)) continue;
    seen.add(id);
    eligible.push({ item, id });
  }

  return eligible.map(({ item, id }, index) => ({
    id,
    name: item.prompt?.trim() || item.alt?.trim() || "Image",
    imageSrc: imageSrcOf(item),
    tags: [],
    sortKey: String(eligible.length - index).padStart(6, "0"),
  }));
}
