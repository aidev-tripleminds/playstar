"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import { CONTENT_WRAPPER_TITLE_CLASS } from "../content-wrapper";
import {
  ACCORDION_BLOCK_BODY_CLASS,
  ACCORDION_BLOCK_BODY_COLOR,
  ACCORDION_BLOCK_CONTENT_CLASS,
  ACCORDION_BLOCK_DEFAULT_ITEMS,
  ACCORDION_BLOCK_ITEM_CLASS,
  ACCORDION_BLOCK_LIST_CLASS,
  ACCORDION_BLOCK_MIN_HEIGHT_PX,
  ACCORDION_BLOCK_PADDING_PX,
  ACCORDION_BLOCK_TRIGGER_CLASS,
  ACCORDION_BLOCK_WIDTH_PX,
  type AccordionBlockItem,
} from "./accordion-block.constants";

export type AccordionBlockProps = React.ComponentProps<"section"> & {
  items?: AccordionBlockItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function AccordionBlock({
  items = ACCORDION_BLOCK_DEFAULT_ITEMS,
  defaultValue,
  value,
  onValueChange,
  className,
  ...props
}: AccordionBlockProps) {
  if (items.length === 0) return null;

  return (
    <section data-slot="accordion-block" className={cn("m-auto w-full", className)} {...props}>
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        className={ACCORDION_BLOCK_LIST_CLASS}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={ACCORDION_BLOCK_ITEM_CLASS}
            style={{
              width: ACCORDION_BLOCK_WIDTH_PX,
              minWidth: ACCORDION_BLOCK_WIDTH_PX,
              minHeight: ACCORDION_BLOCK_MIN_HEIGHT_PX,
              maxWidth: "100%",
              padding: ACCORDION_BLOCK_PADDING_PX,
            }}
          >
            <AccordionTrigger
              className={cn(ACCORDION_BLOCK_TRIGGER_CLASS, CONTENT_WRAPPER_TITLE_CLASS)}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent className={ACCORDION_BLOCK_CONTENT_CLASS}>
              <div
                className={ACCORDION_BLOCK_BODY_CLASS}
                style={{ color: ACCORDION_BLOCK_BODY_COLOR }}
              >
                {item.content}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
