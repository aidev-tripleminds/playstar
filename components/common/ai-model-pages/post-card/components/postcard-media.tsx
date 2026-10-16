"use client";

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

import type { PostCardMediaProps } from "../types";
import { mediaVariants } from "../variants";

const carouselNavButtonClass =
  "border-none bg-[var(--slider-btn-bg)] text-white hover:bg-background-blur hover:text-white";

const carouselNavOutsideClass =
  "static! top-auto! right-auto! bottom-auto! left-auto! shrink-0 translate-x-0! translate-y-0!";

function CarouselSlideCounter({ current, total }: { current: number; total: number }) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "absolute top-3 left-1/2 z-[3] -translate-x-1/2",
        "bg-count-bg rounded-[50px]",
        "text-tooltip-text px-4 py-2 text-base leading-6",
      )}
    >
      {current} / {total}
    </div>
  );
}

export function PostCardMedia({ mediaSrc, mediaAlt, ratio }: PostCardMediaProps) {
  const slides = Array.isArray(mediaSrc) ? mediaSrc : [mediaSrc];
  const hasCarousel = slides.length > 1;
  const isVertical = ratio === "vertical";
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!hasCarousel) {
    return (
      <div className={cn(mediaVariants({ ratio }), "mx-auto")}>
        <Image
          src={slides[0]}
          alt={mediaAlt}
          fill
          className="object-cover"
          sizes="(max-width: 816px) 100vw, 720px"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-tooltip-default-bg relative mx-auto w-full rounded-[16px] md:rounded-[24px]",
        "flex h-[358px] items-center justify-center md:h-[550px]",
      )}
    >
      <Carousel
        opts={{ loop: false }}
        setApi={setApi}
        data-carousel-layout={isVertical ? "vertical-outside" : "overlay"}
        className={cn(
          "h-full w-full",
          isVertical
            ? "flex max-w-full items-center justify-between gap-2 px-3 md:gap-3"
            : "relative flex items-center justify-center",
        )}
      >
        {isVertical ? (
          <CarouselPrevious
            className={cn(carouselNavOutsideClass, carouselNavButtonClass, "size-[33px]")}
          />
        ) : null}

        <div className={cn(mediaVariants({ ratio }), "relative shrink-0")}>
          <CarouselContent className="ml-0 h-full">
            {slides.map((src, index) => (
              <CarouselItem
                key={`${src}-${index}`}
                className={cn("h-full basis-full pl-0", mediaVariants({ ratio }))}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={src}
                    alt={mediaAlt}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 816px) 100vw, 720px"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {!isVertical ? (
            <>
              <CarouselPrevious className={cn(carouselNavButtonClass, "left-3 size-[33px]")} />
              <CarouselNext className={cn(carouselNavButtonClass, "right-3 size-[33px]")} />
            </>
          ) : null}
        </div>

        <CarouselSlideCounter current={current} total={slides.length} />

        {isVertical ? (
          <CarouselNext
            className={cn(carouselNavOutsideClass, carouselNavButtonClass, "size-[33px]")}
          />
        ) : null}
      </Carousel>
    </div>
  );
}
