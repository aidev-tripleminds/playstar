"use client";

import "@/components/common/image-preview/embla-carousel/embla-carousel.css";

import * as React from "react";

import { EmblaCarouselThumbsView } from "@/components/common/image-preview/embla-carousel/embla-carousel-thumbs-view";
import type { EmblaCarouselSlide } from "@/components/common/image-preview/embla-carousel/types";
import { cn } from "@/lib/utils";

import { defaultEmblaCarouselSlides } from "./constants";
import type { MediaPreviewCarouselProps } from "./types";
import { useMediaPreviewCarousel } from "./use-media-preview-carousel";

function resolveSlides(
  props: Pick<MediaPreviewCarouselProps, "slides" | "items">,
): EmblaCarouselSlide[] {
  if (props.items?.length) {
    return props.items;
  }

  const slideIndexes = props.slides ?? defaultEmblaCarouselSlides;

  return slideIndexes.map((index) => ({
    id: String(index),
    label: String(index + 1),
  }));
}

export function MediaPreviewCarousel({
  slides,
  items,
  options,
  selectedIndex,
  defaultSelectedIndex,
  onSelectedIndexChange,
  variant = "media-preview",
  className,
  ...props
}: MediaPreviewCarouselProps) {
  const resolvedSlides = React.useMemo(() => resolveSlides({ slides, items }), [items, slides]);

  const sync = useMediaPreviewCarousel({
    slides: resolvedSlides,
    options,
    selectedIndex,
    defaultSelectedIndex,
    onSelectedIndexChange,
  });

  if (resolvedSlides.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="media-preview-carousel"
      data-variant={variant}
      className={cn("w-full", className)}
      {...props}
    >
      <EmblaCarouselThumbsView
        slides={resolvedSlides}
        thumbsRef={sync.thumbsRef}
        selectedIndex={sync.selectedIndex}
        onThumbClick={sync.onThumbClick}
        variant={variant}
      />
    </div>
  );
}
