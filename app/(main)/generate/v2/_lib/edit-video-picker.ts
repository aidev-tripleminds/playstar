import type { SelectFileItem } from "@/components/common/general/select-file-v2";

import { GENERATE_PREVIEW_SAMPLE_VIDEO_ID } from "./constants";
import type { GenerateGalleryItem } from "./types";

function looksLikeVideoUrl(src: string) {
  return /\.(mp4|webm|mov|m4v)(?:\?|#|$)/i.test(src);
}

function stringSrc(src: GenerateGalleryItem["src"]) {
  if (typeof src === "string" && src) return src;
  if (src && typeof src === "object" && "src" in src && src.src) return src.src;
  return undefined;
}

/**
 * Still for the picker card. The file grid paints `imageSrc` with next/image,
 * so a muted mp4 is not a card. No still means the clip is left out.
 */
function stillSrcOf(item: GenerateGalleryItem) {
  if (item.posterSrc && !looksLikeVideoUrl(item.posterSrc)) return item.posterSrc;
  const src = stringSrc(item.src);
  if (src && !looksLikeVideoUrl(src)) return src;
  if (item.cardSrc && !looksLikeVideoUrl(item.cardSrc)) return item.cardSrc;
  return undefined;
}

function videoIdOf(item: GenerateGalleryItem) {
  return item.mediaId || item.id || undefined;
}

/**
 * Edit Video and Extend Video list gallery clips that have a still for the
 * image grid. Images stay out, and so does the marketing sample that the
 * Videos tab prepends. A clip with only an mp4 stays out too. A tile does
 * not need a separate `mediaId` — the row id is enough. Order follows the
 * gallery, newest first.
 */
export function editVideoPickerItems(items: readonly GenerateGalleryItem[]): SelectFileItem[] {
  const seen = new Set<string>();
  const eligible: GenerateGalleryItem[] = [];

  for (const item of items) {
    if (item.kind !== "video") continue;
    const id = videoIdOf(item);
    if (!id || seen.has(id) || id === GENERATE_PREVIEW_SAMPLE_VIDEO_ID) continue;
    if (!stillSrcOf(item)) continue;
    seen.add(id);
    eligible.push(item);
  }

  return eligible.map((item, index) => ({
    id: videoIdOf(item)!,
    name: item.prompt?.trim() || item.alt?.trim() || "Video",
    imageSrc: stillSrcOf(item),
    tags: [],
    sortKey: String(eligible.length - index).padStart(6, "0"),
  }));
}
