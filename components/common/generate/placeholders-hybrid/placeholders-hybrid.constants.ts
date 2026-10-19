import { dummyImage } from "@/lib/dummy-images";

export const PLACEHOLDERS_HYBRID_STATUSES = ["empty", "loaded", "audio"] as const;

export type PlaceholdersHybridStatus = (typeof PLACEHOLDERS_HYBRID_STATUSES)[number];

export const PLACEHOLDERS_HYBRID_DEFAULT_STATUS: PlaceholdersHybridStatus = "empty";

export const PLACEHOLDERS_HYBRID_DEFAULT_TITLE = "Character";

export const PLACEHOLDERS_HYBRID_DEFAULT_SUBTITLE = "Required";

export const PLACEHOLDERS_HYBRID_DEFAULT_AUDIO_LABEL = "Audio";

export const PLACEHOLDERS_HYBRID_DEFAULT_IMAGE_SRC = dummyImage(123);

export const PLACEHOLDERS_HYBRID_PLAY_ICON_SRC = "/assets/play.svg";

export const PLACEHOLDERS_HYBRID_PAUSE_ICON_SRC = "/assets/pause.svg";

/** Master / Storybook card size — Empty / Loaded / Audio variants (240×320). */
export const PLACEHOLDERS_HYBRID_WIDTH = 240;

export const PLACEHOLDERS_HYBRID_HEIGHT = 320;

/** Desktop size in promptbox-hybrid (160×210). */
export const PLACEHOLDERS_HYBRID_DESKTOP_WIDTH = 160;

export const PLACEHOLDERS_HYBRID_DESKTOP_HEIGHT = 210;

/** Mobile Figma card size — promptbox-hybrid mobile (140×190). */
export const PLACEHOLDERS_HYBRID_MOBILE_WIDTH = 140;

export const PLACEHOLDERS_HYBRID_MOBILE_HEIGHT = 190;

export const PLACEHOLDERS_HYBRID_SIZES = ["fixed", "desktop", "mobile", "fluid"] as const;

export type PlaceholdersHybridSize = (typeof PLACEHOLDERS_HYBRID_SIZES)[number];

/** Master / Storybook size — matches master component 240×320. */
export const PLACEHOLDERS_HYBRID_SIZE_CLASS =
  "box-border h-[320px] min-h-[320px] max-h-[320px] w-[240px] min-w-[240px] max-w-[240px]";

/** Desktop size in promptbox-hybrid — 160×210. */
export const PLACEHOLDERS_HYBRID_DESKTOP_SIZE_CLASS =
  "box-border h-[210px] min-h-[210px] max-h-[210px] w-[160px] min-w-[160px] max-w-[160px]";

/** Mobile size — Figma 18196:34214 (140×190). */
export const PLACEHOLDERS_HYBRID_MOBILE_SIZE_CLASS =
  "box-border h-[190px] min-h-[190px] max-h-[190px] w-[140px] min-w-[140px] max-w-[140px]";

/** Fills parent (e.g. promptbox-hybrid grid cell) while keeping 3:4. */
export const PLACEHOLDERS_HYBRID_FLUID_SIZE_CLASS =
  "box-border aspect-[3/4] h-auto min-h-0 w-full min-w-0 max-w-none self-start";

/**
 * Dark base (`--dialog-bg`) under the Figma white wash.
 * `!` beats native `<button>` UA `background-color` on the empty state.
 */

export const PLACEHOLDERS_HYBRID_BORDER_FILLED_CLASS = "border-2 border-solid border-tooltip-text";

/**
 * Decorative waveform bar heights in px for the Audio status.
 * Mirrors Figma / Anima rectangle heights (stretch bars ≈ 28px inside the 36px row).
 */
export const PLACEHOLDERS_HYBRID_WAVEFORM_HEIGHTS_PX = [
  28, 12, 14, 18, 12, 16, 18, 10, 12, 4, 8, 12, 14, 18, 12, 16, 18, 10, 12, 4, 8, 28, 12, 14, 18,
  12, 16, 18, 10, 12, 28, 12, 14, 18, 12, 16, 18, 10, 12, 4, 8, 28, 12, 14, 18, 12, 16, 18, 10, 12,
  4, 8, 12, 14, 18, 12, 16, 18, 10, 12, 4, 8, 28, 12, 14, 18, 12, 16, 18, 10, 12, 28, 12, 14, 18,
  12, 16, 18, 10, 12, 4, 8,
] as const;
