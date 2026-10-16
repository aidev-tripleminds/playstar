import type { ExploreChip } from "@/lib/api/explore";
import type { UsersCharacterMediaItem } from "@/lib/api/types";
import { mediaCardSources, storedMediaCardSources } from "@/lib/media-card-sources";

/**
 * Explore feed tile sources for the viewer: the ≤480 px card, falling back to
 * `s3_path_gallery`. A video the backend marks `blurred` plays its blurred
 * card video once it exists, else shows its blurred still as an image.
 */
export function exploreMediaSources(item: UsersCharacterMediaItem) {
  const blurred = item.blurred === true;
  const { cardSrc, isVideo: showVideo, posterSrc } = storedMediaCardSources(item);
  return {
    blurred,
    showVideo,
    imageSrc: showVideo ? "" : cardSrc,
    videoSrc: showVideo ? cardSrc : undefined,
    posterSrc,
  };
}

/**
 * A category chip's avatar. The chip never plays its clip, so a video chip
 * shows its poster when it has one and only falls back to the (paused) card
 * video. A blurred video chip shows its blurred poster, or its blurred still
 * while it has no blurred video.
 */
export function exploreChipMedia(
  chip: ExploreChip,
  videosTab: boolean,
): { imageSrc: string; videoSrc?: string } {
  if (!chip.image_url) return { imageSrc: "" };
  const { cardSrc, isVideo, posterSrc } = mediaCardSources({
    ...chip,
    url: chip.image_url,
    isVideo: videosTab,
  });
  if (!isVideo) return { imageSrc: cardSrc };
  return posterSrc ? { imageSrc: posterSrc } : { imageSrc: "", videoSrc: cardSrc };
}
