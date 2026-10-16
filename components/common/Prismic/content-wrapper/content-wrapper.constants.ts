export type ContentWrapperCardVariant = "dark" | "light";

export type ContentWrapperItem = {
  id: string;
  /** Figma "Emoji" row — large label above the card title. */
  headingtitle?: string;
  title: string;
  description: ReactNode;
  iconSrc?: string;
  iconAlt?: string;
  /** @deprecated Use `headingtitle`. */
  emojiLabel?: string;
  variant?: ContentWrapperCardVariant;
};

/** Figma content-wrapper (node 3769-28721). */
export const CONTENT_WRAPPER_DEFAULT_ICON_SRC = "/assets/clapper-board.svg";
export const CONTENT_WRAPPER_CARD_WIDTH_PX = 363;

export const CONTENT_WRAPPER_DEFAULT_DESCRIPTION =
  "Experience the freedom of unrestricted, intimate dialogues with your AI companion, fostering a close and personal bond.";

export const CONTENT_WRAPPER_DEFAULT_ITEMS: ContentWrapperItem[] = [
  {
    id: "sexting",
    headingtitle: "text block",
    title: "AI Sexting conversations",
    description: CONTENT_WRAPPER_DEFAULT_DESCRIPTION,
    iconSrc: CONTENT_WRAPPER_DEFAULT_ICON_SRC,
    iconAlt: "AI Sexting conversations",
    variant: "dark",
  },
  {
    id: "video",
    headingtitle: "text block",
    title: "AI Sexting conversations",
    description: CONTENT_WRAPPER_DEFAULT_DESCRIPTION,
    iconSrc: CONTENT_WRAPPER_DEFAULT_ICON_SRC,
    iconAlt: "AI Sexting conversations",
    variant: "dark",
  },
  {
    id: "image",
    headingtitle: "text block",
    title: "AI Sexting conversations",
    description: CONTENT_WRAPPER_DEFAULT_DESCRIPTION,
    iconSrc: CONTENT_WRAPPER_DEFAULT_ICON_SRC,
    iconAlt: "AI Sexting conversations",
    variant: "light",
  },
  {
    id: "roleplay",
    headingtitle: "text block",
    title: "AI Sexting conversations",
    description: CONTENT_WRAPPER_DEFAULT_DESCRIPTION,
    iconSrc: CONTENT_WRAPPER_DEFAULT_ICON_SRC,
    iconAlt: "AI Sexting conversations",
    variant: "light",
  },
];

export const CONTENT_WRAPPER_GRID_CLASS =
  "grid w-full grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:w-[746px] md:w-[746px] m-auto";

export const CONTENT_WRAPPER_SURFACE_CLASS = "rounded-[16px] p-6";

export const CONTENT_WRAPPER_TITLE_CLASS = "text-tooltip-text text-base leading-6 font-semibold";

export const CONTENT_WRAPPER_HEADING_TITLE_CLASS =
  "text-tooltip-text text-[32px] leading-none font-semibold";

export const CONTENT_WRAPPER_DESCRIPTION_CLASS =
  "text-select-muted-text md:text-sm text-base leading-5";

export const CONTENT_WRAPPER_CARD_VARIANT_CLASS: Record<ContentWrapperCardVariant, string> = {
  dark: "bg-tooltip-default-bg",
  light: "",
};

/** Card-specific backgrounds from Figma (node 3769-28721). */
export const CONTENT_WRAPPER_CARD_ID_CLASS: Partial<Record<ContentWrapperItem["id"], string>> = {
  video: "bg-surface-strong",
  roleplay: "bg-tooltip-center-bg",
};

export function getContentWrapperCardClass(
  item: Pick<ContentWrapperItem, "id" | "variant">,
): string {
  return (
    CONTENT_WRAPPER_CARD_ID_CLASS[item.id] ??
    CONTENT_WRAPPER_CARD_VARIANT_CLASS[item.variant ?? "dark"]
  );
}
import type { ReactNode } from "react";
