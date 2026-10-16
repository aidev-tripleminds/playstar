export const ACTION_CONTENT_CARD_VARIANTS = [
  "default",
  "loaded",
  "two",
  "three",
  "overflow",
] as const;

export type ActionContentCardVariant = (typeof ACTION_CONTENT_CARD_VARIANTS)[number];

export const ACTION_CONTENT_CARD_DEFAULT_VARIANT: ActionContentCardVariant = "default";
export const ACTION_CONTENT_CARD_DEFAULT_IMAGE_SRC = "/assets/action-cards/preview.webp";
export const ACTION_CONTENT_CARD_ADD_LABEL = "Add action";
export const ACTION_CONTENT_CARD_DEFAULT_OVERFLOW_COUNT = 4;

/** Figma `24098:81328` — 35×44, radius 6. */
export const ACTION_CONTENT_CARD_WIDTH_PX = 35;
export const ACTION_CONTENT_CARD_HEIGHT_PX = 44;
export const ACTION_CONTENT_CARD_RADIUS_PX = 6;

/** Figma stack `gap: -26`. */
export const ACTION_CONTENT_CARD_OVERLAP_PX = 26;

/**
 * Left-to-right fan on `24098:81326`. Bounding boxes are a 35×44 card at
 * 0°, 7.04°, -3.22°, and 7.04°.
 */
export const ACTION_CONTENT_CARD_STACK_ROTATIONS_DEG = [0, 7.04, -3.22, 7.04] as const;

/** Figma loaded footer — transparent to `#0E0E0E` at 80%, then 0.8 fill opacity. */
export const ACTION_CONTENT_CARD_SCRIM =
  "linear-gradient(180deg, rgba(14, 14, 14, 0) 0%, rgba(14, 14, 14, 0.8) 80%)";

/** Figma overflow card — `#171717` to `#404040`. */
export const ACTION_CONTENT_CARD_OVERFLOW_BACKGROUND =
  "linear-gradient(180deg, #171717 0%, #404040 100%)";
