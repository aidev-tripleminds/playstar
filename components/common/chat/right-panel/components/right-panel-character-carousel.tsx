"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const HERO_MIN_HEIGHT_CLASS = "min-h-[400px]";

function RightPanelCarouselNavButton({
  direction,
  label,
  onClick,
  disabled,
  className,
}: {
  direction: "previous" | "next";
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-tooltip-text inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-black",
        "focus-visible:ring-border-focus transition-colors focus-visible:ring-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      <Icon className="size-6 shrink-0" aria-hidden />
    </button>
  );
}
export type RightPanelCharacterCarouselProps = {
  images: readonly string[];
  /** 1-based slide index for controlled usage. */
  carouselIndex?: number;
  onCarouselIndexChange?: (index: number) => void;
  className?: string;
};

export function RightPanelCharacterCarousel({
  images,
  carouselIndex,

  onCarouselIndexChange,
  className,
}: RightPanelCharacterCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const slides = images.filter((src) => src.length > 0);
  const [current, setCurrent] = React.useState(1);

  const carouselNavButtonClass =
    "border-none bg-[var(--slider-btn-bg)] text-white hover:bg-background-blur hover:text-white";

  const handleSetApi = React.useCallback((newApi: CarouselApi) => {
    setApi(newApi);
    if (newApi) {
      setCurrent(newApi.selectedScrollSnap() + 1);
    }
  }, []);

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      onCarouselIndexChange?.(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api, onCarouselIndexChange]);

  React.useEffect(() => {
    if (!api || carouselIndex === undefined || slides.length === 0) return;

    const targetIndex = Math.max(0, Math.min(carouselIndex - 1, slides.length - 1));
    if (api.selectedScrollSnap() !== targetIndex) {
      api.scrollTo(targetIndex);
    }
  }, [api, carouselIndex, slides.length]);

  if (slides.length === 0) {
    return (
      <div
        data-slot="right-panel-hero"
        className={cn("relative w-full", HERO_MIN_HEIGHT_CLASS, className)}
      />
    );
  }

  return (
    <div
      data-slot="right-panel-hero"
      className={cn("relative w-full", HERO_MIN_HEIGHT_CLASS, className)}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className={cn(
          "relative w-full overflow-hidden rounded-[24px] md:rounded-[0px]",
          HERO_MIN_HEIGHT_CLASS,
        )}
        aria-label="Character photos"
      >
        <CarouselContent className={cn("ml-0 gap-0", HERO_MIN_HEIGHT_CLASS)}>
          {slides.map((src, index) => (
            <CarouselItem
              key={`${src}-${index}`}
              className={cn("basis-full pl-0", HERO_MIN_HEIGHT_CLASS)}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-[24px] md:rounded-[0px]",
                  HERO_MIN_HEIGHT_CLASS,
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="396px"
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className={cn(carouselNavButtonClass, "left-3 size-[33px]")} />
        <CarouselNext className={cn(carouselNavButtonClass, "right-3 size-[33px]")} />
        <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-linear-to-b from-black/10 via-transparent to-black/40" />
        <div className="bg-count-bg text-tooltip-text absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-2 text-[16px] leading-6">
          {current} / {slides.length}
        </div>
      </Carousel>
    </div>
  );
}

export type RightPanelGroupHeroProps = {
  memberAvatars: readonly string[];
  className?: string;
};

export function RightPanelGroupHero({ memberAvatars, className }: RightPanelGroupHeroProps) {
  return (
    <div
      data-slot="right-panel-hero"
      className={cn("relative flex w-full justify-center px-4 pt-4", className)}
    >
      <div className="flex items-center pr-1.5">
        {memberAvatars.map((src, index) => (
          <span
            key={`${src}-${index}`}
            className={cn(
              "border-tooltip-default-bg bg-border-strong relative size-12 shrink-0 overflow-hidden rounded-full border-2",
              index > 0 && "-ml-1.5",
            )}
            style={{ zIndex: memberAvatars.length - index }}
          >
            {src ? <Image src={src} alt="" fill sizes="48px" className="object-cover" /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
