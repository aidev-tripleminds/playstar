"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { isRemoteImageSrc } from "../components/helpers";
import type { EmblaCarouselSlide } from "./types";

type EmblaCarouselThumbProps = {
  selected: boolean;
  index: number;
  slide?: EmblaCarouselSlide;
  onClick?: () => void;
};

export function EmblaCarouselThumb({ selected, index, slide, onClick }: EmblaCarouselThumbProps) {
  const label = slide?.label ?? String(index + 1);

  const thumbSrc = slide?.thumbSrc ?? slide?.src;
  const content = thumbSrc ? (
    <span className="embla-carousel-thumbs__slide__image-wrap">
      <Image
        src={thumbSrc}
        alt={slide?.alt ?? label}
        fill
        sizes="80px"
        unoptimized={isRemoteImageSrc(thumbSrc)}
        className="embla-carousel-thumbs__slide__image"
      />
    </span>
  ) : (
    label
  );

  return (
    <div
      data-slot="embla-carousel-thumb"
      className={cn(
        "embla-carousel-thumbs__slide",
        selected && "embla-carousel-thumbs__slide--selected",
      )}
    >
      {onClick ? (
        <button
          type="button"
          aria-label={slide?.alt ?? `Go to slide ${index + 1}`}
          aria-pressed={selected}
          onClick={onClick}
          className="embla-carousel-thumbs__slide__button"
        >
          {content}
        </button>
      ) : (
        <div
          aria-hidden
          className="embla-carousel-thumbs__slide__button pointer-events-none cursor-default"
        >
          {content}
        </div>
      )}
    </div>
  );
}
