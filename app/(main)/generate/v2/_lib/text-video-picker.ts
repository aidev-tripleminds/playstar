import type {
  SelectFileCategory,
  SelectFileItem,
} from "@/components/common/general/select-file-v2";
import type { GenerateOptionsResponse } from "@/lib/api/types";
import type { FallbackAssetMap } from "@/lib/assets/fallback-map";

import { generateOptionFileItems, isGenerateVideoActionId } from "./generate-source-assets";

export const TEXT_VIDEO_PICKER_TITLE = "Select content";

export type TextVideoCharacter = {
  id: string;
  name: string;
  imageSrc?: string;
};

/**
 * Text to Video catalog: the signed-in user's characters, the video-mode
 * actions, and the clothing and location options the backend offers.
 * Image-mode poses stay out. Actions are clips on the timeline.
 */
export function textVideoPickerItems(
  characters: readonly TextVideoCharacter[],
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

  return [...characterItems, ...generateOptionFileItems("video-presets", options, assets)];
}

export function textVideoCategoryForTarget(target: string): SelectFileCategory {
  if (target === "action" || target === "see-all") return "actions";
  if (target === "clothing") return "clothings";
  if (target === "location") return "location";
  return "characters";
}

/** Timeline ids to restore. Image-mode poses are not video clips. */
export function textVideoActionIds(
  action: { id: string; clips?: readonly { id: string }[] } | undefined,
): string[] {
  if (!action) return [];
  if (action.clips?.length) return action.clips.map((clip) => clip.id);
  if (isGenerateVideoActionId(action.id)) return [action.id];
  return [];
}
