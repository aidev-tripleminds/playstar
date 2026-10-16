import type { ChooseTemplateItem } from "@/components/common/chat/choose-template";
import {
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION,
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTIONS,
  type PromptBoxActionItem,
  type PromptBoxMedia,
} from "@/components/common/generate/prompt-box";

import { generateSourceItemToAction } from "./generate-source-assets";
import type { GenerateSourceSelection, GenerateSourceSlotId } from "./types";

export const GENERATE_PROMPT_TAG_SLOTS = [
  "character",
  "action",
  "clothing",
  "location",
] as const satisfies readonly GenerateSourceSlotId[];

export type GeneratePromptTagSlot = (typeof GENERATE_PROMPT_TAG_SLOTS)[number] | "custom-prompt";

export const GENERATE_PROMPT_TAG_CHIP_LIMIT = 3;

function pickerItemsToChipActions(items: readonly ChooseTemplateItem[]): PromptBoxActionItem[] {
  return items.slice(0, GENERATE_PROMPT_TAG_CHIP_LIMIT).map(generateSourceItemToAction);
}

export function isGeneratePresetTagMedia(media: PromptBoxMedia) {
  return media === "image-presets" || media === "video-presets";
}

export function getGeneratePromptTagSlot(
  media: PromptBoxMedia,
  sources: Partial<Record<GenerateSourceSlotId, GenerateSourceSelection>>,
  characterTemplates?: readonly ChooseTemplateItem[],
  /**
   * Whether an option slot (action, clothing, location) has anything to offer.
   * The lists come from the backend and an admin can leave one empty; an empty
   * slot is skipped like an empty character list, so the flow moves on instead
   * of stopping at a picker with nothing in it.
   */
  hasSourceItems?: (slot: Exclude<GenerateSourceSlotId, "character">) => boolean,
): GeneratePromptTagSlot {
  if (!isGeneratePresetTagMedia(media)) return "custom-prompt";

  for (const slot of GENERATE_PROMPT_TAG_SLOTS) {
    if (sources[slot]) continue;
    if (slot !== "character" && hasSourceItems && !hasSourceItems(slot)) continue;
    if (
      slot === "character" &&
      characterTemplates !== undefined &&
      characterTemplatesToActions(characterTemplates).length === 0
    ) {
      continue;
    }
    return slot;
  }

  return "custom-prompt";
}

function characterTemplatesToActions(
  characterTemplates: readonly ChooseTemplateItem[],
): PromptBoxActionItem[] {
  return characterTemplates
    .filter((template) => Boolean(template.imageSrc ?? template.insetImageSrc))
    .slice(0, GENERATE_PROMPT_TAG_CHIP_LIMIT)
    .map((template) => ({
      id: template.id,
      label: template.name ?? template.id,
      imageSrc: template.imageSrc ?? template.insetImageSrc,
      imageAlt: template.imageAlt ?? template.name,
      assetKey: template.assetKey,
    }));
}

function withCustomPrompt(actions: PromptBoxActionItem[]): PromptBoxActionItem[] {
  return [PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION, ...actions];
}

export function getGeneratePromptTagActions({
  slot,
  characterTemplates,
  sourceItems = [],
}: {
  slot: GeneratePromptTagSlot;
  characterTemplates: readonly ChooseTemplateItem[];
  /** The slot's options, in picker order (`getGenerateSourcePickerItems`). */
  sourceItems?: readonly ChooseTemplateItem[];
}): PromptBoxActionItem[] {
  if (slot === "custom-prompt") return PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTIONS;
  if (slot === "character") {
    return withCustomPrompt(characterTemplatesToActions(characterTemplates));
  }
  return withCustomPrompt(pickerItemsToChipActions(sourceItems));
}

export function shouldShowGeneratePromptTagSeeAll(slot: GeneratePromptTagSlot) {
  return slot !== "custom-prompt";
}
