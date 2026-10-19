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
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

import { CardShell, ProfileContent, useProfile } from "./shared";

const sliderImages = [
  dummyImage(112),
  dummyImage(113),
  dummyImage(114),
  dummyImage(115),
  dummyImage(116),
];

function SliderStateContent() {
  const { name } = useProfile();
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(1);
  const isDesktop = useIsDesktop();

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    onSelect();

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      <Carousel opts={{ duration: 12 }} setApi={setApi} className="h-full w-full">
        <CarouselContent className="ml-0 h-full">
          {sliderImages.map((src, index) => (
            <CarouselItem key={`${src}-${index}`} className="h-[504px] basis-full pl-0">
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`${name} ${index + 1}`}
                  fill
                  // sizes="380px"
                  priority={index === 0}
                  className="object-cover"
                />

                {/* bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-[image:var(--gradient-overlay-dark)]" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {isDesktop && (
          <>
            <CarouselPrevious className="hover:bg-background-blur left-3 border-none bg-[var(--slider-btn-bg)] text-white hover:text-white" />
            <CarouselNext className="hover:bg-background-blur right-3 border-none bg-[var(--slider-btn-bg)] text-white hover:text-white" />
          </>
        )}
      </Carousel>

      {/* Fixed Counter */}
      <div className="bg-count-bg text-tooltip-text absolute top-3 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-2 text-base">
        {current} / {sliderImages.length}
      </div>

      {/* Fixed Bottom Content */}
      <div className="absolute right-0 bottom-0 left-0 z-10">
        <ProfileContent />
      </div>
    </>
  );
}

export function SliderState() {
  return (
    <CardShell
      className={cn(
        "bg-dialog-bg relative overflow-hidden rounded-[24px] p-0",
        /* Slide-first mount (tw-animate: no fade-in → enter opacity stays 1) */
        "animate-in slide-in-from-right-5 duration-150 ease-out motion-reduce:animate-none",
      )}
    >
      <SliderStateContent />
    </CardShell>
  );
}
