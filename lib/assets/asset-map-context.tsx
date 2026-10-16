"use client";

/**
 * Live asset-map client + resolver (task 7 of migrate-big-assets).
 *
 * `AssetMapProvider` fetches active tags, then the map for those tags, and
 * exposes the merged (bundle ⊕ fetched-main ⊕ active-tags) map through context.
 * `useAsset(key)` resolves `{ image?, video?, description? }` for a logical key
 * with the bundled `main` as the last-known-good floor. Both the render layer
 * (`useAsset`) and module-level call sites (`resolveAsset`, via the store) see
 * the same merged result.
 */

import { useQuery } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useEffect, useMemo } from "react";

import { fetchActiveTags, fetchAssetMap } from "@/lib/api/assets";

import type { ResolvedAsset } from "./asset-map.types";
import { setResolvedAssetMap } from "./asset-store";
import { FALLBACK_ASSET_MAP, type FallbackAssetMap } from "./fallback-map";
import { mergeAssetMap } from "./merge-asset-map";

const EMPTY_ASSET: ResolvedAsset = Object.freeze({});

// Default is the bundled floor: `useAsset` resolves from the bundle even with no
// provider mounted, so it never throws and first paint has no loading flash.
const AssetMapContext = createContext<FallbackAssetMap>(FALLBACK_ASSET_MAP);

const ACTIVE_TAGS_QUERY_KEY = ["asset-active-tags"] as const;

export function AssetMapProvider({ children }: { children: ReactNode }) {
  const activeTagsQuery = useQuery({
    queryKey: ACTIVE_TAGS_QUERY_KEY,
    queryFn: fetchActiveTags,
  });

  const activeTags = activeTagsQuery.data;
  const tagsForMap = activeTags && activeTags.length > 0 ? activeTags : undefined;

  const mapQuery = useQuery({
    queryKey: ["asset-map", tagsForMap],
    queryFn: () => fetchAssetMap(tagsForMap as string[]),
    // Depends on active-tags: only fetch the map once we know which tags apply.
    enabled: Boolean(tagsForMap),
  });

  // `mapQuery.data` is undefined until BOTH fetches succeed — until then (and on
  // any fetch error) the merge resolves everything from the bundle.
  const merged = useMemo(
    () => mergeAssetMap(FALLBACK_ASSET_MAP, mapQuery.data, activeTags ?? []),
    [mapQuery.data, activeTags],
  );

  // Keep the non-hook store in sync for module-level callers (constants file).
  useEffect(() => {
    setResolvedAssetMap(merged);
  }, [merged]);

  return <AssetMapContext.Provider value={merged}>{children}</AssetMapContext.Provider>;
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
