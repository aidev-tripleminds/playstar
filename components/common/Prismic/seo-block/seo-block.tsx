import * as React from "react";

import { cn } from "@/lib/utils";

import {
  CONTENT_WRAPPER_SURFACE_CLASS,
  CONTENT_WRAPPER_TITLE_CLASS,
  ContentWrapper,
} from "../content-wrapper";
import {
  SEO_BLOCK_BODY_CLASS,
  SEO_BLOCK_BODY_COLOR,
  SEO_BLOCK_DEFAULT_BODY,
  SEO_BLOCK_DEFAULT_TITLE,
  SEO_BLOCK_MIN_HEIGHT_PX,
  SEO_BLOCK_SURFACE_CLASS,
  SEO_BLOCK_WIDTH_PX,
} from "./seo-block.constants";

export type SeoBlockProps = Omit<
  React.ComponentProps<typeof ContentWrapper>,
  "children" | "items"
> & {
  title?: string;
  body?: string;
};

export function SeoBlock({
  title = SEO_BLOCK_DEFAULT_TITLE,
  body = SEO_BLOCK_DEFAULT_BODY,
  className,
  ...props
}: SeoBlockProps) {
  const hasTitle = title.trim().length > 0;
  const hasBody = body.trim().length > 0;

  if (!hasTitle && !hasBody) return null;

  return (
    <ContentWrapper items={[]} className={cn("block w-full", className)} {...props}>
      <article
        data-slot="seo-block"
        className={cn(CONTENT_WRAPPER_SURFACE_CLASS, SEO_BLOCK_SURFACE_CLASS)}
        style={{
          width: SEO_BLOCK_WIDTH_PX,
          minWidth: SEO_BLOCK_WIDTH_PX,
          minHeight: SEO_BLOCK_MIN_HEIGHT_PX,
          maxWidth: "100%",
        }}
      >
        {hasTitle ? <h2 className={CONTENT_WRAPPER_TITLE_CLASS}>{title}</h2> : null}
        {hasBody ? (
          <p className={SEO_BLOCK_BODY_CLASS} style={{ color: SEO_BLOCK_BODY_COLOR }}>
            {body}
          </p>
        ) : null}
      </article>
    </ContentWrapper>
  );
}
