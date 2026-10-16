import type { StaticImageData } from "next/image";

import { resolveAsset } from "@/lib/assets/asset-store";

export type TokenCardVariant = "yellow" | "pink" | "blue";

/** Figma token card frame size (node 1117-14849). */
export const TOKEN_CARD_WIDTH_PX = 250;
export const TOKEN_CARD_HEIGHT_PX = 360;

export const TOKEN_CARD_COINS_TOKEN_PATH = resolveAsset("demo_pics_coins_token").image ?? "";
export const TOKEN_CARD_DEFAULT_HERO_PATH = resolveAsset("demo_pics_sugarlab_pic").image ?? "";
export const TOKEN_CARD_PINK_HERO_PATH = resolveAsset("demo_pics_2_photoroom").image ?? "";
export const TOKEN_CARD_BLUE_HERO_PATH = resolveAsset("demo_pics_blue_photoroom").image ?? "";

export type TokenCardVariantPreset = {
  variant: TokenCardVariant;
  tokenLabel: string;
  buyLabel: string;
  bonusLabel?: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  heroImageClassName?: string;
};

/** Figma Image Token modals — token-card (node 1117-14849). */
export const TOKEN_CARD_VARIANT_PRESETS: Record<TokenCardVariant, TokenCardVariantPreset> = {
  yellow: {
    variant: "yellow",
    tokenLabel: "1,450 TOKENS",
    buyLabel: "Buy for $29.99",
    imageSrc: TOKEN_CARD_DEFAULT_HERO_PATH,
    imageAlt: "Token pack — yellow tier",
  },
  pink: {
    variant: "pink",
    tokenLabel: "4,025 TOKENS",
    buyLabel: "Buy for $69.99",
    bonusLabel: "3,500 + 525 BONUS",
    imageSrc: TOKEN_CARD_PINK_HERO_PATH,
    imageAlt: "Token pack — pink tier",
    heroImageClassName: "top-[25px]! right-0! bottom-0! left-0! h-full! w-full!",
  },
  blue: {
    variant: "blue",
    tokenLabel: "6,250 TOKENS",
    buyLabel: "Buy for $99.99",
    bonusLabel: "5,000 + 1,250 BONUS",
    imageSrc: TOKEN_CARD_BLUE_HERO_PATH,
    imageAlt: "Token pack — blue tier",
  },
};

/** Per-variant gradients from `globals.css` (Figma token cards). */
export const TOKEN_CARD_GRADIENT_VARS: Record<TokenCardVariant, string> = {
  yellow: "var(--token-card-yellow-gradient)",
  pink: "var(--token-card-red-gradient)",
  blue: "var(--token-card-blue-gradient)",
};

export const TOKEN_CARD_HEADER_TEXT_CLASS: Record<TokenCardVariant, string> = {
  yellow: "text-[#121212]",
  pink: "text-white",
  blue: "text-white",
};
