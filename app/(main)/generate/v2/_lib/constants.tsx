import {
  isPromptBoxVideoMedia,
  PROMPT_BOX_DEFAULT_DURATION,
  PROMPT_BOX_DEFAULT_RESOLUTION,
  PROMPT_BOX_DURATION_OPTIONS,
  PROMPT_BOX_FREE_LABEL,
  PROMPT_BOX_RESOLUTION_ICON_SRC,
  PROMPT_BOX_RESOLUTION_MENU_LABEL,
  PROMPT_BOX_RESOLUTION_OPTIONS,
  PROMPT_BOX_UPGRADE_LABEL,
  type PromptBoxControlButtonConfig,
  type PromptBoxGenerateActionVariant,
  type PromptBoxMedia,
} from "@/components/common/generate/prompt-box";
import {
  defaultMediaPreviewItems,
  defaultMediaPreviewMetadata,
  defaultMediaPreviewPrompt,
} from "@/components/common/image-preview/media-preview/constants";
import { dummyImage } from "@/lib/dummy-images";
import { SKIP_QUEUE_FEATURE_ENABLED } from "@/lib/feature-flags";
import { ROUTES } from "@/lib/routes";
import { Check, Clapperboard, Images, LayoutTemplate } from "lucide-react";

import type {
  GenerateCreatePayload,
  GenerateGalleryItem,
  GenerateMediaKind,
  GenerateProcessingItem,
  GenerateSectionTabId,
  GenerateSourceSlotId,
} from "./types";

const TAB_ICON_CLASS = "size-5 shrink-0";

/**
 * `makesVideo` marks the tabs that exist only to produce a video — every
 * template is an Image2Video or Extend Video preset — so they go away together
 * while video generation is closed (FRONT-900, {@link isGenerateTabAvailable}).
 * Templates also waits for its own pre-launch flag on top of video.
 */
export const GENERATE_SECTION_TABS = [
  {
    id: "templates" as const,
    label: "Templates",
    leftIconSrc: <LayoutTemplate className={TAB_ICON_CLASS} />,
    media: "image-presets" as PromptBoxMedia,
    makesVideo: true,
  },
  {
    id: "images" as const,
    label: "Images",
    leftIconSrc: <Images className={TAB_ICON_CLASS} />,
    media: "image-presets" as PromptBoxMedia,
    makesVideo: false,
  },
  {
    id: "videos" as const,
    label: "Videos",
    leftIconSrc: <Clapperboard className={TAB_ICON_CLASS} />,
    media: "video-presets" as PromptBoxMedia,
    makesVideo: true,
  },
] as const;

/** Whether a tab is offered, given whether video generation and Templates are open. */
export function isGenerateTabAvailable(
  sectionTabId: GenerateSectionTabId,
  videoEnabled: boolean,
  templatesEnabled: boolean,
): boolean {
  if (sectionTabId === "templates" && !templatesEnabled) return false;
  return videoEnabled || !GENERATE_SECTION_TABS.find((tab) => tab.id === sectionTabId)?.makesVideo;
}

/**
 * The URL each gallery tab is also reachable at (BACK-222).
 *
 * `/generate`, `/generate-image` and `/generate-video` are the same workspace
 * opened on a different tab, but they are not aliases: each is a real page with
 * its own Prismic document, `<title>`, meta description and canonical, so a
 * logged-out visitor on the Images tab must be at `/generate-image` or the URL
 * promises one page while the body shows another.
 *
 * Kept beside {@link GENERATE_SECTION_TABS} so a new tab cannot be added
 * without deciding whether it has a URL. Templates maps to the parent landing:
 * it is the workspace's default, not a page of its own.
 */
export const GENERATE_TAB_ROUTES: Readonly<Record<GenerateSectionTabId, string>> = {
  templates: ROUTES.generate,
  images: ROUTES.generateImage,
  videos: ROUTES.generateVideo,
};

/**
 * The same table read backwards: which tab a URL means.
 *
 * Needed because the address bar can change WITHOUT a click — Back and Forward
 * over the history entries the tab switch pushes. Derived from
 * {@link GENERATE_TAB_ROUTES} rather than written out again, so the two
 * directions cannot disagree.
 */
export const GENERATE_ROUTE_SECTION_INDEX: ReadonlyMap<string, number> = new Map(
  GENERATE_SECTION_TABS.map((tab, index) => [GENERATE_TAB_ROUTES[tab.id], index]),
);

export const GENERATE_VIDEOS_SECTION_INDEX = GENERATE_SECTION_TABS.findIndex(
  (tab) => tab.id === "videos",
);

export const GENERATE_IMAGES_SECTION_INDEX = GENERATE_SECTION_TABS.findIndex(
  (tab) => tab.id === "images",
);

export const GENERATE_DEFAULT_SECTION_TAB_ID: GenerateSectionTabId = "templates";

export const GENERATE_SEARCH_PLACEHOLDER = "Search...";

export const GENERATE_BLUR_NSFW_LABEL_OFF = "Blur : No";

export const GENERATE_BLUR_NSFW_LABEL_ON = "Blur : Yes";

export const GENERATE_BLUR_NSFW_LABEL = "Blur ";

export const GENERATE_SELECT_LABEL = "Select";

export const GENERATE_BULK_SELECT_LABEL = "Bulk Select";

export const GENERATE_QUICK_ACTIONS_TITLE = "Quick actions";

export const GENERATE_SELECT_ICON = <Check className="size-5 shrink-0" aria-hidden />;

export const GENERATE_SOURCE_SLOTS: readonly {
  id: GenerateSourceSlotId;
  title: string;
  subtitle: string;
}[] = [
  { id: "character", title: "Character", subtitle: "Optional" },
  { id: "action", title: "Action", subtitle: "Optional" },
  { id: "clothing", title: "Clothing", subtitle: "Optional" },
  { id: "location", title: "Location", subtitle: "Optional" },
];

export const GENERATE_IMAGE_EDIT_SLOTS: readonly {
  id: GenerateSourceSlotId;
  title: string;
  subtitle: string;
}[] = [{ id: "image", title: "Image", subtitle: "Optional" }];

export const GENERATE_SPEECH2VID_SLOTS: readonly {
  id: GenerateSourceSlotId;
  title: string;
  subtitle: string;
}[] = [
  { id: "image", title: "Media", subtitle: "Required" },
  { id: "audio", title: "Audio", subtitle: "Required" },
];

export const GENERATE_EXTEND_VIDEO_SLOTS: readonly {
  id: GenerateSourceSlotId;
  title: string;
  subtitle: string;
}[] = [{ id: "video", title: "Video", subtitle: "Required" }];

export const GENERATE_POSE_SLOT_TITLE = "Action";

export const GENERATE_POSE_PICKER_TITLE = "Select action";

export const GENERATE_ACTION_PICKER_TITLE = "Select action";

const GENERATE_IMAGE_PRESET_SLOTS = GENERATE_SOURCE_SLOTS.map((slot) =>
  slot.id === "action" ? { ...slot, title: GENERATE_POSE_SLOT_TITLE } : slot,
);

/** create-video needs `character_id`, so Text to Video requires a character. */
const GENERATE_VIDEO_PRESET_SLOTS = GENERATE_SOURCE_SLOTS.map((slot) =>
  slot.id === "character" ? { ...slot, subtitle: "Required" } : slot,
);

export function getGenerateSourceSlots(media: PromptBoxMedia) {
  if (media === "image-edit" || media === "video-image2vid") return GENERATE_IMAGE_EDIT_SLOTS;
  if (media === "video-speech2vid") return GENERATE_SPEECH2VID_SLOTS;
  if (media === "video-extend" || media === "video-edit") return GENERATE_EXTEND_VIDEO_SLOTS;
  if (!isPromptBoxVideoMedia(media)) return GENERATE_IMAGE_PRESET_SLOTS;
  if (media === "video-presets") return GENERATE_VIDEO_PRESET_SLOTS;
  return GENERATE_SOURCE_SLOTS;
}

export const GENERATE_CHOOSE_TEMPLATE_TYPE_TAB = {
  characters: 0,
  images: 1,
  videos: 2,
} as const;

export const GENERATE_CHOOSE_TEMPLATE_SEARCH_PLACEHOLDER = "Search...";

export const GENERATE_ASPECT_RATIO_OPTIONS = [
  { value: "4:5", label: "4:5" },
  { value: "5:4", label: "5:4" },
  { value: "1:1", label: "1:1" },
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
] as const;

export const GENERATE_GENERATION_COUNT_OPTIONS = [
  { value: "2", label: "2" },
  { value: "4", label: "4" },
  { value: "8", label: "8" },
  { value: "12", label: "12" },
] as const;

export type GenerateGenerationCountOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export function parseGenerateGenerationCount(value: string) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return Number.parseInt(GENERATE_DEFAULT_GENERATION_COUNT, 10) || 1;
  }

  return parsed;
}

export function clampGenerateGenerationCount(value: string, maxCount?: number) {
  const count = parseGenerateGenerationCount(value);
  if (maxCount == null || maxCount <= 0) {
    return String(count);
  }

  return String(Math.min(count, maxCount));
}

export function getGenerateGenerationCountOptions(
  maxCount?: number,
): GenerateGenerationCountOption[] {
  return GENERATE_GENERATION_COUNT_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
    disabled: maxCount != null && parseGenerateGenerationCount(option.value) > maxCount,
  }));
}

export const GENERATE_DEFAULT_ASPECT_RATIO = "4:5";

export const GENERATE_DEFAULT_VIDEO_ASPECT_RATIO = "4:5";

export const GENERATE_DEFAULT_GENERATION_COUNT = "2";

/** Video resolution list — Figma `16140:78541`. */
export const GENERATE_RESOLUTION_OPTIONS = PROMPT_BOX_RESOLUTION_OPTIONS;

export const GENERATE_DURATION_OPTIONS = [...PROMPT_BOX_DURATION_OPTIONS];

export const GENERATE_DEFAULT_RESOLUTION = PROMPT_BOX_DEFAULT_RESOLUTION;

export const GENERATE_DEFAULT_DURATION = PROMPT_BOX_DEFAULT_DURATION;

/** Video duration slider — Figma `16140:78567`. */
export const GENERATE_DURATION_MIN_SECONDS = 5;

export const GENERATE_DURATION_MAX_SECONDS = 300;

export const GENERATE_DURATION_APPLY_LABEL = "Apply";

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

export function getGenerateDurationControlOptions(duration: string) {
  if (GENERATE_DURATION_OPTIONS.some((option) => option.value === duration)) {
    return [...GENERATE_DURATION_OPTIONS];
  }

  return [...GENERATE_DURATION_OPTIONS, { value: duration, label: duration }];
}

export const GENERATE_TOKEN_COST = "3";

export const GENERATE_TOKEN_COST_AMOUNT = Number.parseInt(GENERATE_TOKEN_COST, 10) || 0;

export const GENERATE_FREE_LABEL = PROMPT_BOX_FREE_LABEL;

export const GENERATE_UPGRADE_LABEL = PROMPT_BOX_UPGRADE_LABEL;

export const GENERATE_GENERATE_LABEL = "Generate";

export function parseGenerateTokenCost(tokenCost: string = GENERATE_TOKEN_COST) {
  const parsed = Number.parseInt(tokenCost, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : GENERATE_TOKEN_COST_AMOUNT;
}

export function getGenerateRequestedTokenCost(
  count: number,
  unitCost: number = GENERATE_TOKEN_COST_AMOUNT,
) {
  return Math.max(0, Math.trunc(count)) * unitCost;
}

/** Free-plan `/me.token_balance` is still enough to generate one image. */
export function hasGenerateTokenBalance(tokenBalance: number | undefined) {
  return (tokenBalance ?? 0) >= GENERATE_TOKEN_COST_AMOUNT;
}

export function canAffordGenerateTokens(
  tokenBalance: number | undefined,
  count: number,
  unitCost: number = GENERATE_TOKEN_COST_AMOUNT,
) {
  return (tokenBalance ?? 0) >= getGenerateRequestedTokenCost(count, unitCost);
}

/** `/me.token_balance` minus tokens already reserved by in-flight generates. */
export function getAvailableGenerateTokenBalance(
  tokenBalance: number | undefined,
  reservedTokenCost = 0,
) {
  return Math.max(0, (tokenBalance ?? 0) - Math.max(0, reservedTokenCost));
}

export function canEnableGenerateSkipQueue(options: {
  isLoggedIn: boolean;
  isPremiumResolved: boolean;
  isPremium?: boolean;
  isPremiumPlan?: boolean;
  isInfinitePlan?: boolean;
}) {
  if (!SKIP_QUEUE_FEATURE_ENABLED) {
    return false;
  }

  if (!options.isLoggedIn || !options.isPremiumResolved) {
    return false;
  }

  return Boolean(options.isPremiumPlan || options.isInfinitePlan || options.isPremium);
}

export type GeneratePromptActionState = {
  variant: PromptBoxGenerateActionVariant;
  tokenCost: string;
  generateLabel: string;
};

export function getGeneratePromptActionState(options: {
  isLoggedIn: boolean;
  isSessionPending: boolean;
  isPremium: boolean;
  isPremiumResolved: boolean;
  tokenBalance?: number;
  tokenCost?: string;
}): GeneratePromptActionState {
  if (!options.isSessionPending && !options.isLoggedIn) {
    return {
      variant: "usage",
      tokenCost: GENERATE_FREE_LABEL,
      generateLabel: GENERATE_GENERATE_LABEL,
    };
  }

  const isTrialUser = options.isLoggedIn && options.isPremiumResolved && !options.isPremium;
  if (isTrialUser) {
    if (!hasGenerateTokenBalance(options.tokenBalance)) {
      return {
        variant: "upgrade",
        tokenCost: GENERATE_UPGRADE_LABEL,
        generateLabel: GENERATE_UPGRADE_LABEL,
      };
    }

    return {
      variant: "usage",
      tokenCost: GENERATE_FREE_LABEL,
      generateLabel: GENERATE_GENERATE_LABEL,
    };
  }

  return {
    variant: "tokens",
    tokenCost: options.tokenCost ?? GENERATE_TOKEN_COST,
    generateLabel: GENERATE_GENERATE_LABEL,
  };
}

export const GENERATE_INFO_MODAL_TITLE = "Klams AI Tutorial";

export const GENERATE_INFO_MODAL_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
] as const;

export const GENERATE_INFO_MODAL_GOT_IT_LABEL = "Got it";

export const GENERATE_INFO_MODAL_WIKI_LABEL = "Read the guide on our wiki";

export const GENERATE_INFO_MODAL_WIKI_HREF = "#";

/**
 * Mobile DialogContent uses `h-fit!` so Android sheets can grow past Vaul's
 * inline height. iOS Safari then sizes fit-content from the header only —
 * nested `flex-1 min-h-0` children collapse to 0.
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

/** Advanced settings modal — Figma `16140:48952` (Master Modal on Create). */
export const GENERATE_ADVANCED_SETTINGS_TITLE = "Advanced settings";

export const GENERATE_ADVANCED_SETTINGS_TITLE_ICON_SRC = "/assets/settings-outline.svg";

export const GENERATE_ADVANCED_SETTINGS_TUTORIAL_LABEL = "Tutorial";

export const GENERATE_ADVANCED_SETTINGS_MODEL_LABEL = "Model:";

export const GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL = "Aspect ratio:";

export const GENERATE_ADVANCED_SETTINGS_GENERATIONS_LABEL = "Number of generations:";

export const GENERATE_ADVANCED_SETTINGS_DURATION_LABEL = "Duration:";

export const GENERATE_ADVANCED_SETTINGS_RESOLUTION_LABEL = "Resolution:";

export const GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_LABEL = "Auto skip queue";

export const GENERATE_ASPECT_RATIO_MODAL_TITLE = "Aspect ratio";

export const GENERATE_GENERATIONS_MODAL_TITLE = "Number of generations";

export const GENERATE_DURATION_MODAL_TITLE = "Duration";

export const GENERATE_RESOLUTION_MODAL_TITLE = "Resolution";

export const GENERATE_AUTO_SKIP_MODAL_TITLE = "Auto skip queue";

export const GENERATE_ADVANCED_SETTINGS_TUTORIAL_ICON_SRC = "/assets/info-circle.svg";

export const GENERATE_ADVANCED_SETTINGS_MODEL_ICON_SRC = "/assets/sparkles.svg";

export const GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC = "/assets/ratio.svg";

export const GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC = "/assets/layer.svg";

export const GENERATE_ADVANCED_SETTINGS_DURATION_ICON_SRC = "/assets/clock.svg";

export const GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC = "/assets/video-camera.svg";

export const GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC = "/assets/flash.svg";

export const GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

export type GenerateAutoSkipQueue =
  (typeof GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS)[number]["value"];

export const GENERATE_DELETE_CONFIRM_TITLE = "Are you sure?";

export const GENERATE_DELETE_CONFIRM_DESCRIPTION =
  "Are you sure you want to delete these images? This action can’t be undone.";

export const GENERATE_DELETE_CANCEL_LABEL = "Cancel";

export const GENERATE_DELETE_CONFIRM_LABEL = "Delete";

export function formatGenerateDeleteConfirmLabel(
  selectedCount: number,
  options?: { singleItem?: boolean },
) {
  if (options?.singleItem) return GENERATE_DELETE_CONFIRM_LABEL;
  const count = Math.max(0, selectedCount);
  const noun = count === 1 ? "item" : "items";
  return `Delete (${count}) ${noun}`;
}

export const GENERATE_EMPTY_STATE_TITLE = "No media generated yet";

export const GENERATE_EMPTY_STATE_DESCRIPTION = "Your AI hasn't created any images or videos yet.";

export const GENERATE_EMPTY_STATE_CTA_LABEL = "Create for Free";

/** Signup bonus advertised on the guest empty-state CTA (matches header / signup). */
export const GENERATE_EMPTY_STATE_CTA_BADGE = "+30";

export const GENERATE_NO_RESULTS_TITLE = "No results found";

export const GENERATE_NO_RESULTS_DESCRIPTION =
  "Try a different prompt search or clear the search to see all media.";

export const GENERATE_SECTION_EMPTY_TITLE = "Nothing here yet";

export const GENERATE_SECTION_EMPTY_DESCRIPTION =
  "No media in this section. Switch tabs or generate something new.";

export const GENERATE_PREVIEW_PROMPT = defaultMediaPreviewPrompt;

export const GENERATE_PREVIEW_METADATA = defaultMediaPreviewMetadata;

export const GENERATE_PREVIEW_MODEL_TITLE = "Eva Marina Petranova";

export const GENERATE_PREVIEW_MODEL_IMAGE = dummyImage(1);

export const GENERATE_PREVIEW_CREATE_VIDEO_LABEL = "Animate";

export const GENERATE_DESKTOP_BREAKPOINT = 768;

/** Equal 3:4 cards; columns track width so tiles stay near ~185px: 5 → 4 → 3 → 2, then 6 from 1920px. */
export const GENERATE_GALLERY_GRID_CLASS =
  "grid grid-cols-2 gap-2! @min-[560px]/gallery:grid-cols-3 @min-[760px]/gallery:grid-cols-4 @min-[760px]/gallery:gap-2! @min-[960px]/gallery:grid-cols-5 min-[1920px]:!grid-cols-6";

export const GENERATE_PROCESSING_CARD_CLASS =
  "aspect-3/4! h-auto! w-full! max-w-none! rounded-[16px]! md:rounded-[24px]!";

/** Visible stage timings for Queue → Processing → Generating (1–100%) → Result. */
export const GENERATE_STAGE_QUEUING_MS = 6000;
export const GENERATE_STAGE_PROCESSING_MS = 4000;
/** Generating % advances 4% per second (1% every 250ms) from 1% to 100% (99 steps). */
export const GENERATE_STAGE_PROGRESS_PERCENT_PER_SECOND = 4;
export const GENERATE_STAGE_PROGRESS_TICK_MS = 1000 / GENERATE_STAGE_PROGRESS_PERCENT_PER_SECOND;
export const GENERATE_STAGE_GENERATING_MS = GENERATE_STAGE_PROGRESS_TICK_MS * 99;
/** Short beat at 100% before the gallery result replaces the card. */
export const GENERATE_STAGE_RESULT_HOLD_MS = 1500;

export const GENERATE_TOOLBAR_TOGGLE_CLASS =
  "inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 text-sm leading-5 font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-primary";

/**
 * Desktop: fill the main column so gallery/templates are nested scrollers.
 * Mobile: grow with the document so iOS Safari can collapse its HUD — same
 * contract as `/explore` and create-ai-gf. `100lvh` stays the large viewport
 * while the HUD is showing, so empty galleries still have a page to scroll.
 * Do not lock height or overflow below 768px; that pins the browser chrome.
 */
export const GENERATE_VIEW_SHELL_CLASS =
  "relative mx-auto flex min-h-[calc(100lvh-62px)] w-full flex-col gap-4 p-4 scrollbar-hidden max-[767px]:pb-0 min-[768px]:h-[calc(100dvh-62px)] min-[768px]:min-h-0 min-[768px]:overflow-hidden";

/**
 * Templates: fill behind the mobile bottom nav so `ButtonNavShadows` fade
 * overlays the grid the same way `/explore` does. `-mb-24` cancels layout
 * `pb-24`. Scroll padding lives on `GENERATE_TEMPLATES_SCROLL_CLASS`.
 */
export const GENERATE_VIEW_SHELL_MOBILE_TEMPLATES_CLASS = "max-[767px]:-mb-24";

export const GENERATE_GALLERY_SCROLL_CLASS =
  "scrollbar-hidden flex w-full flex-col touch-pan-y min-[768px]:min-h-0 min-[768px]:flex-1 min-[768px]:overflow-y-auto min-[768px]:overscroll-y-contain";

/**
 * Overlay pin so a tall prompt can cover the toolbar.
 * Mobile: `fixed` just over the app bottom nav (`bottom-14` matches
 * create-ai-gf) so the page can document-scroll (Safari HUD). Desktop:
 * `absolute` on `generate-view`. `h-fit` sizes to content; `max-h` is the
 * 16px-from-top stop. Column + `justify-end` keeps the bar on the bottom
 * without stretching a row-flex child to the viewport.
 *
 * Mobile/tablet (`max-[767px]`) uses `pt-16` so overlapping source tiles stay
 * inside the overflow clip. 4-col cards scale with width and hang 1/3 above
 * the shell (`-translate-y-1/3`); `pt-8` (32px) only covers an 80px card, so
 * from ~405–710px the top border was clipped. 64px covers the tallest 4-col
 * hang (~60px at a 639px prompt-box container). Desktop already has `pt-16`
 * for the fade.
 *
 * Padding is not transitioned. Compact mode drops it to 0, and animating it
 * back to 64px clips the cards for the whole expand — the hang is outside the
 * shell until that padding exists.
 *
 * `max(100dvh, 100svh)` keeps the cap definite on iOS: `dvh` can be 0 before
 * the first visual-viewport update on some models, which with `overflow-hidden`
 * clips the whole bar. Pair with intrinsic-height children (no mobile
 * `flex-1 min-h-0 max-h-full`) — same iOS `h-fit` collapse as the drawers.
 *
 * The mobile header is 61px including its border (`top-[61px]` elsewhere).
 * Stopping the dock at 62px left a 1px slit of the gallery between the header
 * and the source cards. 60px tucks the dock 1px under the header, which paints
 * above it, so that seam stays covered.
 */
export const GENERATE_PROMPT_DOCK_CLASS =
  "pointer-events-none z-20 flex h-fit flex-col items-center justify-end overflow-hidden max-[767px]:fixed max-[767px]:inset-x-0 max-[767px]:bottom-14 max-[767px]:max-h-[calc(max(100dvh,100svh)-60px-3.5rem)] max-[767px]:pt-16 min-[768px]:absolute min-[768px]:inset-x-0 min-[768px]:bottom-4 min-[768px]:max-h-[calc(100%-2rem)] min-[768px]:bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,1)_90%)] min-[768px]:pt-16";

/**
 * Overlay pin. Mobile is viewport-fixed with the prompt dock so document
 * scroll can collapse Safari HUD. Desktop stays absolute on the workspace.
 * Width comes from `inset-x-0` (not `w-full`).
 */
export const GENERATE_BULK_SELECT_DOCK_CLASS =
  "from-dialog-bg pointer-events-none z-20 flex justify-center bg-linear-to-t from-10% to-transparent px-4 pt-10 pb-6 max-[767px]:fixed max-[767px]:inset-x-0 max-[767px]:bottom-14 min-[768px]:absolute min-[768px]:inset-x-0 min-[768px]:bottom-0";

/** Prompt dock slides out, then bulk-select slides in (and the reverse on exit). */
export const GENERATE_DOCK_SLIDE_MS = 300;

export const GENERATE_DOCK_SLIDE_ENTER_CLASS =
  "animate-in slide-in-from-bottom duration-300 ease-out [animation-fill-mode:both] motion-reduce:animate-none";

export const GENERATE_DOCK_SLIDE_EXIT_CLASS =
  "animate-out slide-out-to-bottom duration-300 ease-in [animation-fill-mode:forwards] motion-reduce:animate-none";

export const GENERATE_GALLERY_DOCK_OFFSET_CLASS = "pb-72 min-[768px]:pb-64";

/**
 * Figma empty gallery: top-aligned. Desktop Frame adds 40px; mobile uses the section padding only.
 * Dock offset keeps the CTA / copy scrollable above the overlay prompt box on short viewports.
 */
export const GENERATE_GALLERY_EMPTY_CLASS =
  "flex w-full justify-center  pt-10 pb-50 md:pb-60 max-[767px]:pt-0";

export const GENERATE_GALLERY_ITEMS: GenerateGalleryItem[] = defaultMediaPreviewItems.map(
  (item, index) => {
    const kind: GenerateMediaKind = index % 5 === 0 ? "video" : "image";
    return {
      ...item,
      kind,
      isNsfw: index % 3 === 0,
      prompt: item.alt ?? `Generated ${kind} ${index + 1}`,
    };
  },
);

/** Create AI realistic style intro, shown on Videos so the preview can be opened. */
export const GENERATE_PREVIEW_SAMPLE_VIDEO_ID = "create-ai-style-intro";

export function getGeneratePreviewSampleVideo(): GenerateGalleryItem {
  const poster = dummyImage(0);

  return {
    id: GENERATE_PREVIEW_SAMPLE_VIDEO_ID,
    src: poster,
    alt: "Realistic style intro",
    kind: "image",
    prompt: "Realistic style intro",
  };
}

export function getGenerateSectionTabIndex(sectionTabId: GenerateSectionTabId) {
  return Math.max(
    0,
    GENERATE_SECTION_TABS.findIndex((tab) => tab.id === sectionTabId),
  );
}

export function getGeneratePromptMedia(sectionTabId: GenerateSectionTabId): PromptBoxMedia {
  return GENERATE_SECTION_TABS.find((tab) => tab.id === sectionTabId)?.media ?? "image-presets";
}

/** Prompt box compose (picker, models, generate) is Images / Videos only. */
export function isGeneratePromptInteractive(sectionTabId: GenerateSectionTabId) {
  return sectionTabId === "images" || sectionTabId === "videos";
}

export function getGenerateCreateKind(sectionTabId: GenerateSectionTabId): GenerateMediaKind {
  return sectionTabId === "videos" ? "video" : "image";
}

export function getGenerateChooseTemplateTypeTab(slotId: GenerateSourceSlotId | "see-all") {
  if (slotId === "character") return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.characters;
  if (slotId === "video") return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.videos;
  if (slotId === "see-all" || slotId === "image") return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.images;
  return GENERATE_CHOOSE_TEMPLATE_TYPE_TAB.images;
}

function isGenerateActionSlotPicker(slotId: GenerateSourceSlotId | "see-all") {
  return slotId === "action" || slotId === "see-all";
}

function isGenerateReferenceSlotPicker(slotId: GenerateSourceSlotId | "see-all") {
  return isGenerateActionSlotPicker(slotId) || slotId === "clothing" || slotId === "location";
}

/** Image-mode Action/See all is a stills picker (not video clips). */
export function isGeneratePosePicker(
  slotId: GenerateSourceSlotId | "see-all",
  media: PromptBoxMedia,
) {
  return !isPromptBoxVideoMedia(media) && isGenerateActionSlotPicker(slotId);
}

/** Video-mode Action/See all is an action picker (moving clips, not still poses). */
export function isGenerateActionPicker(
  slotId: GenerateSourceSlotId | "see-all",
  media: PromptBoxMedia,
) {
  return isPromptBoxVideoMedia(media) && isGenerateActionSlotPicker(slotId);
}

export type GeneratePickerCatalogVariant = "characters" | "images" | "videos";

/** Dedicated pickers show one catalog (characters / stills / clips) instead of type tabs. */
export function getGeneratePickerCatalogVariant(
  slotId: GenerateSourceSlotId | "see-all",
  media: PromptBoxMedia,
): GeneratePickerCatalogVariant | null {
  if (slotId === "character") return "characters";
  if (slotId === "clothing" || slotId === "location") return "images";
  if (isGenerateActionSlotPicker(slotId)) {
    return isPromptBoxVideoMedia(media) ? "videos" : "images";
  }
  return null;
}

/** Character, pose, action, clothing, and location pickers are dedicated lists. */
export function shouldShowGenerateChooseTemplateTypeTabs(
  slotId: GenerateSourceSlotId | "see-all",
  media?: PromptBoxMedia,
) {
  if (slotId === "character" || isGenerateReferenceSlotPicker(slotId)) return false;
  if (media) return getGeneratePickerCatalogVariant(slotId, media) == null;
  return true;
}

export function getGenerateChooseTemplateTitle(
  slotId: GenerateSourceSlotId | "see-all",
  media?: PromptBoxMedia,
) {
  if (media && isGeneratePosePicker(slotId, media)) return GENERATE_POSE_PICKER_TITLE;
  if (media && isGenerateActionPicker(slotId, media)) return GENERATE_ACTION_PICKER_TITLE;
  if (slotId === "see-all") return "Select action";
  if (slotId === "image") return "Select image";
  if (slotId === "video") return "Select video";
  if (slotId === "audio") return "Select audio";
  const slot = GENERATE_SOURCE_SLOTS.find((entry) => entry.id === slotId);
  return slot ? `Select ${slot.title.toLowerCase()}` : "Select a template";
}

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

export function createGeneratedGalleryItems(payload: GenerateCreatePayload): GenerateGalleryItem[] {
  const count = Math.max(1, payload.count);
  const prompt = payload.prompt.trim() || `Generated ${payload.kind}`;
  const seeds =
    GENERATE_GALLERY_ITEMS.filter((item) => item.kind === payload.kind).length > 0
      ? GENERATE_GALLERY_ITEMS.filter((item) => item.kind === payload.kind)
      : GENERATE_GALLERY_ITEMS;

  return Array.from({ length: count }, (_, index) => {
    const seed = seeds[index % seeds.length] ?? GENERATE_GALLERY_ITEMS[0];
    const id = `generated-${payload.kind}-${Date.now()}-${index}`;

    return {
      id,
      src: seed?.src ?? "",
      alt: prompt,
      description: seed?.description,
      videoSrc: payload.kind === "video" ? seed?.videoSrc : undefined,
      kind: payload.kind,
      // Generated media is NSFW until the API returns a real rating.
      isNsfw: true,
      prompt,
    };
  });
}

export function getGenerateControlButtons(options: {
  media: PromptBoxMedia;
  aspectRatio: string;
  generationCount: string;
  resolution: string;
  duration: string;
  maxGenerationCount?: number;
  onAspectRatioChange: (value: string) => void;
  onGenerationCountChange: (value: string) => void;
  onResolutionChange: (value: string) => void;
  onDurationChange: (value: string) => void;
}): PromptBoxControlButtonConfig[] {
  const modeButton: PromptBoxControlButtonConfig = {
    kind: "image-mode",
    label: isPromptBoxVideoMedia(options.media) ? "Text to Video" : "Text to Image",
    leftIconSrc: "/assets/icons/magic-pen.svg",
    menuLabel: isPromptBoxVideoMedia(options.media) ? "Text to Video" : "Text to Image",
  };
  const aspectRatioButton: PromptBoxControlButtonConfig = {
    label: options.aspectRatio,
    leftIconSrc: "/assets/ratio.svg",
    value: options.aspectRatio,
    options: [...GENERATE_ASPECT_RATIO_OPTIONS],
    menuLabel: "Aspect ratio",
    dropdownVerticalDirection: "up",
    onValueChange: options.onAspectRatioChange,
  };

  if (isPromptBoxVideoMedia(options.media)) {
    return [
      modeButton,
      aspectRatioButton,
      {
        kind: "resolution",
        label: options.resolution,
        leftIconSrc: PROMPT_BOX_RESOLUTION_ICON_SRC,
        value: options.resolution,
        defaultValue: options.resolution,
        menuLabel: PROMPT_BOX_RESOLUTION_MENU_LABEL,
        onValueChange: options.onResolutionChange,
      },
      {
        kind: "duration",
        label: options.duration,
        leftIconSrc: "/assets/clock.svg",
        value: options.duration,
        defaultValue: options.duration,
        menuLabel: "Duration",
        onValueChange: options.onDurationChange,
      },
    ];
  }

  return [
    modeButton,
    // An edit keeps its source image's ratio, so there is nothing to pick.
    ...(options.media === "image-edit" ? [] : [aspectRatioButton]),
    {
      label: options.generationCount,
      leftIconSrc: "/assets/layer.svg",
      value: options.generationCount,
      options: getGenerateGenerationCountOptions(options.maxGenerationCount),
      menuLabel: "Number of generations",
      dropdownVerticalDirection: "up",
      showOptionIcons: false,
      onValueChange: options.onGenerationCountChange,
    },
  ];
}

export const GENERATE_ADD_AUDIO_MODAL_TITLE = "Add audio";

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

export function formatGenerateAddAudioGeneratedMeta(seconds: number, voiceLabel?: string) {
  const durationLabel = `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
  return voiceLabel ? `${durationLabel} - ${voiceLabel}` : durationLabel;
}
