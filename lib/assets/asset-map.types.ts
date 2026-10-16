/**
 * Runtime resolver types (task 7 of migrate-big-assets). The per-tag/per-key
 * shapes reuse the bundled fallback's entry/map types (task 6) so the fetched
 * map, the bundled floor, and the merged result all speak the same shape.
 */

import type { FallbackAssetEntry, FallbackAssetMap } from "./fallback-map";

/**
 * The backend `/api/v1/assets/map` response: one sub-map per requested tag,
 * `{ tagName: { assetKey: { image?, video?, description } } }`.
 */
export type TaggedAssetMap = Record<string, FallbackAssetMap>;

/**
 * What the resolver returns for a logical key. Every field is optional on
 * purpose: an unknown key resolves to all-undefined so callers decide what to
 * do — the resolver never throws.
 */
export type ResolvedAsset = Partial<FallbackAssetEntry>;
