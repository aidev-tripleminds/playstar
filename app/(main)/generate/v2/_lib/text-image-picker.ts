import type {
  SelectFileCategory,
  SelectFileItem,
} from "@/components/common/general/select-file-v2";
import type { GenerateOptionsResponse } from "@/lib/api/types";
import type { FallbackAssetMap } from "@/lib/assets/fallback-map";

import { generateOptionFileItems } from "./generate-source-assets";

export const TEXT_IMAGE_PICKER_TITLE = "Select content";

export type TextImageCharacter = {
  id: string;
  name: string;
  imageSrc?: string;
};

/**
 * Text to Image catalog: the signed-in user's characters, plus the image-mode
 * action, clothing, and location options the backend offers.
 * Video actions stay out — this picker chooses one still, not a timeline.
 */
export function textImagePickerItems(
  characters: readonly TextImageCharacter[],
  options: GenerateOptionsResponse,
  assets: FallbackAssetMap,
): SelectFileItem[] {
  const characterItems: SelectFileItem[] = characters.map((character, index) => ({
    id: character.id,
    name: character.name,
    imageSrc: character.imageSrc,
    category: "characters",
    tags: [],
    sortKey: String(characters.length - index).padStart(4, "0"),
  }));

  return [...characterItems, ...generateOptionFileItems("image-presets", options, assets)];
}

export function textImageCategoryForTarget(target: string): SelectFileCategory {
  if (target === "action" || target === "see-all") return "actions";
  if (target === "clothing") return "clothings";
  if (target === "location") return "location";
  return "characters";
}
