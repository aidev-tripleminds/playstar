import type { ChooseTemplateItem } from "@/components/common/chat/choose-template";
import type {
  SelectFileCategory,
  SelectFileItem,
} from "@/components/common/general/select-file-v2";
import {
  isPromptBoxVideoMedia,
  type PromptBoxActionItem,
  type PromptBoxMedia,
} from "@/components/common/generate/prompt-box";
import type { GenerateOption, GenerateOptionsResponse } from "@/lib/api/types";
import type { FallbackAssetMap } from "@/lib/assets/fallback-map";
import { assetCardSources } from "@/lib/media-card-sources";

import type { GenerateSourceSelection, GenerateSourceSlotId } from "./types";

/**
 * The Action, Clothing and Location pickers. Their options come from
 * `GET /api/v1/generate/options` (`useGenerateOptions`) and their media from
 * the asset map (`useAssetMap`), under each option's `asset_key`.
 */

/** Which list an option is in. Actions are per media. */
export const GENERATE_OPTION_LISTS = [
  "image-action",
  "video-action",
  "clothing",
  "location",
] as const;

export type GenerateOptionList = (typeof GENERATE_OPTION_LISTS)[number];

export const GENERATE_NEW_BADGE_LABEL = "New";

/**
 * A picker item's id: the list, then the option key. The key alone is not
 * unique: an image action and a video action can share it, and the Text to
 * Image and Text to Video pickers put four lists in one array. The list also
 * tells a video action from an image pose with no catalogue at hand.
 */
export function generateOptionId(list: GenerateOptionList, key: string): string {
  return `${list}:${key}`;
}

/** The list and option key behind a picker item id, or `undefined` for any other id. */
export function parseGenerateOptionId(
  id: string,
): { list: GenerateOptionList; key: string } | undefined {
  const separator = id.indexOf(":");
  if (separator < 0) return undefined;
  const list = GENERATE_OPTION_LISTS.find((entry) => entry === id.slice(0, separator));
  const key = id.slice(separator + 1);
  return list && key ? { list, key } : undefined;
}

/** True for a Text to Video action's id. An image-mode pose is not a video action. */
export function isGenerateVideoActionId(id: string): boolean {
  return parseGenerateOptionId(id)?.list === "video-action";
}

export function getGenerateActionAssets(
  options: GenerateOptionsResponse,
  media: PromptBoxMedia,
): readonly GenerateOption[] {
  return isPromptBoxVideoMedia(media) ? options.actions.video : options.actions.image;
}

function actionList(media: PromptBoxMedia): GenerateOptionList {
  return isPromptBoxVideoMedia(media) ? "video-action" : "image-action";
}

/**
 * A card's still and preview video. An option can have only an image, only a
 * video, or both; a video's still is its poster. A gated viewer's entry
 * already carries the blurred versions.
 */
function optionMedia(option: GenerateOption, assets: FallbackAssetMap) {
  const asset = assets[option.asset_key];
  const cards = assetCardSources(asset ?? {});
  return {
    imageSrc: cards.image ?? cards.poster,
    videoSrc: cards.video,
    description: asset?.description,
  };
}

function toPickerItem(
  option: GenerateOption,
  list: GenerateOptionList,
  assets: FallbackAssetMap,
): ChooseTemplateItem {
  const media = optionMedia(option, assets);
  return {
    id: generateOptionId(list, option.key),
    variant: list === "video-action" ? "videos" : "images",
    name: option.label,
    imageAlt: option.label,
    assetKey: option.asset_key,
    imageSrc: media.imageSrc ?? "",
    videoSrc: media.videoSrc,
    description: media.description,
    filterTag: option.category ?? undefined,
    badgeLabel: option.is_new ? GENERATE_NEW_BADGE_LABEL : undefined,
  };
}

/** The options of one slot, as picker items. Empty while the options load or after they failed. */
export function getGenerateSourcePickerItems(
  slotId: GenerateSourceSlotId | "see-all",
  media: PromptBoxMedia,
  options: GenerateOptionsResponse,
  assets: FallbackAssetMap,
): ChooseTemplateItem[] {
  if (slotId === "clothing") {
    return options.clothing.map((option) => toPickerItem(option, "clothing", assets));
  }
  if (slotId === "location") {
    return options.locations.map((option) => toPickerItem(option, "location", assets));
  }
  if (slotId === "action" || slotId === "see-all") {
    const list = actionList(media);
    return getGenerateActionAssets(options, media).map((option) =>
      toPickerItem(option, list, assets),
    );
  }
  return [];
}

function toFileItems(
  category: SelectFileCategory,
  list: GenerateOptionList,
  options: readonly GenerateOption[],
  assets: FallbackAssetMap,
): SelectFileItem[] {
  return options.map((option, index) => {
    const media = optionMedia(option, assets);
    return {
      id: generateOptionId(list, option.key),
      name: option.label,
      imageSrc: media.imageSrc,
      videoSrc: media.videoSrc,
      isNew: option.is_new,
      category,
      // The picker's grouping field. Its filter chips are off on generate.
      tags: option.category ? [option.category] : [],
      // "Newest first" is the default sort, so the backend's order stays on top.
      sortKey: String(options.length - index).padStart(4, "0"),
    };
  });
}

/**
 * The action, clothing and location cards of the Text to Image and Text to
 * Video pickers. `media` picks the action list: a still picker never lists
 * video actions, and a timeline never lists image poses.
 */
export function generateOptionFileItems(
  media: PromptBoxMedia,
  options: GenerateOptionsResponse,
  assets: FallbackAssetMap,
): SelectFileItem[] {
  return [
    ...toFileItems("actions", actionList(media), getGenerateActionAssets(options, media), assets),
    ...toFileItems("clothings", "clothing", options.clothing, assets),
    ...toFileItems("location", "location", options.locations, assets),
  ];
}

export function generateSourceItemToAction(item: ChooseTemplateItem): PromptBoxActionItem {
  return {
    id: item.id,
    label: item.name ?? item.id,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt ?? item.name,
    assetKey: item.assetKey,
  };
}

function normalizeOptionValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

/**
 * The option a stored value names. Generated media stores the option key; an
 * older value can be the display label or the asset key the picker once used
 * as its id. The key wins, so a label equal to another option's key cannot
 * shadow it.
 */
export function findGenerateOption(
  options: readonly GenerateOption[],
  value: string | null | undefined,
): GenerateOption | undefined {
  const wanted = value ? normalizeOptionValue(value) : "";
  if (!wanted) return undefined;
  return (
    options.find((option) => option.key === wanted) ??
    options.find((option) => normalizeOptionValue(option.asset_key) === wanted) ??
    options.find((option) => normalizeOptionValue(option.label) === wanted)
  );
}

/**
 * The create-image / create-video value for a stored one: the key of the
 * option it names. An unknown value is sent as stored, so the backend decides
 * (the option may be retired, or the options may not have loaded).
 */
export function getStoredGenerateOptionValue(
  options: readonly GenerateOption[],
  value: string | null | undefined,
): string | undefined {
  return findGenerateOption(options, value)?.key ?? (value?.trim() || undefined);
}

/**
 * create-image / create-video `action`, `clothing` or `location`: the selected
 * option's key. A selection that is not one of the options sends its name,
 * which the backend also accepts.
 */
export function getGenerateSourceFieldValue(
  selection: GenerateSourceSelection | undefined,
): string | undefined {
  if (!selection || selection.kind === "audio") return undefined;
  const value = parseGenerateOptionId(selection.id)?.key ?? selection.label.trim();
  return value || undefined;
}

/**
 * create-video `action`. Timeline clips stay in order. The field is one string,
 * so more than one clip is the option keys joined in that order.
 * An image-mode pose is not a video action.
 */
export function getGenerateVideoActionValue(
  selection: GenerateSourceSelection | undefined,
): string | undefined {
  if (!selection || selection.kind === "audio") return undefined;

  const clips = selection.clips?.filter((clip) => isGenerateVideoActionId(clip.id));
  if (clips && clips.length > 0) {
    return clips.map((clip) => parseGenerateOptionId(clip.id)?.key).join(", ");
  }

  if (!isGenerateVideoActionId(selection.id)) return undefined;
  return getGenerateSourceFieldValue(selection);
}

/** create-image `action`. A video timeline clip is not an image pose. */
export function getGenerateImageActionValue(
  selection: GenerateSourceSelection | undefined,
): string | undefined {
  if (!selection || selection.kind === "audio") return undefined;
  if (selection.clips?.length || isGenerateVideoActionId(selection.id)) return undefined;
  return getGenerateSourceFieldValue(selection);
}
