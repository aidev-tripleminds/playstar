"use client";

import { cn } from "@/lib/utils";

import { EmblaCarouselThumb } from "./embla-carousel-thumb";
import type { EmblaCarouselThumbsViewProps } from "./types";

export function EmblaCarouselThumbsView({
  slides,
  thumbsRef,
  selectedIndex,
  onThumbClick,
  variant = "default",
  className,
}: EmblaCarouselThumbsViewProps) {
  return (
    <div
      data-slot="embla-carousel-thumbs"
      className={cn(
        "embla-carousel-thumbs",
        variant === "media-preview" && "embla-carousel-thumbs--media-preview",
        className,
      )}
    >
      <div className="embla-carousel-thumbs__viewport" ref={thumbsRef}>
        <div className="embla-carousel-thumbs__container">
          {slides.map((slide, index) => (
            <EmblaCarouselThumb
              key={slide.id}
              index={index}
              slide={slide}
              selected={index === selectedIndex}
              onClick={onThumbClick ? () => onThumbClick(index) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
