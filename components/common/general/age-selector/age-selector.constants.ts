/** Figma Age selector `24371:101360` — ages 18 through 99, 22 selected. */
export const AGE_SELECTOR_MIN_AGE = 18;
export const AGE_SELECTOR_MAX_AGE = 99;
export const AGE_SELECTOR_DEFAULT_VALUE = 22;

export const AGE_SELECTOR_AGES: readonly number[] = Array.from(
  { length: AGE_SELECTOR_MAX_AGE - AGE_SELECTOR_MIN_AGE + 1 },
  (_, index) => AGE_SELECTOR_MIN_AGE + index,
);

/** Each age cell — 80×52 (12px vertical padding, 24/28 type). */
export const AGE_SELECTOR_ITEM_WIDTH_PX = 80;

/** Edge fade — 80×52, transparent to `#0E0E0E`. */
export const AGE_SELECTOR_FADE_WIDTH_PX = 80;
export const AGE_SELECTOR_FADE_HEIGHT_PX = 52;

/** Fixed center pill. The numbers slide underneath it. */
export const AGE_SELECTOR_SELECTED_BG = "#3A1026";

/** Selection marker — 20×14, Colors/Pink/500 fill, 2px black stroke, 2px radius. */
export const AGE_SELECTOR_POINTER_WIDTH_PX = 20;
export const AGE_SELECTOR_POINTER_HEIGHT_PX = 14;
export const AGE_SELECTOR_POINTER_FILL = "#F6339A";
export const AGE_SELECTOR_POINTER_STROKE = "#000000";
