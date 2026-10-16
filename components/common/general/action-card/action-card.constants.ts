export const ACTION_CARD_SIZES = ["desktop", "mobile"] as const;
export const ACTION_CARD_STATUSES = ["default", "add"] as const;

export type ActionCardSize = (typeof ACTION_CARD_SIZES)[number];
export type ActionCardStatus = (typeof ACTION_CARD_STATUSES)[number];

export const ACTION_CARD_DEFAULT_SIZE: ActionCardSize = "desktop";
export const ACTION_CARD_DEFAULT_STATUS: ActionCardStatus = "default";
export const ACTION_CARD_DEFAULT_NAME = "Lorem Ipsum";
export const ACTION_CARD_DEFAULT_IMAGE_SRC = "/assets/action-cards/preview.webp";
export const ACTION_CARD_ADD_LABEL = "Add";

/** Figma Size=Desktop — 220×330, radius 24. */
export const ACTION_CARD_DESKTOP_WIDTH_PX = 220;
export const ACTION_CARD_DESKTOP_HEIGHT_PX = 330;

/** Figma Size=Mobile — 175×255, radius 12. */
export const ACTION_CARD_MOBILE_WIDTH_PX = 175;
export const ACTION_CARD_MOBILE_HEIGHT_PX = 255;
