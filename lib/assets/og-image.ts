import { fetchActiveTags, fetchAssetMap } from "@/lib/api/assets";

import { FALLBACK_ASSET_MAP } from "./fallback-map";
import { mergeAssetMap } from "./merge-asset-map";

export const DEFAULT_OG_IMAGE_ASSET_KEY = "banner_og_image";

const OG_IMAGE_REVALIDATE_SECONDS = 60;
const BUNDLED_OG_IMAGE_FALLBACK_URL = FALLBACK_ASSET_MAP.demo_pics_rose_day?.image ?? "";

/**
 * Resolves the backoffice-managed default social image for server-generated
 * metadata. The browser's AssetMapProvider is not mounted when Next builds
 * `<head>`, so metadata must read the public asset map directly.
 */
export async function resolveDefaultOgImageUrl(): Promise<string> {
  try {
    const activeTags = await fetchActiveTags({
      next: { revalidate: OG_IMAGE_REVALIDATE_SECONDS },
    });
    const tags = activeTags.length > 0 ? activeTags : ["main"];
    const fetchedMap = await fetchAssetMap(tags, {
      next: { revalidate: OG_IMAGE_REVALIDATE_SECONDS },
    });

    return (
      mergeAssetMap(FALLBACK_ASSET_MAP, fetchedMap, tags)[DEFAULT_OG_IMAGE_ASSET_KEY]?.image ??
      BUNDLED_OG_IMAGE_FALLBACK_URL
    );
  } catch {
    return BUNDLED_OG_IMAGE_FALLBACK_URL;
  }
}
