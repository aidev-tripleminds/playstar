import * as React from "react";

import { ContentWrapper } from "@/components/common/Prismic/content-wrapper";
import { cn } from "@/lib/utils";

import {
  TEXT_BLOCKS_CLASS_BY_ALIGNMENT_AND_COLUMNS,
  TEXT_BLOCKS_DEFAULT_ALIGNMENT,
  TEXT_BLOCKS_DEFAULT_COLUMNS,
  type TextBlocksAlignment,
  type TextBlocksColumns,
  type TextBlocksItem,
} from "./text-blocks.constants";

export type TextBlocksProps = Omit<React.ComponentProps<"div">, "children"> & {
  items: TextBlocksItem[];
  columns?: TextBlocksColumns;
  alignment?: TextBlocksAlignment;
};

/**
 * A row or grid of the site's standard text cards — the same `ContentWrapper`
 * cards the homepage uses for its three feature blocks, differing only in
 * column count, alignment, and (per card, via `item.variant`) background.
 *
 * Heading and CTA come from the surrounding `PrismicSection`; this is only
 * the card grid.
 */
export function TextBlocks({
  items,
  columns = TEXT_BLOCKS_DEFAULT_COLUMNS,
  alignment = TEXT_BLOCKS_DEFAULT_ALIGNMENT,
  className,
  ...props
}: TextBlocksProps) {
  if (items.length === 0) return null;

  return (
    <div
      data-slot="text-blocks"
      data-columns={columns}
      data-alignment={alignment}
      className={cn("w-full", className)}
      {...props}
    >
      <ContentWrapper
        items={items}
        className={TEXT_BLOCKS_CLASS_BY_ALIGNMENT_AND_COLUMNS[alignment][columns]}
      />
    </div>
  );
}
