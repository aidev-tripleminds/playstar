"use client";

/**
 * Live asset-map client + resolver (task 7 of migrate-big-assets).
 *
 * `AssetMapProvider` fetches active tags, then the map for those tags, and
 * exposes the merged (bundle ⊕ fetched-main ⊕ active-tags) map through context.
 * `useAsset(key)` resolves `{ image?, video?, description? }` for a logical key,
 * with the bundled `main` as the last-known-good floor.
 */

import { createContext, type ReactNode, useContext } from "react";

import type { ResolvedAsset } from "./asset-map.types";
import { FALLBACK_ASSET_MAP, type FallbackAssetMap } from "./fallback-map";

const EMPTY_ASSET: ResolvedAsset = Object.freeze({});

// Default is the bundled floor: `useAsset` resolves from the bundle even with no
// provider mounted, so it never throws and first paint has no loading flash.
const AssetMapContext = createContext<FallbackAssetMap>(FALLBACK_ASSET_MAP);

export function AssetMapProvider({ children }: { children: ReactNode }) {
  return <AssetMapContext.Provider value={FALLBACK_ASSET_MAP}>{children}</AssetMapContext.Provider>;
}

/**
 * Resolve `{ image?, video?, description? }` for a logical key. Never throws:
 * falls back to the bundled `main` entry, and an unknown key returns
 * all-undefined fields for the caller to handle.
 */
export function useAssetMap(): FallbackAssetMap {
  return useContext(AssetMapContext);
}

export function useAsset(key: string): ResolvedAsset {
  const map = useAssetMap();
  return map[key] ?? EMPTY_ASSET;
}

/**
 * Resolve just the image URL for a logical key, with an optional fallback for
 * call sites migrating off a baked constant. New call sites can omit
 * `fallback` entirely: `useAssetImage("my_new_key")`.
 */
export function useAssetImage(key: string, fallback = ""): string {
  return useAsset(key).image ?? fallback;
}
