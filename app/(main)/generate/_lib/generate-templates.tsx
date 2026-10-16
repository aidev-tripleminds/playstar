import { GENERATE_GROUP_TOKEN_ICON_SRC } from "@/components/common/generate/generate-group/generate-group.constants";
import type { RatioIconRatio } from "@/components/common/generate/ratio-icon";
import { AI_MODEL_TEMPLATES_DEFAULT_BADGE } from "@/components/common/Prismic/ai-model";
import { AI_MODEL_TEMPLATES_INSET_IMAGE_SRC } from "@/components/common/Prismic/ai-model/ai-model.constants";
import type { HomepageFilter } from "@/components/pages/homepage";
import { resolveAsset } from "@/lib/assets/asset-store";
import { GalleryIcon, HeartIcon, VideoSquareIcon } from "@/public/assets/icons";

const TEMPLATE_ASSET_KEYS = [
  "demo_explore_explore_char_images_character1",
  "demo_explore_explore_char_images_character2",
  "demo_explore_explore_char_images_character3",
  "demo_explore_explore_char_images_character4",
  "demo_explore_explore_char_images_character5",
  "demo_explore_explore_char_images_character6",
  "demo_explore_explore_char_images_character7",
  "demo_explore_explore_char_images_character8",
] as const;

const TEMPLATE_NICHES = ["MILF", "Blonde", "Athletic", "Latina"] as const;

/** One name per catalog card, in grid order. */
export const GENERATE_TEMPLATE_NAMES = [
  "Blowjob",
  "Anal",
  "Side Blowjob",
  "JOI",
  "Cumshot",
  "Doggystyle",
  "Cowgirl",
  "Bouncing Boobs",
  "Reverse Cowgirl",
  "Deepthroat",
  "Boobjob",
  "Footjob",
  "Handjob",
  "Missionary",
  "Prone Bone",
] as const;

export const GENERATE_TEMPLATES_SEARCH_PLACEHOLDER = "Search...";

export const GENERATE_TEMPLATES_NICHE_FILTER: HomepageFilter = {
  id: "niche",
  label: "Niche",
  value: "All",
  options: ["All", ...TEMPLATE_NICHES],
};

export const GENERATE_TEMPLATES_SORT_TABS = [
  {
    label: "Liked",
    leftIconSrc: <HeartIcon className="size-5 shrink-0" strokeColor="currentColor" />,
    showBadge: false,
  },
  { label: "Trending", showBadge: false },
  { label: "New", showBadge: false },
  { label: "Top rated", showBadge: false },
] as const;

/** Figma mobile **14817:81676**: one nowrap chip row. Desktop wraps. */
export const GENERATE_TEMPLATES_TOOLBAR_CLASS =
  "flex w-full min-w-0 shrink-0 items-center gap-2 max-[767px]:scrollbar-hidden max-[767px]:flex-nowrap max-[767px]:overflow-x-auto max-[767px]:overscroll-x-contain max-[767px]:touch-pan-x max-[767px]:[&>[data-slot=homepage-filter]]:shrink-0 min-[768px]:flex-wrap";

/**
 * Animate a real width, never `flex-grow`. Grow interpolates after `max-width`
 * is removed, so collapse flashed to the full toolbar then shrank.
 * Keep `max-w-[350px]` on both states so the cap never drops mid-transition.
 * Inner pill is `w-full` of this wrapper, so layout space and the bar move together.
 */
export const GENERATE_TEMPLATES_SEARCH_WRAPPER_EXPANDED_CLASS =
  "w-52 max-w-[350px] shrink-0 grow-0 [&>div]:w-full transition-[width] duration-500 ease-in-out min-[768px]:w-[350px]";

export const GENERATE_TEMPLATES_SEARCH_WRAPPER_COLLAPSED_CLASS =
  "w-11 max-w-[350px] shrink-0 grow-0 [&>div]:w-full transition-[width] duration-500 ease-in-out";

/** Compact sort chips hug the parent scroller on mobile instead of owning a nested one. */
export const GENERATE_TEMPLATES_SORT_TABS_CLASS =
  "min-w-0 overflow-visible p-0! max-[767px]:w-max max-[767px]:shrink-0 max-[767px]:[&_[data-slot=tabs-compact-scroll]]:w-max max-[767px]:[&_[data-slot=tabs-compact-scroll]]:overflow-visible max-[767px]:[&_[data-slot=tabs-compact-scroll-wrap]]:w-max min-[768px]:w-auto min-[768px]:flex-1";

/** Figma mobile cards: 2-col / 8px gap. Desktop steps up columns; 6 from 1920px. */
export const GENERATE_TEMPLATES_GRID_CLASS =
  "grid grid-cols-2 gap-2 min-[768px]:grid-cols-3 min-[768px]:gap-3 min-[1280px]:grid-cols-4 min-[1440px]:grid-cols-5 min-[1920px]:grid-cols-6";

/**
 * Desktop: nested scroller so the logged-out SEO stack (and its footer) sit
 * below the grid. Mobile: document scroll so iOS Safari can collapse its HUD
 * (`pb-24` matches `/explore` so the last cards clear the nav fade).
 */
export const GENERATE_TEMPLATES_SCROLL_CLASS =
  "scrollbar-hidden flex w-full flex-col touch-pan-y max-[767px]:pb-24 min-[768px]:min-h-0 min-[768px]:flex-1 min-[768px]:overflow-y-auto min-[768px]:overscroll-y-contain";

/** Soft fade into the mobile bottom nav, same role as `/explore` `ButtonNavShadows`. */
export const GENERATE_TEMPLATES_BOTTOM_FADE_CLASS =
  "pointer-events-none absolute inset-x-0 -mx-4 bottom-0 z-20 h-32 min-[768px]:hidden bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)]";

export type GenerateTemplateItem = {
  id: string;
  name: string;
  imageSrc: string;
  assetKey?: string;
  insetImageSrc?: string;
  badgeLabel?: string;
  niche?: string;
  tags?: readonly string[];
  liked?: boolean;
};

/** Figma **14817:81435** — template detail Master Modal on Create. */
export const GENERATE_TEMPLATE_MODAL_TAGS = [
  "Brunette",
  "Big tits",
  "Carwash",
  "Blue eyes",
] as const;

export const GENERATE_TEMPLATE_MODAL_TOKEN_COST = "30";
export const GENERATE_TEMPLATE_MODAL_GENERATE_LABEL = "Generate";
export const GENERATE_TEMPLATE_MODAL_GALLERY_LABEL = "Go to gallery";
export const GENERATE_TEMPLATE_MODAL_SETTINGS_LABEL = "Settings";
export const GENERATE_TEMPLATE_MODAL_CLOSE_LABEL = "Close template";
export const GENERATE_TEMPLATE_MODAL_LIKE_LABEL = "Like template";
export const GENERATE_TEMPLATE_MODAL_UNLIKE_LABEL = "Unlike template";
export const GENERATE_TEMPLATE_MODAL_TOKEN_ICON_SRC = GENERATE_GROUP_TOKEN_ICON_SRC;
export const GENERATE_TEMPLATE_MODAL_SETTINGS_ICON_SRC = "/assets/settings-outline.svg";

export const GENERATE_TEMPLATE_MODAL_IMAGE2VIDEO_LABEL = "Image2Video";
export const GENERATE_TEMPLATE_MODAL_EXTEND_VIDEO_LABEL = "Extend Video";

export const GENERATE_TEMPLATE_MODAL_MODE_TABS = [
  {
    label: GENERATE_TEMPLATE_MODAL_IMAGE2VIDEO_LABEL,
    leftIconSrc: <GalleryIcon className="size-5 shrink-0" />,
    showBadge: false,
  },
  {
    label: GENERATE_TEMPLATE_MODAL_EXTEND_VIDEO_LABEL,
    leftIconSrc: <VideoSquareIcon className="size-5 shrink-0" />,
    showBadge: false,
  },
] as const;

export const GENERATE_TEMPLATE_MODAL_CLASS =
  "z-999 md:max-w-[530px]! data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[min(580px,calc(100dvh-1rem))]!";

/** Templates can expose 1 or 2 start-content slots. Show two placeholders for now. */
export const GENERATE_TEMPLATE_MODAL_PLACEHOLDER_COUNT = 2 as const;

export const GENERATE_TEMPLATE_CHOOSE_TEMPLATE_TYPE_TAB = {
  characters: 0,
  images: 1,
  videos: 2,
} as const;

export const GENERATE_TEMPLATE_CHOOSE_TEMPLATE_CLOSE_LABEL = "Close template picker";

export const GENERATE_TEMPLATE_CHOOSE_TEMPLATE_CLASS =
  "z-1000 h-[min(960px,calc(100vh-4rem))] max-h-[calc(100vh-4rem)]";

export const GENERATE_TEMPLATE_CHOOSE_TEMPLATE_OVERLAY_CLASS = "z-1000";

export function getGenerateTemplateEmptyVariant(modeIndex: number) {
  return modeIndex === 1 ? ("select-video" as const) : ("select-image-char" as const);
}

export function getGenerateTemplateChooseTemplateTypeTab(modeIndex: number) {
  return modeIndex === 1
    ? GENERATE_TEMPLATE_CHOOSE_TEMPLATE_TYPE_TAB.videos
    : GENERATE_TEMPLATE_CHOOSE_TEMPLATE_TYPE_TAB.images;
}

/** Figma **14817:81493** desktop / **14817:81628** mobile — Advanced settings on Create templates. */
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_TITLE = "Advanced settings";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL = "Aspect ratio";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_DROPDOWN_LABEL = "Aspect ratio:";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_LABEL = "Resolution";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_DROPDOWN_LABEL = "Resolution:";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_LABEL = "Duration";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_DROPDOWN_LABEL = "Duration:";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_AUDIO_LABEL = "Audio:";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_APPLY_LABEL = "Apply";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_CANCEL_LABEL = "Cancel";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_CLOSE_LABEL = "Close advanced settings";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_TITLE_ICON_SRC =
  GENERATE_TEMPLATE_MODAL_SETTINGS_ICON_SRC;

export const GENERATE_TEMPLATE_ASPECT_RATIO_MODAL_TITLE = "Aspect ratio";
export const GENERATE_TEMPLATE_RESOLUTION_MODAL_TITLE = "Resolution";
export const GENERATE_TEMPLATE_DURATION_MODAL_TITLE = "Duration";
export const GENERATE_TEMPLATE_AUDIO_MODAL_TITLE = "Audio";

export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC = "/assets/ratio.svg";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC =
  "/assets/video-horizontal.svg";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_ICON_SRC = "/assets/clock.svg";
export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_AUDIO_ICON_SRC = "/assets/microphone.svg";

export const GENERATE_TEMPLATE_ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
] as const satisfies readonly { value: RatioIconRatio; label: string }[];

export const GENERATE_TEMPLATE_RESOLUTION_OPTIONS = [
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" },
] as const;

export const GENERATE_TEMPLATE_AUDIO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
] as const;

export const GENERATE_TEMPLATE_DURATION_MIN_SECONDS = 4;
export const GENERATE_TEMPLATE_DURATION_MAX_SECONDS = 300;

export type GenerateTemplateAdvancedSettingsValues = {
  aspectRatio: (typeof GENERATE_TEMPLATE_ASPECT_RATIO_OPTIONS)[number]["value"];
  resolution: (typeof GENERATE_TEMPLATE_RESOLUTION_OPTIONS)[number]["value"];
  duration: string;
  audio: (typeof GENERATE_TEMPLATE_AUDIO_OPTIONS)[number]["value"];
};

export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS: GenerateTemplateAdvancedSettingsValues =
  {
    aspectRatio: "16:9",
    resolution: "1080p",
    duration: `${GENERATE_TEMPLATE_DURATION_MIN_SECONDS}s`,
    audio: "yes",
  };

export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_CLASS =
  "z-1000 md:max-w-[530px]! data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[min(496px,calc(100dvh-1rem))]!";

export const GENERATE_TEMPLATE_ADVANCED_SETTINGS_OVERLAY_CLASS = "z-1000";

export const GENERATE_TEMPLATE_SETTINGS_PICKER_CLASS =
  "z-1010 md:max-w-[530px]! data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[min(496px,calc(100dvh-1rem))]!";

export const GENERATE_TEMPLATE_SETTINGS_PICKER_OVERLAY_CLASS = "z-1010";

/** Visible stage timings for Queue → Processing → Generating (1–100%) → Result. */
export const GENERATE_TEMPLATE_STAGE_QUEUING_MS = 6000;
export const GENERATE_TEMPLATE_STAGE_PROCESSING_MS = 4000;
/** Generating % advances 5% per second (1% every 200ms) from 1% to 100% (99 steps). */
export const GENERATE_TEMPLATE_STAGE_PROGRESS_PERCENT_PER_SECOND = 5;
export const GENERATE_TEMPLATE_STAGE_PROGRESS_TICK_MS =
  1000 / GENERATE_TEMPLATE_STAGE_PROGRESS_PERCENT_PER_SECOND;
export const GENERATE_TEMPLATE_STAGE_GENERATING_MS = GENERATE_TEMPLATE_STAGE_PROGRESS_TICK_MS * 99;
export const GENERATE_TEMPLATE_STAGE_RESULT_HOLD_MS = 1500;

export type GenerateTemplateStage = "idle" | "queuing" | "processing" | "generating" | "result";

export function isGenerateTemplateStageBusy(stage: GenerateTemplateStage) {
  return stage !== "idle";
}

export function isGenerateTemplateStageInFlight(stage: GenerateTemplateStage) {
  return stage === "queuing" || stage === "processing" || stage === "generating";
}

export function getGenerateTemplatePreviewVariant(stage: GenerateTemplateStage) {
  if (stage === "queuing") return "queue" as const;
  if (stage === "processing") return "processing" as const;
  if (stage === "generating") return "generating" as const;
  return "loaded" as const;
}

export function formatGenerateTemplateDuration(seconds: number) {
  return `${seconds}s`;
}

export function parseGenerateTemplateDurationSeconds(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return GENERATE_TEMPLATE_DURATION_MIN_SECONDS;
  }

  return Math.min(
    GENERATE_TEMPLATE_DURATION_MAX_SECONDS,
    Math.max(GENERATE_TEMPLATE_DURATION_MIN_SECONDS, parsed),
  );
}

export const GENERATE_TEMPLATE_ITEMS: GenerateTemplateItem[] = GENERATE_TEMPLATE_NAMES.map(
  (name, index) => {
    const assetKey = TEMPLATE_ASSET_KEYS[index % TEMPLATE_ASSET_KEYS.length];
    const niche = TEMPLATE_NICHES[index % TEMPLATE_NICHES.length];

    return {
      id: `generate-template-${index + 1}`,
      name,
      assetKey,
      imageSrc: resolveAsset(assetKey).image ?? "",
      insetImageSrc: AI_MODEL_TEMPLATES_INSET_IMAGE_SRC,
      badgeLabel: AI_MODEL_TEMPLATES_DEFAULT_BADGE,
      niche,
      tags: GENERATE_TEMPLATE_MODAL_TAGS,
      liked: true,
    };
  },
);

export function filterGenerateTemplates(
  items: readonly GenerateTemplateItem[],
  options: { query?: string; niche?: string } = {},
) {
  const query = options.query?.trim().toLowerCase() ?? "";
  const niche = options.niche?.trim() || GENERATE_TEMPLATES_NICHE_FILTER.value;

  return items.filter((item) => {
    if (query) {
      const haystack = `${item.name} ${item.niche ?? ""} ${item.badgeLabel ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    if (niche !== "All" && item.niche !== niche) return false;

    return true;
  });
}
