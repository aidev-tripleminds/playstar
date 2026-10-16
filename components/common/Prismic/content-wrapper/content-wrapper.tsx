import * as React from "react";

import { cn } from "@/lib/utils";

import { ContentWrapperCard } from "./components";
import {
  CONTENT_WRAPPER_DEFAULT_ITEMS,
  CONTENT_WRAPPER_GRID_CLASS,
  type ContentWrapperItem,
} from "./content-wrapper.constants";

export type ContentWrapperProps = React.ComponentProps<"section"> & {
  items?: ContentWrapperItem[];
  children?: React.ReactNode;
};

export function ContentWrapper({ items, children, className, ...props }: ContentWrapperProps) {
  const resolvedItems = items ?? (children ? [] : CONTENT_WRAPPER_DEFAULT_ITEMS);

  if (resolvedItems.length === 0 && !children) return null;

  return (
    <section
      data-slot="content-wrapper"
      className={cn(CONTENT_WRAPPER_GRID_CLASS, className)}
      {...props}
    >
      {children}
      {resolvedItems.map((item) => (
        <ContentWrapperCard key={item.id} item={item} />
      ))}
    </section>
  );
}
