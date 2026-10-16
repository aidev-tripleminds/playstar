import type {
  PromptboxHybridMedia,
  PromptboxHybridPlaceholderSlot,
  PromptboxHybridTab,
} from "./promptbox-hybrid.types";

export const PROMPTBOX_HYBRID_DEFAULT_MEDIA: PromptboxHybridMedia = "image-presets";

export const PROMPTBOX_HYBRID_CUSTOM_PROMPT_LABEL = "Custom prompt (optional)";

export const PROMPTBOX_HYBRID_LOCKED_PROMPT_PLACEHOLDER =
  "Get a premium plan to unlock the full potential of the custom prompts...";

export const PROMPTBOX_HYBRID_DEFAULT_PROMPT_PLACEHOLDER = "Enter your prompt here...";

export const PROMPTBOX_HYBRID_SETTINGS_LABEL = "Settings";

export const PROMPTBOX_HYBRID_SETTINGS_ICON_SRC = "/assets/settings-outline.svg";

export const PROMPTBOX_HYBRID_CROWN_ICON_SRC = "/assets/crown-filled.svg";

/** Guest free generations remaining shown in Generate group when logged out (`n/5`). */
export const PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT = 5;

/** Remaining free generations for a new guest session (`5/5`). */
export const PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT = PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT;

export function clampPromptboxHybridGuestUsageCount(
  usageCount: number,
  limit: number = PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
) {
  if (!Number.isFinite(usageCount)) {
    return PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT;
  }

  return Math.min(Math.max(Math.trunc(usageCount), 0), limit);
}

export function formatPromptboxHybridGuestUsageLabel(
  usageCount: number,
  limit: number = PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
) {
  const clamped = clampPromptboxHybridGuestUsageCount(usageCount, limit);
  return `${clamped}/${limit}`;
}

export function isPromptboxHybridGuestUsageAtLimit(
  usageCount: number,
  limit: number = PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
) {
  return clampPromptboxHybridGuestUsageCount(usageCount, limit) <= 0;
}

export const PROMPTBOX_HYBRID_SHELL_CLASS =
  "relative flex max-h-full min-h-0 max-w-[360px] w-full flex-col gap-4 overflow-hidden rounded-[32px] border border-solid border-slider-track bg-[#17171780] p-4";

export const PROMPTBOX_HYBRID_MOBILE_CLASS = "relative flex w-full flex-col gap-4 overflow-hidden";

/** Scrolls tabs/placeholders/prompt when the shell is height-capped. */
export const PROMPTBOX_HYBRID_BODY_CLASS =
  "flex min-h-0 w-full flex-col gap-4 overflow-y-auto overscroll-contain scrollbar-hidden";

/** Keeps Generate group (and controls) visible at the bottom on short viewports. */
export const PROMPTBOX_HYBRID_FOOTER_CLASS = "flex w-full shrink-0 flex-col gap-4";

/** Locked prompt keeps full opacity; global Textarea disabled styles are overridden here. */
export const PROMPTBOX_HYBRID_TEXTAREA_CLASS =
  "min-h-[96px] w-full min-w-0 resize-none rounded-2xl border border-solid border-slider-track bg-tooltip-default-bg p-3 shadow-none text-sm leading-5 font-medium [overflow-wrap:anywhere] text-tooltip-text placeholder:text-divider-label focus-visible:border-slider-track focus-visible:ring-0 focus-visible:outline-none [&_textarea]:disabled:cursor-not-allowed [&_textarea]:disabled:bg-transparent [&_textarea]:disabled:opacity-100";

export const PROMPTBOX_HYBRID_PLACEHOLDERS_DESKTOP_CLASS = "grid w-full items-start gap-2";

export const PROMPTBOX_HYBRID_PLACEHOLDERS_DESKTOP_MULTI_CLASS = "grid-cols-2";

export const PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_CLASS =
  "flex w-full flex-row items-stretch gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** Two mobile slots fill the row instead of sitting left in the scroll strip. */
export const PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_PAIR_CLASS =
  "mx-auto grid w-full max-w-[432px] grid-cols-2 items-start gap-2";

export const PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_PAIR_SLOT_CLASS = "max-h-[282px] max-w-[212px]";

export const PROMPTBOX_HYBRID_IMAGE_TABS: PromptboxHybridTab[] = [
  { label: "Text to Image" },
  { label: "Edit image" },
];

export const PROMPTBOX_HYBRID_VIDEO_TABS: PromptboxHybridTab[] = [
  { label: "Text to Video" },
  { label: "Image to Video" },
  { label: "Extend Video" },
  { label: "Edit Video" },
];

export const PROMPTBOX_HYBRID_DEFAULT_IMAGE_PRESET_PLACEHOLDERS: PromptboxHybridPlaceholderSlot[] =
  [
    { title: "Character", subtitle: "Optional" },
    { title: "Action", subtitle: "Optional" },
    { title: "Clothing", subtitle: "Optional" },
    { title: "Location", subtitle: "Optional" },
  ];

export const PROMPTBOX_HYBRID_DEFAULT_IMAGE_EDIT_PLACEHOLDERS: PromptboxHybridPlaceholderSlot[] = [
  { title: "Image", subtitle: "Optional" },
];

export const PROMPTBOX_HYBRID_DEFAULT_SPEECH2VID_PLACEHOLDERS: PromptboxHybridPlaceholderSlot[] = [
  { title: "Character", subtitle: "Optional" },
  { title: "Audio", subtitle: "Optional" },
];

export const PROMPTBOX_HYBRID_DEFAULT_IMAGE2VIDEO_PLACEHOLDERS: PromptboxHybridPlaceholderSlot[] = [
  { title: "Image", subtitle: "Optional" },
];

export const PROMPTBOX_HYBRID_DEFAULT_EXTEND_VIDEO_PLACEHOLDERS: PromptboxHybridPlaceholderSlot[] =
  [{ title: "Video", subtitle: "Optional" }];

const MEDIA_DEFAULT_TABS: Record<PromptboxHybridMedia, PromptboxHybridTab[]> = {
  "image-presets": PROMPTBOX_HYBRID_IMAGE_TABS,
  "image-edit": PROMPTBOX_HYBRID_IMAGE_TABS,
  "video-presets": PROMPTBOX_HYBRID_VIDEO_TABS,
  "video-image2vid": PROMPTBOX_HYBRID_VIDEO_TABS,
  "video-speech2vid": PROMPTBOX_HYBRID_VIDEO_TABS,
  "video-extend": PROMPTBOX_HYBRID_VIDEO_TABS,
  "video-edit": PROMPTBOX_HYBRID_VIDEO_TABS,
};

const MEDIA_DEFAULT_PLACEHOLDERS: Record<PromptboxHybridMedia, PromptboxHybridPlaceholderSlot[]> = {
  "image-presets": PROMPTBOX_HYBRID_DEFAULT_IMAGE_PRESET_PLACEHOLDERS,
  "image-edit": PROMPTBOX_HYBRID_DEFAULT_IMAGE_EDIT_PLACEHOLDERS,
  "video-presets": PROMPTBOX_HYBRID_DEFAULT_IMAGE_PRESET_PLACEHOLDERS,
  "video-image2vid": PROMPTBOX_HYBRID_DEFAULT_IMAGE2VIDEO_PLACEHOLDERS,
  "video-speech2vid": PROMPTBOX_HYBRID_DEFAULT_SPEECH2VID_PLACEHOLDERS,
  "video-extend": PROMPTBOX_HYBRID_DEFAULT_EXTEND_VIDEO_PLACEHOLDERS,
  "video-edit": PROMPTBOX_HYBRID_DEFAULT_EXTEND_VIDEO_PLACEHOLDERS,
};

const MEDIA_DEFAULT_TAB_INDEX: Record<PromptboxHybridMedia, number> = {
  "image-presets": 0,
  "image-edit": 1,
  "video-presets": 0,
  "video-image2vid": 1,
  "video-speech2vid": 0,
  "video-extend": 2,
  "video-edit": 3,
};

const IMAGE_MEDIA_BY_TAB: PromptboxHybridMedia[] = ["image-presets", "image-edit"];

const VIDEO_MEDIA_BY_TAB: PromptboxHybridMedia[] = [
  "video-presets",
  "video-image2vid",
  "video-extend",
  "video-edit",
];

function isVideoMedia(media: PromptboxHybridMedia) {
  return media.startsWith("video-");
}

export function getPromptboxHybridDefaultTabs(media: PromptboxHybridMedia) {
  return MEDIA_DEFAULT_TABS[media];
}

export function getPromptboxHybridDefaultPlaceholders(media: PromptboxHybridMedia) {
  return MEDIA_DEFAULT_PLACEHOLDERS[media];
}

export function getPromptboxHybridDefaultTabIndex(media: PromptboxHybridMedia) {
  return MEDIA_DEFAULT_TAB_INDEX[media];
}

export function getPromptboxHybridMediaForTab(media: PromptboxHybridMedia, tabIndex: number) {
  const mediaByTab = isVideoMedia(media) ? VIDEO_MEDIA_BY_TAB : IMAGE_MEDIA_BY_TAB;
  return mediaByTab[tabIndex] ?? media;
}
