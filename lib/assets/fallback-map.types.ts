/**
 * Types for the bundled `main`-tag fallback asset map (task 6 of
 * migrate-big-assets). The map is a snapshot of the live backend map taken by
 * `scripts/snapshot-asset-map.mjs` — do not hand-edit `fallback-map.json`.
 *
 * Shape matches one tag's sub-object from the backend's asset-map endpoint
 * (task 3): `{ [logicalKey]: { image?, video?, description } }`.
 */

export type FallbackAssetEntry = {
  /** Tigris public URL for the image variant, if this key has one. */
  image?: string;
  /** Tigris public URL for the video variant, if this key has one. */
  video?: string;
  /** Alt text / label for the asset. */
  description: string;
  /*
   * Rendition fields. Per viewer, `null` until the rendition exists; the
   * bundle, an anonymous viewer's map, drops `null` fields. For a gated viewer
   * (`blurred: true`) `image` already carries the blur, `video` is `null`,
   * `image_web` is `null`, and `video_web` / `video_web_hd` / `poster` are
   * the blurred renditions. Read them through `assetCardSources`.
   */
  /** ≤480 px WebP card of `image`. */
  image_web?: string | null;
  /** ≤480 px muted MP4 card of `video` (the blurred card video when gated). */
  video_web?: string | null;
  /** ≤1280 px rendition of `video` with audio (the muted blurred one when gated). */
  video_web_hd?: string | null;
  /** WebP still of `video` (the blurred poster when gated). */
  poster?: string | null;
  /** The backend's decision that this viewer must see the asset blurred. */
  blurred?: boolean;
};

export type FallbackAssetMap = Record<string, FallbackAssetEntry>;
