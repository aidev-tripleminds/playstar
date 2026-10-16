import { resolveAsset } from "@/lib/assets/asset-store";

import type {
  PromptBoxActionItem,
  PromptBoxCheckpointOption,
  PromptBoxControlButton,
  PromptBoxMedia,
  PromptBoxPlaceholderSlot,
} from "./prompt-box.types";

export const PROMPT_BOX_DEFAULT_PLACEHOLDER_TEXT = "Enter your prompt here...";

export const PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL = "Klams AI";

export const PROMPT_BOX_CHECKPOINT_IMAGE_DROPDOWN_TITLE = "Image model";

export const PROMPT_BOX_CHECKPOINT_VIDEO_DROPDOWN_TITLE = "Video model";

export const PROMPT_BOX_CHECKPOINT_IMAGE_MODAL_TITLE = "Select an AI image model";

export const PROMPT_BOX_CHECKPOINT_VIDEO_MODAL_TITLE = "Select an AI video model";

/** Image models — Klams Video, WAN, Seedance, Parrot AI. */
export const PROMPT_BOX_CHECKPOINT_IMAGE_OPTIONS: readonly PromptBoxCheckpointOption[] = [
  {
    value: "klams-video",
    label: "Klams Video",
    description: "Fastest high-quality porn generation.",
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
    premium: false,
  },
  {
    value: "wan-2-7",
    label: "WAN 2.7",
    description: "Best for realistic female-male porn.",
    tokenCost: "12",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
    premium: true,
  },
  {
    value: "wan-2-2",
    label: "WAN 2.2",
    description: "Best for realistic female-male porn.",
    tokenCost: "20",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: false,
    premium: true,
  },
  {
    value: "seedance-1-5-pro",
    label: "Seedance 1.5 pro",
    description: "Audio-led videos with perfect sync.",
    tokenCost: "20",
    checkpointVariant: "byte-dance",
    showUnlimitedBadge: false,
    premium: true,
  },
  {
    value: "parrot-ai",
    label: "Parrot AI",
    description: "Audio-driven talking videos.",
    tokenCost: "60",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
    premium: true,
  },
];

/** Video models — Klams AI, LGBTQ, Turbo, Z-Image, Parrot AI, Pony, SDXL. */
export const PROMPT_BOX_CHECKPOINT_VIDEO_OPTIONS: readonly PromptBoxCheckpointOption[] = [
  {
    value: "klams-ai",
    label: "Klams AI",
    description: "Ultra-realistic porn photorealism.",
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
    premium: false,
  },
  {
    value: "klams-lgbtq",
    label: "Klams LGBTQ",
    description: "Best for trans, gay and lesbian content.",
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
    premium: true,
  },
  {
    value: "klams-turbo",
    label: "Klams Turbo",
    description: "Fastest high-quality porn generation.",
    tokenCost: "3",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
    premium: true,
  },
  {
    value: "z-image",
    label: "Z-Image",
    description: "Top tier nudity + perfect prompt following.",
    tokenCost: "3",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
    premium: true,
  },
  {
    value: "z-image-turbo",
    label: "Z-Image Turbo",
    description: "Ultra-fast uncensored realism.",
    tokenCost: "3",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
    premium: true,
  },
  {
    value: "parrot-ai",
    label: "Parrot AI",
    description: "Unrestricted NSFW images, no filters.",
    tokenCost: "7",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
    premium: true,
  },
  {
    value: "pony",
    label: "Pony",
    description: "Top hentai AI for anime NSFW.",
    tokenCost: "2",
    checkpointVariant: "pony",
    showUnlimitedBadge: true,
    premium: true,
  },
  {
    value: "sdxl",
    label: "SDXL",
    description: "Legacy NSFW SDXL base.",
    tokenCost: "2",
    checkpointVariant: "stability",
    showUnlimitedBadge: true,
    premium: true,
  },
];

export const PROMPT_BOX_CHECKPOINT_OPTIONS = PROMPT_BOX_CHECKPOINT_IMAGE_OPTIONS;

export const PROMPT_BOX_CHECKPOINT_IMAGE_DEFAULT_VALUE =
  PROMPT_BOX_CHECKPOINT_IMAGE_OPTIONS[0]?.value ?? "klams-video";

export const PROMPT_BOX_CHECKPOINT_VIDEO_DEFAULT_VALUE =
  PROMPT_BOX_CHECKPOINT_VIDEO_OPTIONS[0]?.value ?? "klams-ai";

export const PROMPT_BOX_CHECKPOINT_DEFAULT_VALUE = PROMPT_BOX_CHECKPOINT_IMAGE_DEFAULT_VALUE;

export function getPromptBoxCheckpointOptions(media: PromptBoxMedia) {
  return media.startsWith("video-")
    ? PROMPT_BOX_CHECKPOINT_VIDEO_OPTIONS
    : PROMPT_BOX_CHECKPOINT_IMAGE_OPTIONS;
}

export function getPromptBoxCheckpointDefaultValue(media: PromptBoxMedia) {
  return (
    getPromptBoxCheckpointOptions(media)[0]?.value ??
    (media.startsWith("video-") ? "klams-ai" : "klams-video")
  );
}

export function isPromptBoxCheckpointPremium(
  value: string,
  options: readonly PromptBoxCheckpointOption[] = PROMPT_BOX_CHECKPOINT_OPTIONS,
) {
  return options.find((option) => option.value === value)?.premium === true;
}

export function getPromptBoxCheckpointTriggerLabel(
  value: string,
  options: readonly PromptBoxCheckpointOption[] = PROMPT_BOX_CHECKPOINT_OPTIONS,
  fallbackLabel = PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL,
) {
  const selected = options.find((option) => option.value === value);
  const defaultValue = options[0]?.value;

  if (!selected || selected.value === defaultValue) {
    return fallbackLabel;
  }

  return selected.label;
}

export function getPromptBoxCheckpointDropdownTitle(media: PromptBoxMedia) {
  return media.startsWith("video-")
    ? PROMPT_BOX_CHECKPOINT_VIDEO_DROPDOWN_TITLE
    : PROMPT_BOX_CHECKPOINT_IMAGE_DROPDOWN_TITLE;
}

export function getPromptBoxCheckpointModalTitle(media: PromptBoxMedia) {
  return media.startsWith("video-")
    ? PROMPT_BOX_CHECKPOINT_VIDEO_MODAL_TITLE
    : PROMPT_BOX_CHECKPOINT_IMAGE_MODAL_TITLE;
}

export const PROMPT_BOX_DEFAULT_TOKEN_COST = "3";

export const PROMPT_BOX_FREE_LABEL = "FREE";

export const PROMPT_BOX_UPGRADE_LABEL = "Upgrade";

export const PROMPT_BOX_TOKEN_ICON_SRC = "/assets/spice-coin.png";

export const PROMPT_BOX_CROWN_ICON_SRC = "/assets/crown-filled.svg";

export const PROMPT_BOX_CHECKPOINT_ICON_SRC = "/assets/klam-ai.svg";

export const PROMPT_BOX_SETTINGS_ICON_SRC = "/assets/settings-outline.svg";

export const PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL = "Text to Image";

export const PROMPT_BOX_TEXT_TO_VIDEO_CONTROL_LABEL = "Text to Video";

/** @deprecated Use {@link PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL}. */
export const PROMPT_BOX_PRESETS_CONTROL_LABEL = PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL;

export const PROMPT_BOX_EDIT_IMAGE_CONTROL_LABEL = "Edit image";

export const PROMPT_BOX_EDIT_VIDEO_CONTROL_LABEL = "Edit Video";

/** Figma `16256:110045` desktop dropdown / `16256:109129` mobile modal. */
export const PROMPT_BOX_IMAGE_MODE_DROPDOWN_TITLE = "Select image mode";

export const PROMPT_BOX_IMAGE_MODE_MODAL_TITLE = "Select image mode";

export const PROMPT_BOX_IMAGE_MODE_MODAL_ICON_SRC = "/assets/gallery.svg";

export const PROMPT_BOX_IMAGE_MODE_PRESETS_ICON_SRC = "/assets/icons/magic-pen.svg";

export const PROMPT_BOX_IMAGE_MODE_EDIT_ICON_SRC = "/assets/edit-v2.svg";

export const PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE = "image-presets";

export const PROMPT_BOX_IMAGE_MODE_OPTIONS = [
  {
    value: "image-presets",
    label: PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL,
    description: "Create stunning images from text.",
    iconSrc: PROMPT_BOX_IMAGE_MODE_PRESETS_ICON_SRC,
  },
  {
    value: "image-edit",
    label: PROMPT_BOX_EDIT_IMAGE_CONTROL_LABEL,
    description: "Transform images with AI-powered editing.",
    iconSrc: PROMPT_BOX_IMAGE_MODE_EDIT_ICON_SRC,
  },
] as const;

export const PROMPT_BOX_IMAGE_MODE_MODAL_DESCRIPTION = "Choose an image generation mode.";

export const PROMPT_BOX_VIDEO_MODE_DEFAULT_VALUE = "video-presets";

/** Figma `16256:109459` desktop dropdown. */
export const PROMPT_BOX_VIDEO_MODE_DROPDOWN_TITLE = "Select video mode";

export const PROMPT_BOX_VIDEO_MODE_MODAL_TITLE = "Select video mode";

export const PROMPT_BOX_VIDEO_MODE_MODAL_ICON_SRC = "/assets/video-square.svg";

export const PROMPT_BOX_VIDEO_MODE_MODAL_DESCRIPTION = "Choose a video generation mode.";

export const PROMPT_BOX_VIDEO_MODE_IMAGE_TO_VIDEO_LABEL = "Image to Video";

export const PROMPT_BOX_VIDEO_MODE_EXTEND_LABEL = "Extend Video";

export const PROMPT_BOX_VIDEO_MODE_AUDIO_TO_VIDEO_LABEL = "Audio to Video";

export const PROMPT_BOX_VIDEO_MODE_IMAGE_TO_VIDEO_ICON_SRC = "/assets/gallery.svg";

export const PROMPT_BOX_VIDEO_MODE_EXTEND_ICON_SRC = "/assets/video-horizontal.svg";

export const PROMPT_BOX_VIDEO_MODE_AUDIO_TO_VIDEO_ICON_SRC = "/assets/microphone.svg";

export const PROMPT_BOX_VIDEO_MODE_EDIT_ICON_SRC = PROMPT_BOX_IMAGE_MODE_EDIT_ICON_SRC;

export const PROMPT_BOX_VIDEO_MODE_OPTIONS = [
  {
    value: "video-presets",
    label: PROMPT_BOX_TEXT_TO_VIDEO_CONTROL_LABEL,
    description: "This is a description for Text to Video.",
    iconSrc: PROMPT_BOX_IMAGE_MODE_PRESETS_ICON_SRC,
  },
  {
    value: "video-image2vid",
    label: PROMPT_BOX_VIDEO_MODE_IMAGE_TO_VIDEO_LABEL,
    description: "This is a description for Image to Video.",
    iconSrc: PROMPT_BOX_VIDEO_MODE_IMAGE_TO_VIDEO_ICON_SRC,
  },
  {
    value: "video-extend",
    label: PROMPT_BOX_VIDEO_MODE_EXTEND_LABEL,
    description: "This is a description for Extend Video.",
    iconSrc: PROMPT_BOX_VIDEO_MODE_EXTEND_ICON_SRC,
  },
  {
    value: "video-edit",
    label: PROMPT_BOX_EDIT_VIDEO_CONTROL_LABEL,
    description: "This is a description for Edit Video.",
    iconSrc: PROMPT_BOX_VIDEO_MODE_EDIT_ICON_SRC,
  },
] as const;

export function isPromptBoxVideoMedia(media: PromptBoxMedia) {
  return media.startsWith("video-");
}

export function getPromptBoxModePickerConfig(media: PromptBoxMedia) {
  if (isPromptBoxVideoMedia(media)) {
    return {
      options: PROMPT_BOX_VIDEO_MODE_OPTIONS,
      defaultValue: PROMPT_BOX_VIDEO_MODE_DEFAULT_VALUE,
      dropdownTitle: PROMPT_BOX_VIDEO_MODE_DROPDOWN_TITLE,
      modalTitle: PROMPT_BOX_VIDEO_MODE_MODAL_TITLE,
      modalIconSrc: PROMPT_BOX_VIDEO_MODE_MODAL_ICON_SRC,
      modalDescription: PROMPT_BOX_VIDEO_MODE_MODAL_DESCRIPTION,
    };
  }

  return {
    options: PROMPT_BOX_IMAGE_MODE_OPTIONS,
    defaultValue: PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
    dropdownTitle: PROMPT_BOX_IMAGE_MODE_DROPDOWN_TITLE,
    modalTitle: PROMPT_BOX_IMAGE_MODE_MODAL_TITLE,
    modalIconSrc: PROMPT_BOX_IMAGE_MODE_MODAL_ICON_SRC,
    modalDescription: PROMPT_BOX_IMAGE_MODE_MODAL_DESCRIPTION,
  };
}

export const PROMPT_BOX_DESKTOP_MAX_WIDTH_CLASS = "max-w-[750px]";

export const PROMPT_BOX_COMPACT_MAX_WIDTH_CLASS = "max-w-[358px] md:max-w-[750px]";

/** Named container so layout follows the prompt box width, not the viewport. */
export const PROMPT_BOX_CONTAINER_CLASS =
  "@container/prompt-box flex w-full flex-col gap-3 min-[768px]:min-h-0 min-[768px]:max-h-full";

/**
 * Prompt-box chrome and picker menus share this width. Container queries hide
 * Klams AI below it; picker dropdowns open from the same point so 640–767px
 * is not a dead zone.
 */
export const PROMPT_BOX_DESKTOP_MIN_WIDTH = 640;

/** Desktop chrome when the prompt box is at least 640px wide. */
export const PROMPT_BOX_SHOW_FROM_DESKTOP_FLEX_CLASS = "hidden @min-[640px]/prompt-box:inline-flex";

export const PROMPT_BOX_SHOW_FROM_DESKTOP_BLOCK_CLASS = "hidden @min-[640px]/prompt-box:block";

export const PROMPT_BOX_SHOW_UNTIL_DESKTOP_CLASS = "@min-[640px]/prompt-box:hidden";

export const PROMPT_BOX_SHELL_CLASS =
  "relative flex w-full flex-col overflow-visible rounded-[32px] bg-[#171717] p-3 shadow-[0px_6px_20px_rgba(0,0,0,0.35)] min-[768px]:min-h-0 min-[768px]:max-h-full";

/**
 * Mobile sources are a 4-column grid so card width is always 1/4 of the row,
 * even when only 1–3 items render. ~1/3 of the card hangs above the shell.
 * Desktop stays a left-aligned flex row of fixed 73×96 cards.
 */
export const PROMPT_BOX_SOURCES_ABSOLUTE_CLASS =
  "absolute z-10 grid w-full max-w-full min-w-0 grid-cols-4 items-end gap-1.5 left-0 -top-[32px] @max-[639px]/prompt-box:!top-0 @max-[639px]/prompt-box:-translate-y-1/3 @min-[640px]/prompt-box:flex @min-[640px]/prompt-box:w-auto @min-[640px]/prompt-box:translate-y-0 @min-[640px]/prompt-box:justify-start";

/**
 * Inside-shell space for the lower portion of absolutely positioned cards.
 * Mobile padding-bottom is 2/3 of a 4-col 69/80 card (`1.125rem` = 3 × `gap-1.5`).
 * Desktop stays 64px (2/3 of 96).
 */
export const PROMPT_BOX_SOURCES_SPACER_CLASS =
  "flex h-[64px] w-full shrink-0 justify-center @max-[639px]/prompt-box:h-auto @max-[639px]/prompt-box:pb-[calc((100%-1.125rem)/4*80/69*2/3)] @min-[640px]/prompt-box:pb-0 @min-[640px]/prompt-box:justify-end";

/**
 * Source cards and the pill are siblings. 12px gap and the pill's own 12px
 * padding match Figma `16127:36747` / `24345:121413`.
 */
export const PROMPT_BOX_SCROLL_COMPACT_SHELL_CLASS =
  "relative flex w-full flex-col gap-1.5 overflow-visible";

/**
 * Figma compact prompt controls: 80px radius, 12px padding.
 * Shadows/Promptbox is the 135° white sheen over #171717, Border/Light Inner
 * is the 1px fade, and Card shadows/Large card is the drop shadow.
 */
export const PROMPT_BOX_SCROLL_COMPACT_PILL_CLASS =
  "flex w-full min-w-0 items-center gap-2 rounded-[80px] border border-transparent p-3 shadow-[0px_6px_20px_rgba(0,0,0,0.35)] [background-image:linear-gradient(135deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.05)_100%),linear-gradient(#171717,#171717),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%)] [background-clip:padding-box,padding-box,border-box] [background-origin:padding-box,padding-box,border-box]";

/** In-flow source row above the pill. Extra 12px inset matches Figma `layout_FVLJ7S`. */
export const PROMPT_BOX_SCROLL_COMPACT_SOURCES_CLASS =
  "relative z-10 flex min-w-0 items-center gap-2 pl-3";

/**
 * `w-0` beats the button's min-content width, which otherwise lets the label
 * paint over the token badge. iOS Safari never paints `text-overflow` here,
 * so the ellipsis character is inserted into the string instead.
 */
export const PROMPT_BOX_SCROLL_COMPACT_PROMPT_CLASS =
  "w-0 min-w-0 flex-1 cursor-pointer overflow-hidden bg-transparent text-left text-sm leading-5 font-normal text-[#a3a3a3] outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

export const PROMPT_BOX_SCROLL_COMPACT_PROMPT_TEXT_CLASS =
  "block w-full overflow-hidden whitespace-nowrap";

export const PROMPT_BOX_EXPAND_LABEL = "Expand prompt";

/** 28px circle, 6px padding around the 16px maximize glyph (Figma `24345:121420`). */
export const PROMPT_BOX_EXPAND_BUTTON_CLASS =
  "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#262626] text-[#d4d4d4] outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

/** Audio compact occupies one 4-col cell on mobile; desktop shrinks to content. */
export const PROMPT_BOX_AUDIO_COMPACT_WRAP_CLASS =
  "relative flex w-full min-w-0 items-end aspect-[69/80] @min-[640px]/prompt-box:aspect-auto @min-[640px]/prompt-box:w-auto";

/**
 * Min-height matches one line (`leading-5`) so the prompt field's `items-center`
 * vertically centers the empty placeholder. Typed text on mobile adds a
 * two-line floor so a short viewport cannot squash the field to one line.
 * `flex-auto min-h-10` lets the field shrink when the dock hits its viewport
 * cap so only the textarea scrolls. Desktop caps at 12 lines (`15rem` = 12 ×
 * `leading-5`). The mobile cap never drops below those two lines.
 */
export const PROMPT_BOX_TEXTAREA_MAX_LINES_DESKTOP = 12;

export const PROMPT_BOX_PROMPT_FIELD_CLASS =
  "flex min-h-10 min-w-0 w-full flex-auto flex-wrap items-center gap-2 overflow-hidden";

/** Figma `23829:110821` Media=Locked — prefilled prompt + unlock CTA. */
export const PROMPT_BOX_UNLOCK_PROMPT_LABEL = "Get premium to unlock";

export const PROMPT_BOX_LOCKED_PROMPT_ROW_CLASS =
  "relative flex min-h-9 w-full min-w-0 items-center justify-center overflow-visible";

/** Padding + oversized inset let the 10px blur bleed instead of clipping. */
export const PROMPT_BOX_LOCKED_PROMPT_TEXT_CLASS =
  "pointer-events-none absolute -inset-3 flex items-center overflow-visible p-3 text-sm leading-5 font-normal text-[#d4d4d4] blur-[10px]";

export const PROMPT_BOX_LOCKED_PROMPT_TEXT_INNER_CLASS =
  "line-clamp-2 w-full [overflow-wrap:anywhere]";

export const PROMPT_BOX_UNLOCK_PROMPT_BUTTON_CLASS = "relative z-10 w-fit";

export const PROMPT_BOX_TEXTAREA_CLASS =
  "min-h-5 min-w-0 w-full resize-none overflow-y-auto overscroll-none scrollbar-hidden rounded-none border-0 bg-transparent p-0 shadow-none text-sm leading-5 font-normal [overflow-wrap:anywhere] text-tooltip-text placeholder:text-[#a3a3a3] focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none max-[767px]:max-h-[max(2.5rem,calc(100dvh-21.5rem))] max-[767px]:touch-pan-y min-[768px]:max-h-[15rem]";

export const PROMPT_BOX_ACTIONS_CLASS =
  "custom-scrollbar flex min-h-10 min-w-0 shrink-0 items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain scrollbar-hidden! touch-pan-x [&::-webkit-scrollbar]:h-1.5";

export const PROMPT_BOX_SEE_ALL_LABEL = "See all";

export const PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID = "custom-prompt";

export const PROMPT_BOX_CUSTOM_PROMPT_LABEL = "Custom prompt";

export const PROMPT_BOX_DEFAULT_IMAGE_PRESET_PLACEHOLDERS: PromptBoxPlaceholderSlot[] = [
  { title: "Character", subtitle: "Optional" },
  { title: "Action", subtitle: "Optional" },
  { title: "Clothing", subtitle: "Optional" },
  { title: "Location", subtitle: "Optional" },
];

export const PROMPT_BOX_DEFAULT_SPEECH2VID_PLACEHOLDERS: PromptBoxPlaceholderSlot[] = [
  { title: "Media", subtitle: "Required" },
  { title: "Audio", subtitle: "Required", kind: "audio" },
];

export const PROMPT_BOX_DEFAULT_IMAGE_EDIT_PLACEHOLDERS: PromptBoxPlaceholderSlot[] = [
  { title: "Image", subtitle: "Optional" },
];

export const PROMPT_BOX_DEFAULT_VIDEO_EDIT_PLACEHOLDERS: PromptBoxPlaceholderSlot[] = [
  { title: "Video", subtitle: "Optional" },
];

export function getPromptBoxDefaultPlaceholders(media: PromptBoxMedia): PromptBoxPlaceholderSlot[] {
  if (media === "video-speech2vid") return PROMPT_BOX_DEFAULT_SPEECH2VID_PLACEHOLDERS;
  if (media === "image-edit" || media === "video-image2vid") {
    return PROMPT_BOX_DEFAULT_IMAGE_EDIT_PLACEHOLDERS;
  }
  if (media === "video-extend" || media === "video-edit") {
    return PROMPT_BOX_DEFAULT_VIDEO_EDIT_PLACEHOLDERS;
  }
  return PROMPT_BOX_DEFAULT_IMAGE_PRESET_PLACEHOLDERS;
}

export function isPromptBoxAudioPlaceholder(slot: PromptBoxPlaceholderSlot) {
  return slot.kind === "audio";
}

export const PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION: PromptBoxActionItem = {
  id: PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID,
  variant: "premium",
  label: PROMPT_BOX_CUSTOM_PROMPT_LABEL,
};

export const PROMPT_BOX_DEFAULT_PRESET_ACTIONS: PromptBoxActionItem[] = [
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION,
  {
    id: "action-1",
    label: "Action1",
    imageSrc: resolveAsset("demo_pics_model9").image ?? "",
  },
  {
    id: "action-2",
    label: "Action2",
    imageSrc: resolveAsset("demo_pics_model3").image ?? "",
  },
  {
    id: "action-3",
    label: "Action3",
    imageSrc: resolveAsset("demo_pics_reso").image ?? "",
  },
];

export const PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTIONS: PromptBoxActionItem[] = [
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION,
];

const PRESET_ACTION_MEDIAS = new Set<PromptBoxMedia>(["image-presets", "video-presets"]);

export function getPromptBoxDefaultActions(media: PromptBoxMedia): PromptBoxActionItem[] {
  if (media === "compact") return [];
  if (PRESET_ACTION_MEDIAS.has(media)) return PROMPT_BOX_DEFAULT_PRESET_ACTIONS;
  return PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTIONS;
}

export const PROMPT_BOX_DEFAULT_MOBILE_CONTROL_BUTTONS: PromptBoxControlButton[] = [
  {
    kind: "image-mode",
    label: PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL,
    leftIconSrc: "/assets/icons/magic-pen.svg",
    menuLabel: PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL,
  },
];

export const PROMPT_BOX_ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
] as const;

export const PROMPT_BOX_DEFAULT_IMAGE_CONTROL_BUTTONS: PromptBoxControlButton[] = [
  {
    kind: "image-mode",
    label: PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL,
    leftIconSrc: "/assets/icons/magic-pen.svg",
    menuLabel: PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL,
  },
  {
    label: "16:9",
    leftIconSrc: "/assets/ratio.svg",
    defaultValue: "16:9",
    menuLabel: "Aspect ratio",
    options: [...PROMPT_BOX_ASPECT_RATIO_OPTIONS],
  },
  {
    label: "1",
    leftIconSrc: "/assets/layer.svg",
    menuLabel: "Batch count",
  },
];

/** Video resolution list — Figma `16140:78541`. */
export const PROMPT_BOX_RESOLUTION_OPTIONS = [
  { value: "512p", label: "512p", tokenCost: "-2/s" },
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p", tokenCost: "+2/s" },
] as const;

export const PROMPT_BOX_RESOLUTION_MENU_LABEL = "Resolution";

export const PROMPT_BOX_RESOLUTION_ICON_SRC = "/assets/video-camera.svg";

export const PROMPT_BOX_DURATION_OPTIONS = [
  { value: "5s", label: "5s" },
  { value: "8s", label: "8s" },
  { value: "10s", label: "10s" },
] as const;

export const PROMPT_BOX_DURATION_MIN_SECONDS = 5;

export const PROMPT_BOX_DURATION_MAX_SECONDS = 300;

export const PROMPT_BOX_DURATION_MENU_LABEL = "Duration";

export const PROMPT_BOX_DURATION_ICON_SRC = "/assets/clock.svg";

export function formatPromptBoxDuration(seconds: number) {
  return `${seconds}s`;
}

export function parsePromptBoxDurationSeconds(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return PROMPT_BOX_DURATION_MIN_SECONDS;
  }

  return Math.min(
    PROMPT_BOX_DURATION_MAX_SECONDS,
    Math.max(PROMPT_BOX_DURATION_MIN_SECONDS, parsed),
  );
}

export const PROMPT_BOX_DEFAULT_RESOLUTION = "1080p";

export const PROMPT_BOX_DEFAULT_DURATION = "8s";

export const PROMPT_BOX_DEFAULT_VIDEO_CONTROL_BUTTONS: PromptBoxControlButton[] = [
  {
    kind: "image-mode",
    label: PROMPT_BOX_TEXT_TO_VIDEO_CONTROL_LABEL,
    leftIconSrc: "/assets/icons/magic-pen.svg",
    menuLabel: PROMPT_BOX_TEXT_TO_VIDEO_CONTROL_LABEL,
  },
  {
    label: "4:3",
    leftIconSrc: "/assets/ratio.svg",
    defaultValue: "4:3",
    menuLabel: "Aspect ratio",
    options: [...PROMPT_BOX_ASPECT_RATIO_OPTIONS],
  },
  {
    kind: "resolution",
    label: PROMPT_BOX_DEFAULT_RESOLUTION,
    leftIconSrc: PROMPT_BOX_RESOLUTION_ICON_SRC,
    defaultValue: PROMPT_BOX_DEFAULT_RESOLUTION,
    menuLabel: PROMPT_BOX_RESOLUTION_MENU_LABEL,
  },
  {
    kind: "duration",
    label: PROMPT_BOX_DEFAULT_DURATION,
    leftIconSrc: PROMPT_BOX_DURATION_ICON_SRC,
    defaultValue: PROMPT_BOX_DEFAULT_DURATION,
    menuLabel: PROMPT_BOX_DURATION_MENU_LABEL,
  },
];

export function getPromptBoxDefaultControlButtons(media: PromptBoxMedia) {
  if (media === "compact") return [];
  if (isPromptBoxVideoMedia(media)) return PROMPT_BOX_DEFAULT_VIDEO_CONTROL_BUTTONS;
  return PROMPT_BOX_DEFAULT_IMAGE_CONTROL_BUTTONS;
}
