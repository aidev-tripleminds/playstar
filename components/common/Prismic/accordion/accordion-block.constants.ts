/** Figma Accordion (node 2096-16506). */
export const ACCORDION_BLOCK_WIDTH_PX = 342;
export const ACCORDION_BLOCK_MIN_HEIGHT_PX = 56;
export const ACCORDION_BLOCK_PADDING_PX = 16;

export const ACCORDION_BLOCK_DEFAULT_TITLE = "This is my accordion text";

export const ACCORDION_BLOCK_DEFAULT_CONTENT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export type AccordionBlockItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export const ACCORDION_BLOCK_DEFAULT_ITEMS: AccordionBlockItem[] = [
  {
    id: "accordion-1",
    title: ACCORDION_BLOCK_DEFAULT_TITLE,
    content: ACCORDION_BLOCK_DEFAULT_CONTENT,
  },
];

export const ACCORDION_BLOCK_ITEM_CLASS =
  "box-border rounded-[16px] border border-surface-strong bg-tooltip-default-bg not-last:border-b-0";

export const ACCORDION_BLOCK_LIST_CLASS = "flex w-full flex-col gap-2";

export const ACCORDION_BLOCK_TRIGGER_CLASS =
  "items-center py-0 hover:no-underline focus-visible:ring-0 **:data-[slot=accordion-trigger-icon]:text-tooltip-text **:data-[slot=accordion-trigger-icon]:size-5";

export const ACCORDION_BLOCK_CONTENT_CLASS = "h-auto pt-2 pb-0";

export const ACCORDION_BLOCK_BODY_COLOR = "var(--modal-text)";

export const ACCORDION_BLOCK_BODY_CLASS = "text-base leading-6 text-modal-text";
import type { ReactNode } from "react";
