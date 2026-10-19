import { dummyImage } from "@/lib/dummy-images";
export const PLACEHOLDER_DEFAULT_TITLE = "Character";

export const PLACEHOLDER_DEFAULT_SUBTITLE = "Optional";

export const PLACEHOLDER_DEFAULT_IMAGE_SRC = dummyImage(122);

export const PLACEHOLDER_MOBILE_WIDTH = 69;

export const PLACEHOLDER_MOBILE_HEIGHT = 80;

export const PLACEHOLDER_DESKTOP_WIDTH = 73;

export const PLACEHOLDER_DESKTOP_HEIGHT = 96;

/** W/H used when the prompt-box sources row is a 4-column mobile grid. */
export const PLACEHOLDER_MOBILE_ASPECT_RATIO = `${PLACEHOLDER_MOBILE_WIDTH}/${PLACEHOLDER_MOBILE_HEIGHT}`;

/**
 * Standalone / desktop: fixed Figma size (69×80 mobile, 73×96 desktop).
 * Inside a narrow prompt box, fill one 4-column cell at the same 69/80 ratio.
 */
export const PLACEHOLDER_SIZE_CLASS =
  "box-border h-[80px] min-h-[80px] max-h-[80px] w-[69px] min-w-[69px] max-w-[69px] md:h-[96px] md:min-h-[96px] md:max-h-[96px] md:w-[73px] md:min-w-[73px] md:max-w-[73px] @max-[639px]/prompt-box:!h-auto @max-[639px]/prompt-box:!min-h-0 @max-[639px]/prompt-box:!max-h-none @max-[639px]/prompt-box:!w-full @max-[639px]/prompt-box:!min-w-0 @max-[639px]/prompt-box:!max-w-none @max-[639px]/prompt-box:aspect-[69/80]";

export const PLACEHOLDER_BORDER_DEFAULT_CLASS = "border border-dashed border-border-control";

export const PLACEHOLDER_BORDER_HOVER_CLASS = "hover:border-gray-text";

export const PLACEHOLDER_BORDER_SELECTED_CLASS = "border border-solid border-tooltip-text";
