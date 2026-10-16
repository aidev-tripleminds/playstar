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

export type EditImageLoadTarget = {
  id: string;
  name: string;
  imageSrc: string;
};

/**
 * Persisted still the provider can seed. Videos, uploads with
 * `can_generate_from: false`, and local `generated-*` placeholders stay out —
 * those ids cannot be sent as `source_media_id`.
 */
export function editImageLoadTarget(item: GenerateGalleryItem): EditImageLoadTarget | null {
  if (item.kind === "video") return null;
  if (item.canGenerateFrom === false) return null;
  const id = characterMediaIdFromGalleryItem(item);
  if (!id || !isPersistedCharacterId(id)) return null;
  const imageSrc = imageSrcOf(item);
  if (!imageSrc) return null;

  return {
    id,
    name: item.prompt?.trim() || item.alt?.trim() || "Image",
    imageSrc,
  };
}

/**
 * Edit Image lists persisted stills the provider can seed. Order follows the
 * gallery, newest first.
 */
export function editImagePickerItems(items: readonly GenerateGalleryItem[]): SelectFileItem[] {
  const seen = new Set<string>();
  const eligible: EditImageLoadTarget[] = [];

  for (const item of items) {
    const target = editImageLoadTarget(item);
    if (!target || seen.has(target.id)) continue;
    seen.add(target.id);
    eligible.push(target);
  }

  return eligible.map((target, index) => ({
    id: target.id,
    name: target.name,
    imageSrc: target.imageSrc,
    tags: [],
    sortKey: String(eligible.length - index).padStart(6, "0"),
  }));
}
