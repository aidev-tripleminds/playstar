import {
  PROMPT_BOX_DEFAULT_IMAGE_PRESET_PLACEHOLDERS,
  PROMPT_BOX_DEFAULT_MOBILE_CONTROL_BUTTONS,
  PROMPT_BOX_DEFAULT_PRESET_ACTIONS,
  PROMPT_BOX_DEFAULT_TOKEN_COST,
  PROMPT_BOX_PRESETS_CONTROL_LABEL,
  PROMPT_BOX_SEE_ALL_LABEL,
} from "@/components/common/generate/prompt-box/prompt-box.constants";

import type {
  MobilePromptbarActionItem,
  MobilePromptbarControlButton,
  MobilePromptbarPlaceholderSlot,
} from "./mobile-promptbar.types";

export const MOBILE_PROMPTBAR_SEE_ALL_LABEL = PROMPT_BOX_SEE_ALL_LABEL;

export const MOBILE_PROMPTBAR_PRESETS_LABEL = PROMPT_BOX_PRESETS_CONTROL_LABEL;

export const MOBILE_PROMPTBAR_SETTINGS_LABEL = "Settings";

export const MOBILE_PROMPTBAR_GENERATE_LABEL = "Generate";

export const MOBILE_PROMPTBAR_DEFAULT_TOKEN_COST = PROMPT_BOX_DEFAULT_TOKEN_COST;

export const MOBILE_PROMPTBAR_PRESETS_ICON_SRC = "/assets/icons/magic-pen.svg";

/**
 * Fade and 16px padding are mobile-only so the shell does not draw a padded
 * box around PromptBox on desktop (Figma `16127:97342`).
 *
 * Do not use unprefixed `min-h-0 max-h-full` — the generate dock is `h-fit` on
 * mobile, and iOS Safari collapses that chain to 0 height.
 *
 * Do not set `touch-action: none` on this shell. The used value is the
 * intersection of the touched element and its ancestors, so it would cancel
 * the textarea's `touch-pan-y` and the action strip's `touch-pan-x`. Swipes
 * that are not those scrolls are cancelled in the touchmove listener.
 */
export const MOBILE_PROMPTBAR_SHELL_CLASS =
  "flex w-full flex-col gap-2 overflow-visible max-[767px]:bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,1)_70.2%)] max-[767px]:px-4 max-[767px]:pb-8 min-[768px]:min-h-0 min-[768px]:max-h-full";

/**
 * Same fade as the compact frame (Figma `24355:188202`): transparent at the
 * cards, solid only at 70% of the bar, so the pill's drop shadow still reads
 * on the gallery. A fade that turned solid in 24px plus extra top padding
 * painted a black band over the gallery.
 *
 * The dock sits on `bottom-14`, which overlaps the nav pill. 29px of bottom
 * padding leaves the 8px gap between the compact pill and the nav.
 */
export const MOBILE_PROMPTBAR_COMPACT_SHELL_CLASS =
  "max-[767px]:!bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,1)_70%)] max-[767px]:!pb-[29px]";

export const MOBILE_PROMPTBAR_DEFAULT_PLACEHOLDERS: MobilePromptbarPlaceholderSlot[] =
  PROMPT_BOX_DEFAULT_IMAGE_PRESET_PLACEHOLDERS;

export const MOBILE_PROMPTBAR_DEFAULT_ACTIONS: MobilePromptbarActionItem[] =
  PROMPT_BOX_DEFAULT_PRESET_ACTIONS;

export const MOBILE_PROMPTBAR_DEFAULT_CONTROL_BUTTONS: MobilePromptbarControlButton[] =
  PROMPT_BOX_DEFAULT_MOBILE_CONTROL_BUTTONS;
