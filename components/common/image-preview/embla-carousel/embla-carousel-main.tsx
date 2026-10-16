"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { isRemoteImageSrc } from "../components/helpers";
import type { EmblaCarouselMainProps, EmblaCarouselSlide } from "./types";

type EmblaCarouselSlideMediaProps = {
  slide: EmblaCarouselSlide;
  index: number;
  isSelected: boolean;
  isMediaPreview: boolean;
};

function EmblaCarouselSlideMedia({
  slide,
  index,
  isSelected,
  isMediaPreview,
}: EmblaCarouselSlideMediaProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const mediaClassName = cn(
    "embla-carousel__slide__image",
    isMediaPreview && "embla-carousel__slide__image--media-preview",
  );

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !slide.videoSrc) return;

    if (isSelected) {
      void video.play()?.catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isSelected, slide.videoSrc]);

  if (slide.videoSrc) {
    return (
      <video
        ref={videoRef}
        className={mediaClassName}
        autoPlay={isSelected}
        muted
        loop
        playsInline
        preload={isSelected ? "auto" : "metadata"}
        aria-label={slide.alt ?? slide.label ?? `Slide ${index + 1}`}
      >
        <source src={slide.videoSrc} type="video/mp4" />
      </video>
    );
  }

  if (slide.src) {
    return (
      <Image
        src={slide.src}
        alt={slide.alt ?? slide.label ?? `Slide ${index + 1}`}
        fill
        priority={index === 0}
        unoptimized={isRemoteImageSrc(slide.src)}
        className={mediaClassName}
        sizes="(max-width: 768px) 100vw, 70vw"
      />
    );
  }

  return <>{slide.label ?? index + 1}</>;
}

export function EmblaCarouselMain({
  slides,
  mainRef,
  selectedIndex = 0,
  isSettled = true,
  variant = "default",
  className,
}: EmblaCarouselMainProps) {
  const isMediaPreview = variant === "media-preview";

  return (
    <div
      data-slot="embla-carousel-main"
      data-settled={isMediaPreview ? (isSettled ? "true" : "false") : undefined}
      className={cn("embla-carousel__viewport", className)}
      ref={mainRef}
    >
      <div className="embla-carousel__container">
        {slides.map((slide, index) => {
          const isSelected = index === selectedIndex;

          return (
            <div
              className={cn(
                "embla-carousel__slide",
                isSelected && "embla-carousel__slide--selected",
              )}
              key={slide.id}
            >
              <div
                className={cn(
                  "embla-carousel__slide__content relative",
                  isMediaPreview && "embla-carousel__slide__content--media-preview",
                )}
              >
                <EmblaCarouselSlideMedia
                  slide={slide}
                  index={index}
                  isSelected={isSelected}
                  isMediaPreview={isMediaPreview}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
