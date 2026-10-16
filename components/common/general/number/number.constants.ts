export const NUMBER_VARIANTS = ["filled", "hollow"] as const;

export type NumberVariant = (typeof NUMBER_VARIANTS)[number];

export const NUMBER_DEFAULT_VARIANT: NumberVariant = "filled";
export const NUMBER_DEFAULT_VALUE = "1";

/** Figma Number — 18×18 circle. */
export const NUMBER_SIZE_PX = 18;
