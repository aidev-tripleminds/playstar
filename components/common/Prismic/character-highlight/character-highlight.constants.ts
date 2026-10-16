import { resolveAsset } from "@/lib/assets/asset-store";
/** Figma Character Highlight (node 3030-73433). */
export const CHARACTER_HIGHLIGHT_DEFAULT_LABEL = "Katarina";
export const CHARACTER_HIGHLIGHT_DEFAULT_CATEGORY_LABEL = "Pornstars";
export const CHARACTER_HIGHLIGHT_DEFAULT_LIVE_LABEL = "Live";
export const CHARACTER_HIGHLIGHT_DEFAULT_IMAGE_SRC = resolveAsset("demo_pics_katarina").image ?? "";
export const CHARACTER_HIGHLIGHT_VERIFIED_ICON_SRC = "/assets/verified-badge.svg";

export type CharacterHighlightLabelType = "name" | "verified" | "live";
