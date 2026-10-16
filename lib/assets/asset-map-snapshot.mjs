/**
 * Builds `fallback-map.json` from the backend's live `main` asset map
 * (BACK-411). `scripts/snapshot-asset-map.mjs` fetches the map and calls this;
 * the logic lives here so it can be tested without a network.
 *
 * The live map is the only place the card renditions (`video_web`, `poster`,
 * `image_web`) are known — their `derived/<etag>/` paths depend on the backend
 * environment — so the bundle must be a snapshot of the same backend the build
 * talks to, not something derived from the manifest.
 *
 * The map is fetched as an anonymous viewer, so gated keys arrive blurred
 * (`blurred: true`). They stay blurred in the bundle: the bundle is what every
 * viewer sees before the live map arrives, and an anonymous viewer must never
 * get the original.
 */

/** Keys `JSON.parse` makes own-enumerable that must never become map keys. */
const UNSAFE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Copy an entry without its `null` fields: the bundle reads `null` and absent alike. */
function withoutNulls(entry) {
  return Object.fromEntries(Object.entries(entry).filter(([, value]) => value != null));
}

/**
 * @param {object} input
 * @param {Record<string, Record<string, unknown>>} input.liveMain the `main` sub-map of `/api/v1/assets/map`
 * @param {Array<{ logicalKey: string, migrate: boolean, tigrisKey: string | null, linkTo?: string | null, description: string }>} input.manifestRows
 * @returns {{ map: Record<string, Record<string, unknown>>, problems: string[] }}
 */
export function buildAssetMapSnapshot({ liveMain, manifestRows }) {
  const problems = [];
  const map = {};

  for (const key of Object.keys(liveMain ?? {})) {
    if (UNSAFE_KEYS.has(key)) continue;
    map[key] = withoutNulls(liveMain[key]);
  }

  if (Object.keys(map).length === 0) {
    return { map, problems: ["the live main map is empty (wrong brand host?)"] };
  }

  // Every key the frontend references must resolve from the bundle. A key that
  // reuses another's file (`linkTo`) may have no row of its own in the backend:
  // give it the target's media under its own description.
  const eligible = manifestRows.filter((row) => row.migrate && (row.tigrisKey || row.linkTo));
  for (const row of eligible) {
    if (map[row.logicalKey]) continue;
    const target = row.linkTo ? map[row.linkTo] : undefined;
    if (target) {
      map[row.logicalKey] = { ...target, description: row.description };
    } else {
      problems.push(`missing key "${row.logicalKey}"`);
    }
  }

  for (const [key, entry] of Object.entries(map)) {
    if (typeof entry.description !== "string" || !entry.description.trim()) {
      problems.push(`key "${key}" has no description`);
    }
    if (!entry.image && !entry.video && !entry.video_web) {
      problems.push(`key "${key}" has no media`);
    }
    // The point of the snapshot: a video card must not fall back to the original.
    if (entry.video && !(entry.video_web && entry.poster)) {
      problems.push(`video key "${key}" has no video_web/poster rendition`);
    }
  }

  return {
    map: Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b))),
    problems,
  };
}
