/**
 * The core runtime resolution rule (task 7 of migrate-big-assets, R5.2/R5.3/R3.5).
 *
 * Precedence for a logical key, highest first:
 *   1. the last active tag that defines it (tags overlaid in order, later wins),
 *   2. earlier active tags,
 *   3. `main` from the fetched map,
 *   4. `main` from the bundled fallback (task 6, last-known-good floor).
 *
 * Overlay is OBJECT-LEVEL per key (orchestrator decision on open-q #1): a tag
 * that defines a key replaces that key's whole `{ image, video, description }`;
 * a tag does NOT merge individual fields within a key. A key a tag omits keeps
 * the lower-precedence entry (partial-overlay ACROSS keys). Pure and total —
 * never throws.
 */

import type { TaggedAssetMap } from "./asset-map.types";
import type { FallbackAssetMap } from "./fallback-map";

export function mergeAssetMap(
  bundledMain: FallbackAssetMap,
  fetchedByTag: TaggedAssetMap | undefined,
  activeTags: readonly string[],
): FallbackAssetMap {
  // Bundle is the base floor: a shallow copy so every key resolves even offline,
  // and object-level overlay never mutates the bundled entries themselves.
  const merged: FallbackAssetMap = { ...bundledMain };

  // A failed/absent map fetch resolves EVERYTHING from the bundle (R3.5).
  if (!fetchedByTag) return merged;

  // Overlay each active tag in order — `main` is first, later tags win. Because
  // the fetched map includes its own `main`, this also layers fetched `main`
  // over the bundled `main`.
  for (const tag of activeTags) {
    const tagMap = fetchedByTag[tag];
    if (!tagMap) continue;
    for (const key of Object.keys(tagMap)) {
      // Guard the JSON-parsed backend keys: `__proto__`/`constructor`/`prototype`
      // are own-enumerable after JSON.parse, and a plain `merged[key] = …` would
      // pollute the prototype instead of adding an entry.
      if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
      merged[key] = tagMap[key];
    }
  }

  return merged;
}
