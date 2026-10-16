import type {
  CharacterCardUrls,
  MediaCardUrls,
  MyCharacterListItem,
  UsersCharacterMediaItem,
} from "@/lib/api/types";
import type { ResolvedAsset } from "@/lib/assets/asset-map.types";

/**
 * Which URL each surface shows, from the backend's per-viewer card fields
 * (see `MediaCardUrls`). Grids and thumbnails use the ≤480 px card; full-screen
 * shows the HD rendition (image or video), else the card, else the original.
 * Every field is optional, so an older response resolves exactly as before the
 * cards existed.
 */

export type MediaCardInput = MediaCardUrls & {
  /** The item's existing URL (`s3_path_gallery`): the original, or the blurred still. */
  url: string;
  isVideo: boolean;
  /**
   * The backend's `blurred`: `url` is the blurred still, and for a video
   * `web_url` / `web_hd_url` are the blurred (muted) videos when they exist.
   */
  blurred?: boolean;
};

export type MediaCardSources = {
  /** Grid tile / thumbnail source: a WebP image, or a muted MP4 when `isVideo`. */
  cardSrc: string;
  /**
   * Full-screen source: the ≤1280 px HD rendition (WebP image, or MP4 with
   * audio), else the card for a blurred video, else the original. Downloads
   * and generation inputs keep the original instead.
   */
  fullSrc: string;
  /**
   * True when `cardSrc` and `fullSrc` are videos to play. A blurred video is
   * one only once its blurred video exists; until then it is its still.
   */
  isVideo: boolean;
  /** Still for a video tile's `poster`, or a video's thumbnail image. */
  posterSrc?: string;
};

export function mediaCardSources({
  url,
  isVideo,
  blurred,
  web_url,
  web_hd_url,
  poster_url,
}: MediaCardInput): MediaCardSources {
  if (blurred === true && isVideo) {
    // An older response sent the blurred still as `web_url` (the same URL as
    // `url`); only a different URL is a blurred video.
    const card = web_url && web_url !== url ? web_url : null;
    const video = card ?? web_hd_url ?? null;
    if (!video) return { cardSrc: url, fullSrc: url, isVideo: false };
    return {
      cardSrc: video,
      fullSrc: web_hd_url ?? video,
      isVideo: true,
      posterSrc: poster_url ?? url,
    };
  }

  const cardSrc = web_url ?? url;
  const fullSrc = web_hd_url ?? url;
  if (!isVideo) return { cardSrc, fullSrc, isVideo: false };

  return { cardSrc, fullSrc, isVideo: true, posterSrc: poster_url ?? undefined };
}

/** Card, poster and full-screen URLs of a stored media row (`s3_path_gallery`) for this viewer. */
export function storedMediaCardSources(
  item: UsersCharacterMediaItem,
  isVideo = item.media_type.includes("video"),
): MediaCardSources {
  return mediaCardSources({ ...item, url: item.s3_path_gallery, isVideo });
}

type CharacterImageFields = CharacterCardUrls &
  Partial<Pick<MyCharacterListItem, "webp_image_url_s3" | "image_url_s3">>;

/** A character's card image: the card, else the webp, else the original. `null` while pending. */
export function characterCardSrc(character: CharacterImageFields): string | null {
  return character.thumbnail_url ?? character.webp_image_url_s3 ?? character.image_url_s3 ?? null;
}

/**
 * An asset-map entry's card sources. A gated viewer's entry never carries the
 * original `video`: `image` is the blurred still and `video_web` (else
 * `video_web_hd`) the blurred video when it exists, so only those are used.
 */
export function assetCardSources(asset: ResolvedAsset): {
  image?: string;
  video?: string;
  poster?: string;
} {
  const image = asset.image_web ?? asset.image;
  const video =
    asset.blurred === true
      ? (asset.video_web ?? asset.video_web_hd)
      : (asset.video_web ?? asset.video);

  return { image, video: video ?? undefined, poster: asset.poster ?? undefined };
}
