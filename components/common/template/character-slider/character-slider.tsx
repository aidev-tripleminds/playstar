"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { UnblurOverlay } from "@/components/common/general/unblur-overlay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import {
  CHARACTER_SLIDER_DEFAULT_SLIDES,
  CHARACTER_SLIDER_LOCKED_CTA,
  CHARACTER_SLIDER_LOCKED_TITLE,
  type CharacterSliderSize,
  type CharacterSliderSlide,
} from "./character-slider.constants";

export type CharacterSliderProps = Omit<React.ComponentProps<"section">, "children"> & {
  size?: CharacterSliderSize;
  slides?: CharacterSliderSlide[];
  /** When true, side previews blur on the active locked slide (showcase only). */
  blurSidePreviewsOnLocked?: boolean;
  /** Prev/next chevron buttons. Default true; navigation still works via swipe/drag when hidden. */
  showArrows?: boolean;
  /** Blurred, rotated peeks of the active image behind the slide (carousel-style depth). Default true. */
  showSidePreviews?: boolean;
  /** "current / total" badge. Default true. */
  showCounter?: boolean;
  onCheckContentClick?: (slide: CharacterSliderSlide, index: number) => void;
  onSlideChange?: (index: number) => void;
};

export function CharacterSlider({
  size = "desktop",
  slides = CHARACTER_SLIDER_DEFAULT_SLIDES,
  blurSidePreviewsOnLocked = false,
  showArrows = true,
  showSidePreviews = true,
  showCounter = true,
  onCheckContentClick,
  onSlideChange,
  className,
  ...props
}: CharacterSliderProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [current, setCurrent] = React.useState(1);
  const items = slides.length > 0 ? slides : CHARACTER_SLIDER_DEFAULT_SLIDES;
  const slideHeight = size === "mobile" ? "h-[160px]" : "h-[330px]";
  const slideRadius = size === "mobile" ? "rounded-[16px]" : "rounded-[32px]";
  const lastSlideIndex = items.length - 1;
  const activeSlide = items[selectedIndex];

  const isLockedSlide = (index: number, slide: CharacterSliderSlide) => {
    if (slide.locked === true) return true;
    if (slide.locked === false) return false;
    return items.length > 1 && index === lastSlideIndex;
  };

  const showPreviousArrow = selectedIndex > 0;
  const showNextArrow = selectedIndex < lastSlideIndex;
  const showLockedSidePreviewBlur =
    blurSidePreviewsOnLocked && isLockedSlide(selectedIndex, activeSlide);
  const lockedSidePreviewImageClassName = showLockedSidePreviewBlur
    ? "scale-105 [filter:var(--blur-xxs)]"
    : "";

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      setSelectedIndex(index);
      setCurrent(index + 1);
      onSlideChange?.(index + 1);
    };

    handleSelect();
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onSlideChange]);

  return (
    <section
      data-slot="character-slider"
      data-size={size}
      aria-label="Character slider"
      className={cn(
        "relative",
        size === "mobile" ? "w-full max-w-[320px] p-2" : "w-[342px]",
        className,
      )}
      {...props}
    >
      <div className={cn("relative overflow-hidden", slideHeight, slideRadius)}>
        {showSidePreviews ? (
          <>
            <div
              data-slot="character-slider-side-preview"
              data-side="left"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1/2 left-4 z-0 h-[193px] max-h-[193px] w-[153px] max-w-[153px] -translate-y-1/2 -rotate-3 overflow-hidden opacity-20",
                slideRadius,
              )}
            >
              <Image
                src={activeSlide.imageSrc}
                alt=""
                fill
                sizes="153px"
                className={cn("object-cover object-left", lockedSidePreviewImageClassName)}
              />
            </div>

            <div
              data-slot="character-slider-side-preview"
              data-side="right"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute top-1/2 right-4 z-0 h-[193px] max-h-[193px] w-[153px] max-w-[153px] -translate-y-1/2 rotate-3 overflow-hidden opacity-20",
                slideRadius,
              )}
            >
              <Image
                src={activeSlide.imageSrc}
                alt=""
                fill
                sizes="153px"
                className={cn("object-cover object-right", lockedSidePreviewImageClassName)}
              />
            </div>
          </>
        ) : null}

        <Carousel
          setApi={setApi}
          opts={{ align: "center", loop: false, containScroll: false, duration: 0 }}
          className="relative z-10 h-full w-full [&>[data-slot=carousel-content]]:h-full"
          // When the chevron buttons are hidden they were the only focusable
          // way to reach later slides via keyboard; make the region itself
          // tabbable so arrow keys (handled by Carousel) still work.
          tabIndex={showArrows ? undefined : 0}
        >
          <CarouselContent className="ml-0 h-full items-center gap-0">
            {items.map((slide, index) => {
              const isActive = index === selectedIndex;
              const isLocked = isLockedSlide(index, slide);
              const showLockedContent = isLocked && isActive;

              return (
                <CarouselItem
                  key={slide.id}
                  className={cn(
                    "flex items-center justify-center pl-0",
                    size === "mobile" ? "basis-[88%]" : "basis-[76%]",
                    isActive ? cn("relative z-10 opacity-100", slideHeight) : "opacity-0",
                  )}
                >
                  <div
                    data-slot="character-slider-slide"
                    data-active={isActive ? "true" : "false"}
                    data-locked={isLocked ? "true" : "false"}
                    className={cn("relative h-full w-full overflow-hidden", slideRadius)}
                  >
                    {slide.videoSrc ? (
                      <video
                        src={slide.videoSrc}
                        poster={slide.posterSrc}
                        // A blurred video is muted and covered by the unblur CTA,
                        // so it loops like a card instead of offering controls.
                        controls={isActive && !slide.blurred}
                        muted={slide.blurred}
                        loop={slide.blurred}
                        preload="metadata"
                        playsInline
                        className="size-full object-contain"
                        ref={(video) => {
                          if (!video) return;
                          if (!isActive) video.pause();
                          // `autoPlay` only fires on load (and `pause()` clears it),
                          // so a blurred slide that becomes active starts here.
                          else if (slide.blurred) void video.play()?.catch(() => {});
                        }}
                      />
                    ) : (
                      <Image
                        src={slide.imageSrc}
                        alt={slide.imageAlt ?? `Character slide ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes={size === "mobile" ? "280px" : "320px"}
                        className={cn(
                          "object-cover",
                          showLockedContent ? "scale-105 [filter:var(--blur-xxs)]" : "",
                        )}
                      />
                    )}

                    {showLockedContent ? (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/20 px-4 text-center">
                        <p className="text-tooltip-text text-sm leading-7 font-medium">
                          {CHARACTER_SLIDER_LOCKED_TITLE}
                        </p>
                        <Buttons
                          type="button"
                          variant="rose"
                          size="btn-m"
                          leftIcon={false}
                          rightIcon={false}
                          label={CHARACTER_SLIDER_LOCKED_CTA}
                          className={size === "mobile" ? "w-[135px]!" : "min-w-[155px]"}
                          onClick={() => onCheckContentClick?.(slide, index)}
                        />
                      </div>
                    ) : slide.blurred ? (
                      <UnblurOverlay />
                    ) : null}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {showArrows && showPreviousArrow ? (
          <Button
            disableActiveEffect
            type="button"
            data-slot="character-slider-previous"
            variant="outline"
            size="icon-sm"
            aria-label="Previous slide"
            className="hover:bg-background-blur absolute top-1/2 left-7 z-20 size-[33px] -translate-y-1/2 touch-manipulation rounded-full border-none bg-[var(--slider-btn-bg)] text-white hover:text-white"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeftIcon />
          </Button>
        ) : null}

        {showArrows && showNextArrow ? (
          <Button
            disableActiveEffect
            type="button"
            data-slot="character-slider-next"
            variant="outline"
            size="icon-sm"
            aria-label="Next slide"
            className="hover:bg-background-blur absolute top-1/2 right-7 z-20 size-[33px] -translate-y-1/2 touch-manipulation rounded-full border-none bg-[var(--slider-btn-bg)] text-white hover:text-white"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRightIcon />
          </Button>
        ) : null}

        {showCounter ? (
          <div className="bg-count-badge-bg text-tooltip-text pointer-events-none absolute top-5 left-1/2 z-20 -translate-x-1/2 rounded-[50px] px-4 py-2 text-base leading-6 font-medium">
            {current} / {items.length}
          </div>
        ) : null}
      </div>
    </section>
  );
}
