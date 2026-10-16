import fallbackMapJson from "./fallback-map.json";
import type { FallbackAssetMap } from "./fallback-map.types";

/**
 * Bundled `main`-tag fallback asset map (task 6 of migrate-big-assets).
 * A snapshot of the live backend map taken by `scripts/snapshot-asset-map.mjs`:
 * every Vercel build re-takes it from its own backend (BACK-411), and
 * `npm run assets:snapshot` refreshes the committed copy. Never hand-edit
 * `fallback-map.json`.
 *
 * Consumed by the resolver (task 7) as the last-known-good floor: every key
 * the frontend references must resolve here even with the network blocked.
 */
export const FALLBACK_ASSET_MAP: FallbackAssetMap = fallbackMapJson;

export type { FallbackAssetEntry, FallbackAssetMap } from "./fallback-map.types";
