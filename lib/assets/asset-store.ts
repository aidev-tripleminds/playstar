/**
 * Non-hook resolver for module-level call sites (task 7 of migrate-big-assets).
 *
 * The create-ai-gf constants file (task 8) is evaluated at import time and can't
 * read React context, so it resolves keys through this module-level store. The
 * store starts at the bundled floor and is kept in sync with the live merged map
 * by `AssetMapProvider`. Component call sites should prefer `useAsset` so they
 * re-render when the live map hydrates.
 */

import type { ResolvedAsset } from "./asset-map.types";
import { FALLBACK_ASSET_MAP, type FallbackAssetMap } from "./fallback-map";

const EMPTY_ASSET: ResolvedAsset = Object.freeze({});

// Latest merged map. Starts at the bundled `main` so non-hook callers resolve
// correctly before — and even entirely without — the live map hydrating.
let currentMap: FallbackAssetMap = FALLBACK_ASSET_MAP;

/** Push the newest merged map. Called by `AssetMapProvider` as the map hydrates. */
export function setResolvedAssetMap(map: FallbackAssetMap): void {
  currentMap = map;
}

/**
 * Resolve `{ image?, video?, description? }` for a logical key without React.
 * Never throws; an unknown key yields all-undefined fields.
 */
export function resolveAsset(key: string): ResolvedAsset {
  return currentMap[key] ?? EMPTY_ASSET;
}
