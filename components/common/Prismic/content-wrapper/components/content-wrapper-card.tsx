"use client";

import { cn } from "@/lib/utils";

import {
  CONTENT_WRAPPER_CARD_WIDTH_PX,
  CONTENT_WRAPPER_DESCRIPTION_CLASS,
  CONTENT_WRAPPER_HEADING_TITLE_CLASS,
  CONTENT_WRAPPER_TITLE_CLASS,
  type ContentWrapperCardVariant,
  type ContentWrapperItem,
  getContentWrapperCardClass,
} from "../content-wrapper.constants";

export type ContentWrapperCardProps = {
  item: ContentWrapperItem;
  className?: string;
};

function resolveContentWrapperHeadingTitle(item: ContentWrapperItem): string | undefined {
  const headingTitle = item.headingtitle ?? item.emojiLabel;
  return headingTitle?.trim() ? headingTitle : undefined;
}

export function ContentWrapperCard({ item, className }: ContentWrapperCardProps) {
  const variant: ContentWrapperCardVariant = item.variant ?? "dark";
  const headingTitle = resolveContentWrapperHeadingTitle(item);

  return (
    <article
      data-slot="content-wrapper-card"
      data-variant={variant}
      data-card-id={item.id}
      className={cn(
        "mx-auto box-border flex shrink-0 flex-col gap-4 self-stretch rounded-[16px] p-6",
        getContentWrapperCardClass(item),
        className,
      )}
      style={{
        width: CONTENT_WRAPPER_CARD_WIDTH_PX,
        maxWidth: "100%",
      }}
    >
      {headingTitle ? (
        <p data-slot="content-wrapper-heading" className={CONTENT_WRAPPER_HEADING_TITLE_CLASS}>
          {headingTitle}
        </p>
      ) : null}
      {item.title.trim() ? <h3 className={CONTENT_WRAPPER_TITLE_CLASS}>{item.title}</h3> : null}
      <div className={CONTENT_WRAPPER_DESCRIPTION_CLASS}>{item.description}</div>
    </article>
  );
}
