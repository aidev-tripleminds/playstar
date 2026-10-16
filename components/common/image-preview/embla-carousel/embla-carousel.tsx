"use client";

import "./embla-carousel.css";

import * as React from "react";

import { cn } from "@/lib/utils";

import { defaultEmblaCarouselSlides } from "./constants";
import { EmblaCarouselMain } from "./embla-carousel-main";
import { EmblaCarouselThumbsView } from "./embla-carousel-thumbs-view";
import type { EmblaCarouselProps, EmblaCarouselSlide } from "./types";
import { useEmblaCarouselSync } from "./use-embla-carousel-sync";

export { defaultEmblaCarouselItems, defaultEmblaCarouselSlides } from "./constants";
export { EmblaCarouselMain } from "./embla-carousel-main";
export { EmblaCarouselThumb } from "./embla-carousel-thumb";
export { EmblaCarouselThumbsView } from "./embla-carousel-thumbs-view";
export type {
  EmblaCarouselMainProps,
  EmblaCarouselProps,
  EmblaCarouselSlide,
  EmblaCarouselThumbsViewProps,
  EmblaCarouselVariant,
} from "./types";
export { useEmblaCarouselSync } from "./use-embla-carousel-sync";

function resolveSlides(props: EmblaCarouselProps): EmblaCarouselSlide[] {
  if (props.items?.length) {
    return props.items;
  }

  const slideIndexes = props.slides ?? defaultEmblaCarouselSlides;

  return slideIndexes.map((index) => ({
    id: String(index),
    label: String(index + 1),
  }));
}

export function EmblaCarousel({
  slides,
  items,
  options,
  thumbsOptions,
  showThumbs = true,
  selectedIndex,
  defaultSelectedIndex,
  onSelectedIndexChange,
  onMainApiReady,
  variant = "default",
  thumbsClassName,
  className,
  ...props
}: EmblaCarouselProps) {
  const resolvedSlides = React.useMemo(() => resolveSlides({ slides, items }), [items, slides]);

  const sync = useEmblaCarouselSync({
    slides: resolvedSlides,
    mainOptions: options,
    thumbsOptions,
    selectedIndex,
    defaultSelectedIndex,
    onSelectedIndexChange,
  });

  React.useEffect(() => {
    onMainApiReady?.(sync.mainApi);
    return () => onMainApiReady?.(undefined);
  }, [onMainApiReady, sync.mainApi]);

  if (resolvedSlides.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="embla-carousel"
      data-variant={variant}
      className={cn(
        "embla-carousel",
        variant === "media-preview" && "embla-carousel--media-preview",
        className,
      )}
      {...props}
    >
      <EmblaCarouselMain
        slides={resolvedSlides}
        mainRef={sync.mainRef}
        selectedIndex={sync.selectedIndex}
        isSettled={sync.isSettled}
        variant={variant}
      />

      {showThumbs ? (
        <EmblaCarouselThumbsView
          slides={resolvedSlides}
          thumbsRef={sync.thumbsRef}
          selectedIndex={sync.selectedIndex}
          onThumbClick={sync.onThumbClick}
          variant={variant}
          className={thumbsClassName}
        />
      ) : null}
    </div>
  );
}
