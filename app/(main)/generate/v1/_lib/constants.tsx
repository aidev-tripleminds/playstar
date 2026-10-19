import type { PlaceholderProcessingState } from "@/components/common/general/placeholder-processing/placeholder-processing";
import type { CheckpointThumbnailVariant } from "@/components/common/generate/checkpoint-thumbnail";
import type { PromptboxHybridMedia } from "@/components/common/generate/promptbox-hybrid";
import {
  defaultMediaPreviewItems,
  defaultMediaPreviewMetadata,
  defaultMediaPreviewPrompt,
} from "@/components/common/image-preview/media-preview/constants";
import type { MediaPreviewItem } from "@/components/common/image-preview/media-preview/types";
import { dummyImage } from "@/lib/dummy-images";
import { GalleryIcon, SelectionFillIcon, VideoSquareIcon } from "@/public/assets/icons";
import { GalleryIcon2 } from "@/public/assets/icons/gallery-icon2";

export { GENERATE_DEFAULT_NUM_IMAGES, isPersistedCharacterId } from "../../_lib/generate-media";

/** ChooseTemplate type tabs: Characters (0), Images (1), Video (2). */
export const GENERATE_CHOOSE_TEMPLATE_TYPE_TAB = {
  characters: 0,
  images: 1,
  videos: 2,
} as const;

const TAB_ICON_CLASS = "size-5 shrink-0";

export const GENERATE_SECTION_TABS = [
  {
    id: "templates",
    label: "Templates",
    leftIconSrc: <GalleryIcon2 className={TAB_ICON_CLASS} />,
    media: "image-presets" as PromptboxHybridMedia,
  },
  {
    id: "images",
    label: "Images",
    leftIconSrc: <GalleryIcon className={TAB_ICON_CLASS} />,
    media: "image-presets" as PromptboxHybridMedia,
  },
  {
    id: "videos",
    label: "Videos",
    leftIconSrc: <VideoSquareIcon className={TAB_ICON_CLASS} />,
    media: "video-presets" as PromptboxHybridMedia,
  },
] as const;

export type GenerateSectionTabId = (typeof GENERATE_SECTION_TABS)[number]["id"];

export type GenerateGalleryItem = MediaPreviewItem & {
  kind: "image" | "video";
  isNsfw?: boolean;
  /** Prompt text used by gallery search. */
  prompt?: string;
  /** CharacterMedia.id — identity for remix/animate (`source_media_id`). */
  mediaId?: string;
  characterId?: string | null;
  characterName?: string;
  characterImageSrc?: string;
  pose?: string;
  checkpoint?: string | null;
  aspectRatio?: string | null;
  /** ISO timestamp from the media row's `created_at`. */
  createdAt?: string;
};

export const GENERATE_IMAGES_SECTION_INDEX = GENERATE_SECTION_TABS.findIndex(
  (tab) => tab.id === "images",
);
export const GENERATE_VIDEOS_SECTION_INDEX = GENERATE_SECTION_TABS.findIndex(
  (tab) => tab.id === "videos",
);

export const GENERATE_IMAGE_PRESETS_TAB = 0;
export const GENERATE_IMAGE_EDIT_TAB = 1;
export const GENERATE_VIDEO_IMAGE2VID_TAB = 1;
export const GENERATE_VIDEO_EXTEND_TAB = 2;
export const GENERATE_VIDEO_EDIT_TAB = 3;

export const GENERATE_DEFAULT_SECTION_TAB_ID: GenerateSectionTabId = "templates";

export const GENERATE_SEARCH_PLACEHOLDER = "Search...";

export const GENERATE_BLUR_NSFW_LABEL_OFF = "Blur ";

export const GENERATE_BLUR_NSFW_LABEL_ON = "Blur : Yes";

export const GENERATE_BLUR_NSFW_LABEL = "Blur ";

export const GENERATE_SELECT_LABEL = "Select";

export const GENERATE_BULK_SELECT_LABEL = "Bulk Select";

export const GENERATE_QUICK_ACTIONS_TITLE = "Quick actions";

export const GENERATE_INFO_MODAL_TITLE = "Klams AI Tutorial";

export const GENERATE_INFO_MODAL_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
] as const;

export const GENERATE_INFO_MODAL_GOT_IT_LABEL = "Got it";

export const GENERATE_INFO_MODAL_WIKI_LABEL = "Read the guide on our wiki";

/** Placeholder until the wiki URL is finalized. */
export const GENERATE_INFO_MODAL_WIKI_HREF = "#";

/**
 * Mobile DialogContent uses `h-fit!` so Android sheets can grow past Vaul's
 * inline height. iOS Safari then sizes fit-content from the header only —
 * nested `flex-1 min-h-0` children collapse to 0.
 * A definite drawer height keeps generate action sheets usable on both platforms.
 */
export const GENERATE_MOBILE_DRAWER_496_CLASS =
  "data-[vaul-drawer-direction=bottom]:h-[min(496px,calc(100dvh-1rem))]! data-[vaul-drawer-direction=bottom]:max-h-[min(496px,calc(100dvh-1rem))]! data-[vaul-drawer-direction=bottom]:min-h-[min(496px,calc(100dvh-1rem))]";

/**
 * Short picker sheets: wrap the list, cap at 496px. Avoids the empty space from
 * GENERATE_MOBILE_DRAWER_496_CLASS. Pair with intrinsic-height children (no flex-1)
 * so iOS does not collapse the body.
 */
export const GENERATE_MOBILE_DRAWER_FIT_CLASS =
  "data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[min(496px,calc(100dvh-1rem))]!";

export const GENERATE_MOBILE_DRAWER_580_CLASS =
  "data-[vaul-drawer-direction=bottom]:h-[min(580px,calc(100dvh-1rem))]! data-[vaul-drawer-direction=bottom]:max-h-[min(580px,calc(100dvh-1rem))]! data-[vaul-drawer-direction=bottom]:min-h-[min(580px,calc(100dvh-1rem))]";

/** Advanced settings modal — Figma `18228:57852` (Master Modal on Create). */
export const GENERATE_ADVANCED_SETTINGS_TITLE = "Advanced settings";

export const GENERATE_ADVANCED_SETTINGS_TITLE_ICON_SRC = "/assets/settings-outline.svg";

export const GENERATE_ADVANCED_SETTINGS_APPLY_LABEL = "Apply";

export const GENERATE_ADVANCED_SETTINGS_CANCEL_LABEL = "Cancel";

export const GENERATE_ADVANCED_SETTINGS_STYLE_LABEL = "Style:";

/** Video advanced settings model field — Figma `18228:112150`. */
export const GENERATE_ADVANCED_SETTINGS_MODEL_LABEL = "Model:";

export const GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL = "Aspect ratio:";

/** Aspect ratio picker modal — Figma `18190:75365` (Master Modal on Create). */
export const GENERATE_ASPECT_RATIO_MODAL_TITLE = "Aspect ratio";

/** Style picker modal — Figma `18228:110781` (Master Modal on Create). */
export const GENERATE_STYLE_MODAL_TITLE = "Select Style";

export const GENERATE_GENERATIONS_MODAL_TITLE = "Number of generations";

export const GENERATE_AUTO_SKIP_MODAL_TITLE = "Auto skip queue";

export const GENERATE_DURATION_MODAL_TITLE = "Duration";

export const GENERATE_RESOLUTION_MODAL_TITLE = "Resolution";

export const GENERATE_ADVANCED_SETTINGS_GENERATIONS_LABEL = "Number of generations:";

export const GENERATE_ADVANCED_SETTINGS_DURATION_LABEL = "Duration:";

export const GENERATE_ADVANCED_SETTINGS_RESOLUTION_LABEL = "Resolution:";

export const GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_LABEL = "Auto skip queue";

export const GENERATE_ADVANCED_SETTINGS_STYLE_ICON_SRC = "/assets/klam-ai.svg";

export const GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC = "/assets/ratio.svg";

export const GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC = "/assets/layer.svg";

export const GENERATE_ADVANCED_SETTINGS_DURATION_ICON_SRC = "/assets/clock.svg";

export const GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC = "/assets/video-horizontal.svg";

export const GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC = "/assets/flash.svg";

export const GENERATE_STYLE_TABS = [
  { id: "realistic", label: "Realistic" },
  { id: "anime", label: "Anime" },
] as const;

export type GenerateStyleTabId = (typeof GENERATE_STYLE_TABS)[number]["id"];

export type GenerateStyleMode = "create" | "edit-image" | "video";

export type GenerateStyleOption = {
  value: string;
  label: string;
  description: string;
  tabs?: readonly GenerateStyleTabId[];
  tokenCost: string;
  checkpointVariant: CheckpointThumbnailVariant;
  showUnlimitedBadge?: boolean;
};

export const GENERATE_STYLE_OPTIONS: readonly GenerateStyleOption[] = [
  {
    value: "klams-one",
    label: "Klams One",
    description: "Klams AI's Ultra-realistic porn photorealism",
    tabs: ["realistic"],
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
  },
  {
    value: "klams-turbo",
    label: "Klams Turbo",
    description: "Ultra-fast lightweight Klams One",
    tabs: ["realistic"],
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
  },
  {
    value: "oh",
    label: "OH",
    description: "Upscaled high-quality porn generation",
    tabs: ["realistic"],
    tokenCost: "25",
    checkpointVariant: "oh-ai",
    showUnlimitedBadge: false,
  },
  {
    value: "prism",
    label: "Prism",
    description: "Sharp detail, wide style range",
    tabs: ["realistic"],
    tokenCost: "20",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
  },
  {
    value: "z-image",
    label: "Z-Image",
    description: "Top tier nudity + perfect prompt following",
    tabs: ["realistic"],
    tokenCost: "3",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
  },
  {
    value: "z-image-turbo",
    label: "Z-Image Turbo",
    description: "Ultra-fast lightweight Z-image",
    tabs: ["realistic"],
    tokenCost: "2",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
  },
  {
    value: "illustrious",
    label: "Illustrious",
    description: "Semi realistic model",
    tabs: ["realistic"],
    tokenCost: "2",
    checkpointVariant: "illustrious",
    showUnlimitedBadge: true,
  },
  {
    value: "pony",
    label: "Pony",
    description: "Semi realistic model",
    tabs: ["realistic"],
    tokenCost: "2",
    checkpointVariant: "pony",
    showUnlimitedBadge: true,
  },
  {
    value: "sdxl",
    label: "SDXL",
    description: "Legacy NSFW SDXL checkpoint",
    tabs: ["realistic"],
    tokenCost: "2",
    checkpointVariant: "stability",
    showUnlimitedBadge: true,
  },
  {
    value: "illustrious-hentai",
    label: "Illustrious Hentai",
    description: "Anime hentai image generation",
    tabs: ["anime"],
    tokenCost: "2",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
  },
  {
    value: "pony-3d",
    label: "Pony 3D",
    description: "3D version of Hentai Pony",
    tabs: ["anime"],
    tokenCost: "2",
    checkpointVariant: "pony",
    showUnlimitedBadge: true,
  },
  {
    value: "pony-cartoon",
    label: "Pony Cartoon",
    description: "cartoon version of Hentai Pony",
    tabs: ["anime"],
    tokenCost: "2",
    checkpointVariant: "pony",
    showUnlimitedBadge: true,
  },
  {
    value: "sdxl-hentai",
    label: "SDXL",
    description: "Legacy Hentai SDXL checkpoint",
    tabs: ["anime"],
    tokenCost: "2",
    checkpointVariant: "stability",
    showUnlimitedBadge: true,
  },
];

/** Edit image style picker — Figma `18228:111586` (Image model). */
export const GENERATE_EDIT_IMAGE_STYLE_GROUP_LABEL = "Image model";

export const GENERATE_EDIT_IMAGE_STYLE_OPTIONS: readonly GenerateStyleOption[] = [
  {
    value: "z-image-edit",
    label: "Z-Image Edit",
    description: "Fast realistic uncensored editing.",
    tokenCost: "4",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
  },
  {
    value: "seedream",
    label: "Seedream",
    description: "Powerful image-to-image editing.",
    tokenCost: "7",
    checkpointVariant: "byte-dance",
    showUnlimitedBadge: false,
  },
];

export const GENERATE_EDIT_IMAGE_STYLE_DEFAULT = GENERATE_EDIT_IMAGE_STYLE_OPTIONS[0]?.value ?? "";

/** Video model picker — Figma `18228:112797`. */
export const GENERATE_VIDEO_STYLE_GROUP_LABEL = "Video model";

export const GENERATE_VIDEO_REALISTIC_STYLE_OPTIONS: readonly GenerateStyleOption[] = [
  {
    value: "klams-turbo",
    label: "Klams Turbo",
    description: "Fastest high-quality porn generation.",
    tabs: ["realistic"],
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
  },
  {
    value: "wan-2-7",
    label: "WAN 2.7",
    description: "Best for realistic female-male porn.",
    tabs: ["realistic"],
    tokenCost: "12",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
  },
  {
    value: "wan-2-2",
    label: "WAN 2.2",
    description: "Best for realistic female-male porn.",
    tabs: ["realistic"],
    tokenCost: "20",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: false,
  },
  {
    value: "seedance-1-5-pro",
    label: "Seedance 1.5 pro",
    description: "Audio-led videos with perfect sync.",
    tabs: ["realistic"],
    tokenCost: "20",
    checkpointVariant: "byte-dance",
    showUnlimitedBadge: false,
  },
  {
    value: "parrot-ai",
    label: "Parrot AI",
    description: "Audio-driven talking videos.",
    tabs: ["realistic"],
    tokenCost: "60",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
  },
];

/** Same names as Realistic for now; kept separate so Anime can diverge later. */
export const GENERATE_VIDEO_ANIME_STYLE_OPTIONS: readonly GenerateStyleOption[] = [
  {
    value: "klams-turbo-anime",
    label: "Klams Turbo",
    description: "Fastest high-quality porn generation.",
    tabs: ["anime"],
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
  },
  {
    value: "wan-2-7-anime",
    label: "WAN 2.7",
    description: "Best for realistic female-male porn.",
    tabs: ["anime"],
    tokenCost: "12",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
  },
  {
    value: "wan-2-2-anime",
    label: "WAN 2.2",
    description: "Best for realistic female-male porn.",
    tabs: ["anime"],
    tokenCost: "20",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: false,
  },
  {
    value: "seedance-1-5-pro-anime",
    label: "Seedance 1.5 pro",
    description: "Audio-led videos with perfect sync.",
    tabs: ["anime"],
    tokenCost: "20",
    checkpointVariant: "byte-dance",
    showUnlimitedBadge: false,
  },
  {
    value: "parrot-ai-anime",
    label: "Parrot AI",
    description: "Audio-driven talking videos.",
    tabs: ["anime"],
    tokenCost: "60",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
  },
];

export const GENERATE_VIDEO_STYLE_OPTIONS: readonly GenerateStyleOption[] = [
  ...GENERATE_VIDEO_REALISTIC_STYLE_OPTIONS,
  ...GENERATE_VIDEO_ANIME_STYLE_OPTIONS,
];

export const GENERATE_VIDEO_STYLE_DEFAULT = "wan-2-7";

export function getGenerateStyleMode(media: PromptboxHybridMedia): GenerateStyleMode {
  if (media === "image-edit") return "edit-image";
  if (media.startsWith("video-")) return "video";
  return "create";
}

export function getGenerateStyleOptionsForMode(mode: GenerateStyleMode) {
  if (mode === "edit-image") return GENERATE_EDIT_IMAGE_STYLE_OPTIONS;
  if (mode === "video") return GENERATE_VIDEO_STYLE_OPTIONS;
  return GENERATE_STYLE_OPTIONS;
}

export function getGenerateStyleDropdownOptions(mode: GenerateStyleMode) {
  return getGenerateStyleOptionsForMode(mode).map(({ value, label }) => ({ value, label }));
}

export function getGenerateStyleDefault(mode: GenerateStyleMode) {
  if (mode === "edit-image") return GENERATE_EDIT_IMAGE_STYLE_DEFAULT;
  if (mode === "video") return GENERATE_VIDEO_STYLE_DEFAULT;
  return GENERATE_STYLE_OPTIONS[0]?.value ?? "";
}

export function clampGenerateStyle(value: string, mode: GenerateStyleMode) {
  const options = getGenerateStyleOptionsForMode(mode);
  return options.some((option) => option.value === value) ? value : getGenerateStyleDefault(mode);
}

export const GENERATE_ADVANCED_SETTINGS_STYLE_OPTIONS = getGenerateStyleDropdownOptions("create");

export function getGenerateStyleOptionsByTab(
  tab: GenerateStyleTabId,
  mode: GenerateStyleMode = "create",
) {
  return getGenerateStyleOptionsForMode(mode).filter((option) => option.tabs?.includes(tab));
}

export function getGenerateStyleTabForValue(
  value: string,
  mode: GenerateStyleMode = "create",
): GenerateStyleTabId {
  return (
    getGenerateStyleOptionsForMode(mode).find((option) => option.value === value)?.tabs?.[0] ??
    "realistic"
  );
}

export const GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
] as const;

export const GENERATE_ADVANCED_SETTINGS_GENERATIONS_OPTIONS = [
  { value: "2", label: "2" },
  { value: "4", label: "4" },
  { value: "8", label: "8" },
  { value: "12", label: "12" },
] as const;

export const GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

/** Video duration slider — Figma `18228:112122`. */
export const GENERATE_DURATION_MIN_SECONDS = 5;

export const GENERATE_DURATION_MAX_SECONDS = 300;

export function formatGenerateDuration(seconds: number) {
  return `${seconds}s`;
}

export function parseGenerateDurationSeconds(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return GENERATE_DURATION_MIN_SECONDS;
  }

  return Math.min(GENERATE_DURATION_MAX_SECONDS, Math.max(GENERATE_DURATION_MIN_SECONDS, parsed));
}

/** Video resolution list — Figma `18228:112096`. */
export const GENERATE_ADVANCED_SETTINGS_RESOLUTION_OPTIONS = [
  { value: "512p", label: "512p", tokenCost: "-2/s" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p", tokenCost: "+2/s" },
] as const;

export type GenerateAdvancedSettingsValues = {
  style: string;
  aspectRatio: string;
  generations: string;
  duration: string;
  resolution: string;
  autoSkipQueue: "yes" | "no";
};

export const GENERATE_ADVANCED_SETTINGS_ALL_FIELDS = [
  "style",
  "aspectRatio",
  "generations",
  "duration",
  "resolution",
  "autoSkipQueue",
] as const satisfies readonly (keyof GenerateAdvancedSettingsValues)[];

export type GenerateAdvancedSettingsField = (typeof GENERATE_ADVANCED_SETTINGS_ALL_FIELDS)[number];

export const GENERATE_ADVANCED_SETTINGS_FIELDS = [
  "style",
  "aspectRatio",
  "generations",
  "autoSkipQueue",
] as const satisfies readonly GenerateAdvancedSettingsField[];

/** Edit image only needs a style/model — Figma `18228:111586`. */
export const GENERATE_ADVANCED_SETTINGS_EDIT_IMAGE_FIELDS = [
  "style",
] as const satisfies readonly GenerateAdvancedSettingsField[];

/** Video settings — Figma `18228:112150` (Master Modal on Create / Videos). */
export const GENERATE_ADVANCED_SETTINGS_VIDEO_FIELDS = [
  "style",
  "aspectRatio",
  "duration",
  "resolution",
  "autoSkipQueue",
] as const satisfies readonly GenerateAdvancedSettingsField[];

export function getGenerateAdvancedSettingsFields(media: PromptboxHybridMedia) {
  if (media === "image-edit") return GENERATE_ADVANCED_SETTINGS_EDIT_IMAGE_FIELDS;
  if (media.startsWith("video-")) return GENERATE_ADVANCED_SETTINGS_VIDEO_FIELDS;
  return GENERATE_ADVANCED_SETTINGS_FIELDS;
}

export function getGenerateAdvancedSettingsStyleLabel(mode: GenerateStyleMode) {
  return mode === "video"
    ? GENERATE_ADVANCED_SETTINGS_MODEL_LABEL
    : GENERATE_ADVANCED_SETTINGS_STYLE_LABEL;
}

export const GENERATE_ADVANCED_SETTINGS_DEFAULTS: GenerateAdvancedSettingsValues = {
  style: "klams-one",
  aspectRatio: "16:9",
  generations: "2",
  duration: "5s",
  resolution: "720p",
  autoSkipQueue: "no",
};

export const GENERATE_DELETE_CONFIRM_TITLE = "Are you sure?";

export const GENERATE_DELETE_CONFIRM_DESCRIPTION =
  "Are you sure you want to delete these images? This action can’t be undone.";

export const GENERATE_DELETE_CANCEL_LABEL = "Cancel";

export function formatGenerateDeleteConfirmLabel(selectedCount: number) {
  const count = Math.max(0, selectedCount);
  const noun = count === 1 ? "image" : "images";
  return `Delete (${count}) ${noun}`;
}

export const GENERATE_SELECT_ICON = <SelectionFillIcon className="size-5 shrink-0" aria-hidden />;

export const GENERATE_PREVIEW_PROMPT = defaultMediaPreviewPrompt;
export const GENERATE_PREVIEW_METADATA = defaultMediaPreviewMetadata;
export const GENERATE_PREVIEW_MODEL_TITLE = "Eva Marina Petranova";
export const GENERATE_PREVIEW_MODEL_IMAGE = dummyImage(0);
export const GENERATE_PREVIEW_CREATE_VIDEO_LABEL = "Animate";

/**
 * Mock gallery library for the generate screen.
 * - Every 3rd item is treated as NSFW (for blur toggle).
 * - Every 5th item is a video so the Videos tab has content.
 */
export const MEDIA_ITEMS: GenerateGalleryItem[] = defaultMediaPreviewItems.map((item, index) => {
  const kind = index % 5 === 0 ? "video" : "image";
  return {
    ...item,
    kind,
    isNsfw: index % 3 === 0,
    prompt: item.alt ?? `Generated ${kind} ${index + 1}`,
  };
});

export function filterGenerateGalleryBySection(
  items: GenerateGalleryItem[],
  sectionTabId: GenerateSectionTabId,
) {
  if (sectionTabId === "images") {
    return items.filter((item) => item.kind === "image");
  }
  if (sectionTabId === "videos") {
    return items.filter((item) => item.kind === "video");
  }
  return items;
}

export function filterGenerateGalleryByQuery(items: GenerateGalleryItem[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => {
    const haystack =
      `${item.prompt ?? ""} ${item.alt ?? ""} ${item.description ?? ""}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

/** Figma empty state (node 18196:35763) — shown when the gallery has no media. */
export const GENERATE_EMPTY_STATE_TITLE = "No media generated yet";
export const GENERATE_EMPTY_STATE_DESCRIPTION = "Your AI hasn't created any images or videos yet.";
export const GENERATE_EMPTY_STATE_CTA_LABEL = "Create for Free";
export const GENERATE_EMPTY_STATE_CTA_BADGE = "+10";

export const GENERATE_NO_RESULTS_TITLE = "No results found";
export const GENERATE_NO_RESULTS_DESCRIPTION =
  "Try a different prompt search or clear the search to see all media.";

export const GENERATE_SECTION_EMPTY_TITLE = "Nothing here yet";
export const GENERATE_SECTION_EMPTY_DESCRIPTION =
  "No media in this section. Switch tabs or generate something new.";

/**
 * Side-by-side workspace (promptbox + gallery) needs room for the 360px promptbox
 * plus at least a 3-column gallery at ~185px cards. Below this, use mobile layout.
 */
export const GENERATE_DESKTOP_BREAKPOINT = 768;

export const GENERATE_WORKSPACE_CLASS =
  "relative flex w-full min-h-0 flex-1 flex-col gap-4 min-[768px]:flex-row min-[768px]:items-stretch min-[768px]:overflow-hidden";

/** Figma empty gallery is top-aligned so Frame 24 sits directly under it. */
export const GENERATE_GALLERY_EMPTY_CLASS = "flex w-full flex-1 items-center justify-center";

/** Shared with the header so the search row matches the gallery column width. */
export const GENERATE_LEFT_COLUMN_CLASS = "w-full shrink-0 min-[768px]:max-w-[360px]";

/** Gallery columns track available width so cards stay near ~185px: 5 → 4 → 3 → 2, then 6 from 1920px. */
export const GENERATE_GALLERY_GRID_CLASS =
  "grid grid-cols-2 gap-2! @min-[560px]/gallery:grid-cols-3 @min-[760px]/gallery:grid-cols-4 @min-[760px]/gallery:gap-2! @min-[960px]/gallery:grid-cols-5 min-[1920px]:!grid-cols-6";

export const GENERATE_TOOLBAR_TOGGLE_CLASS =
  "inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 text-sm leading-5 font-medium transition-colors focus-visible:ring-brand-primary outline-none focus-visible:ring-2";

export const GENERATE_ADD_AUDIO_MODAL_TITLE = "Add audio";

/** Mobile voice picker — Figma `18190:75401` / `18190:75640`. */
export const GENERATE_ADD_AUDIO_VOICE_LABEL = "Voice:";

export const GENERATE_ADD_AUDIO_VOICE_MODAL_TITLE = "Select a voice";

export const GENERATE_ADD_AUDIO_SCRIPT_LABEL = "Script";

export const GENERATE_ADD_AUDIO_SCRIPT_PLACEHOLDER = "Type what you want your character to say...";

export const GENERATE_ADD_AUDIO_SCRIPT_COST = "7";

export const GENERATE_ADD_AUDIO_SCRIPT_COST_SUFFIX = "/sec";

export const GENERATE_ADD_AUDIO_GENERATE_LABEL = "Generate";

export const GENERATE_ADD_AUDIO_SAVE_LABEL = "Save";

export const GENERATE_ADD_AUDIO_EDIT_LABEL = "Edit";

export const GENERATE_ADD_AUDIO_DELETE_LABEL = "Delete";

export const GENERATE_ADD_AUDIO_GENERATED_LABEL = "Your Audio";

export const GENERATE_ADD_AUDIO_GENERATED_DURATION_SECONDS = 10;

export type GenerateAddAudioOption = {
  id: string;
  label: string;
  audioSrc: string;
};

export type GenerateAddAudioGeneratePayload = {
  audio?: GenerateAddAudioOption;
  script: string;
};

export type GenerateAddAudioCategory = {
  id: string;
  label: string;
  options: readonly GenerateAddAudioOption[];
};

/** Figma 18190:75646 — two Category A groups of selectable audio-msg tracks. */
export const GENERATE_ADD_AUDIO_CATEGORIES: readonly GenerateAddAudioCategory[] = [
  {
    id: "category-a-1",
    label: "Category A",
    options: [
      { id: "calm", label: "Calm", audioSrc: "/assets/sounds/italian.mp3" },
      { id: "excited", label: "Excited", audioSrc: "/assets/sounds/french.mp3" },
      { id: "adventurous", label: "Adventurous", audioSrc: "/assets/sounds/spanish.mp3" },
    ],
  },
  {
    id: "category-a-2",
    label: "Category A",
    options: [
      { id: "angry", label: "Angry", audioSrc: "/assets/sounds/argentina.mp3" },
      { id: "joyful", label: "Joyful", audioSrc: "/assets/sounds/swedish.mp3" },
      { id: "fearful", label: "Fearful", audioSrc: "/assets/sounds/file_audio.wav" },
    ],
  },
];

export function isGenerateAudioPlaceholder(slotTitle: string | undefined) {
  return slotTitle?.trim().toLowerCase() === "audio";
}

export function findGenerateAddAudioOption(audioId: string | undefined) {
  if (!audioId) return undefined;

  for (const category of GENERATE_ADD_AUDIO_CATEGORIES) {
    const option = category.options.find((entry) => entry.id === audioId);
    if (option) return option;
  }

  return undefined;
}

export function getDefaultGenerateAddAudioOption() {
  return GENERATE_ADD_AUDIO_CATEGORIES[0]?.options[0];
}

/** Figma `18190:75653` / `18190:75407` — duration + voice under the generated clip. */
export function formatGenerateAddAudioGeneratedMeta(seconds: number, voiceLabel?: string) {
  const durationLabel = `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  return voiceLabel ? `${durationLabel} - ${voiceLabel}` : durationLabel;
}

/**
 * Pick the ChooseTemplate type tab from the clicked placeholder slot first
 * (e.g. Character → Characters). Otherwise use the generate section
 * (Images / Videos), then fall back to prompt media.
 */
export function getGenerateChooseTemplateTypeTab(
  slotTitle: string | undefined,
  media: PromptboxHybridMedia,
  sectionTabId: GenerateSectionTabId = GENERATE_DEFAULT_SECTION_TAB_ID,
) {
  const title = slotTitle?.trim().toLowerCase() ?? "";

  if (title.includes("character")) {
    return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.characters;
  }
  if (title.includes("video")) {
    return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.videos;
  }
  if (title.includes("image")) {
    return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.images;
  }

  if (sectionTabId === "images") {
    return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.images;
  }
  if (sectionTabId === "videos") {
    return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.videos;
  }

  return media.startsWith("video-")
    ? GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.videos
    : GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.images;
}

/** Modal title from the clicked placeholder slot, e.g. Clothing → "Select clothing". */
export function getGenerateChooseTemplateTitle(slotTitle: string | undefined) {
  const title = slotTitle?.trim();
  if (!title) return "Select a template";
  return `Select ${title.toLowerCase()}`;
}

export function getGeneratePlaceholderSelectionKey(
  media: PromptboxHybridMedia,
  placeholderIndex: number,
) {
  return `${media}:${placeholderIndex}`;
}

/** Gallery card shown while a generation request is in flight (Figma 21730:52500). */
export type GenerateProcessingItem = {
  id: string;
  kind: "image" | "video";
  state: PlaceholderProcessingState;
  /** 0–100 while `state === "generating"`. */
  progressPercent?: number;
  prompt?: string;
  /** Mock outcome flag used when retrying / skipping the queue. */
  willFail?: boolean;
};

export const GENERATE_PROCESSING_CARD_CLASS =
  "aspect-3/4! h-auto! w-full! max-w-none! rounded-[24px]!";

/** Mock stage timings until the generation API is wired.
 * Order: Queue → Processing → Generating → Result.
 */
export const GENERATE_STAGE_QUEUING_MS = 6000;
export const GENERATE_STAGE_PROCESSING_MS = 4000;
export const GENERATE_STAGE_GENERATING_MS = 3000;
export const GENERATE_STAGE_PROGRESS_TICK_MS = 120;

export function getGenerateProcessingKind(
  sectionTabId: GenerateSectionTabId,
  media: PromptboxHybridMedia,
): GenerateProcessingItem["kind"] {
  if (sectionTabId === "videos" || media.startsWith("video-")) {
    return "video";
  }
  return "image";
}

export function filterGenerateProcessingBySection(
  items: GenerateProcessingItem[],
  sectionTabId: GenerateSectionTabId,
) {
  if (sectionTabId === "images") {
    return items.filter((item) => item.kind === "image");
  }
  if (sectionTabId === "videos") {
    return items.filter((item) => item.kind === "video");
  }
  return items;
}

export function createGenerateResultItem(
  id: string,
  kind: GenerateProcessingItem["kind"],
  prompt?: string,
): GenerateGalleryItem {
  const numeric = Number(id.replace(/\D/g, "")) || 0;
  const seed = MEDIA_ITEMS[numeric % MEDIA_ITEMS.length] ?? MEDIA_ITEMS[0];
  return {
    id,
    src: seed?.src ?? "",
    alt: prompt?.trim() || seed?.alt || `Generated ${kind}`,
    description: seed?.description,
    kind,
    isNsfw: false,
    prompt: prompt?.trim() || seed?.prompt || `Generated ${kind}`,
  };
}
