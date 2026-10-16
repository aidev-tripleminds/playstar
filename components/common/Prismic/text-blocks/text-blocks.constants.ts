import type { ContentWrapperItem } from "@/components/common/Prismic/content-wrapper";

/**
 * How many columns the cards form on desktop. The homepage runs the same card
 * component at three widths — one wide card, a 2-up grid, and a 3-up row — so
 * this is one slice with a column choice rather than three near-identical
 * slice types (the same reasoning R10 applies to the feature-boxes grid).
 */
export type TextBlocksColumns = "1" | "2" | "3";

/** Left-aligned heading/cards (the default) vs. centered. */
export type TextBlocksAlignment = "left" | "centered";

/**
 * Byte-identical to HOMEPAGE_FEATURE_CONTENT_WRAPPER_CLASS. Duplicated rather
 * than imported because a shared `components/common/*` module must not depend
 * on a page's private `_lib`; `text-blocks.test.tsx` asserts they stay
 * identical.
 */
export const TEXT_BLOCKS_BASE_CLASS =
  "!m-0 w-full max-w-none md:w-full lg:w-full [&_[data-slot=content-wrapper-card]]:!m-0 [&_[data-slot=content-wrapper-card]]:items-start [&_[data-slot=content-wrapper-card]]:text-left [&_[data-slot=content-wrapper-card]]:!w-full [&_[data-slot=content-wrapper-card]]:!max-w-none";

/**
 * "2" is the base class with no column override — the grid's own default —
 * matching how the homepage's feature GRID block is styled.
 */
export const TEXT_BLOCKS_CLASS_BY_COLUMNS = {
  "1": `${TEXT_BLOCKS_BASE_CLASS} md:grid-cols-1`,
  "2": TEXT_BLOCKS_BASE_CLASS,
  "3": `${TEXT_BLOCKS_BASE_CLASS} md:grid-cols-3`,
} as const satisfies Record<TextBlocksColumns, string>;

/** Same as `TEXT_BLOCKS_BASE_CLASS`, centering each card's content instead of left-aligning it. */
export const TEXT_BLOCKS_CENTERED_BASE_CLASS =
  "!m-0 w-full max-w-none md:w-full lg:w-full justify-items-center [&_[data-slot=content-wrapper-card]]:!m-0 [&_[data-slot=content-wrapper-card]]:items-center [&_[data-slot=content-wrapper-card]]:text-center [&_[data-slot=content-wrapper-card]]:!w-full [&_[data-slot=content-wrapper-card]]:!max-w-none";

export const TEXT_BLOCKS_CENTERED_CLASS_BY_COLUMNS = {
  "1": `${TEXT_BLOCKS_CENTERED_BASE_CLASS} md:grid-cols-1`,
  "2": TEXT_BLOCKS_CENTERED_BASE_CLASS,
  "3": `${TEXT_BLOCKS_CENTERED_BASE_CLASS} md:grid-cols-3`,
} as const satisfies Record<TextBlocksColumns, string>;

export const TEXT_BLOCKS_CLASS_BY_ALIGNMENT_AND_COLUMNS = {
  left: TEXT_BLOCKS_CLASS_BY_COLUMNS,
  centered: TEXT_BLOCKS_CENTERED_CLASS_BY_COLUMNS,
} as const satisfies Record<TextBlocksAlignment, Record<TextBlocksColumns, string>>;

export const TEXT_BLOCKS_DEFAULT_COLUMNS: TextBlocksColumns = "2";
export const TEXT_BLOCKS_DEFAULT_ALIGNMENT: TextBlocksAlignment = "left";

export type TextBlocksItem = ContentWrapperItem;
