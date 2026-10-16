import { resolveAsset } from "@/lib/assets/asset-store";

export const ACTION_DEFAULT_LABEL = "Clothing";

export const ACTION_DEFAULT_IMAGE_SRC = resolveAsset("demo_pics_reso").image ?? "";

export const ACTION_DEFAULT_IMAGE_SIZE = 32;

export const ACTION_VARIANTS = ["default", "premium"] as const;

export type ActionVariant = (typeof ACTION_VARIANTS)[number];

export const ACTION_DEFAULT_VARIANT: ActionVariant = "default";

export const ACTION_CROWN_ICON_SRC = "/assets/crown-filled.svg";

export const ACTION_CROWN_PADDING = 6;

/** Hover border — Tailwind Neutral 600 (`#525252` / `border-control`). */
export const ACTION_BORDER_HOVER_CLASS = "hover:border-border-control";
