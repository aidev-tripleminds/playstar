"use client";

import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import type { TokenCardProps } from "../token-card";
import { TokenCard } from "../token-card";
import { TOKEN_CARD_WIDTH_PX, type TokenCardVariant } from "../token-card.constants";

export const TOKEN_CARD_CAROUSEL_VARIANTS: TokenCardVariant[] = ["yellow", "pink", "blue"];

const DEFAULT_AUTO_SCROLL_MS = 4000;

export type TokenCardCarouselProps = {
  variants?: TokenCardVariant[];
  className?: string;
  /** Auto-advance interval on mobile; set to 0 to disable. */
  autoScrollIntervalMs?: number;
  /** When false, carousel unmounts. Used while parent dialogs finish opening. */
  active?: boolean;
  cardOverrides?: Partial<Record<TokenCardVariant, Partial<TokenCardProps>>>;
};

function useCarouselRefresh(api: CarouselApi | undefined, active: boolean) {
  React.useEffect(() => {
    if (!api || !active) return;

    const refresh = () => api.reInit();

    refresh();
    const frame = window.requestAnimationFrame(refresh);
    const timeout = window.setTimeout(refresh, 350);

    const viewport = api.rootNode();
    const resizeObserver =
      viewport && typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : undefined;
    resizeObserver?.observe(viewport);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      resizeObserver?.disconnect();
    };
  }, [active, api]);
}

function TokenCardSlide({
  variant,
  cardOverrides,
}: {
  variant: TokenCardVariant;
  cardOverrides?: TokenCardCarouselProps["cardOverrides"];
}) {
  return <TokenCard variant={variant} {...cardOverrides?.[variant]} />;
}

export function TokenCardCarousel({
  variants = TOKEN_CARD_CAROUSEL_VARIANTS,
  className,
  autoScrollIntervalMs = DEFAULT_AUTO_SCROLL_MS,
  active = true,
  cardOverrides,
}: TokenCardCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();

  const autoplayPlugin = React.useMemo(
    () =>
      Autoplay({
        delay: autoScrollIntervalMs,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        playOnInit: true,
      }),
    [autoScrollIntervalMs],
  );

  const plugins = autoScrollIntervalMs > 0 ? [autoplayPlugin] : undefined;

  useCarouselRefresh(api, active);

  React.useEffect(() => {
    if (!api || !active || autoScrollIntervalMs <= 0) return;
    autoplayPlugin.play();
  }, [active, api, autoScrollIntervalMs, autoplayPlugin]);

  return (
    <div data-slot="token-card-carousel" className={cn("w-full", className)}>
      <div className="getslide-mob w-full overflow-visible pt-8 max-md:block md:hidden">
        {active ? (
          <Carousel
            setApi={setApi}
            opts={{
              loop: true,
              align: "start",
              containScroll: "trimSnaps",
              dragFree: false,
              duration: 28,
            }}
            plugins={plugins}
            className="w-full pl-4"
            aria-label="Token packs"
          >
            <CarouselContent className="ml-0">
              {variants.map((variant) => (
                <CarouselItem
                  key={variant}
                  className="shrink-0 grow-0 basis-auto pl-0 first:ml-3"
                  style={{ width: TOKEN_CARD_WIDTH_PX }}
                >
                  <TokenCardSlide variant={variant} cardOverrides={cardOverrides} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : null}
      </div>

      <div className="hidden items-stretch justify-center gap-4 overflow-visible pt-5 md:flex lg:flex-wrap">
        {variants.map((variant) => (
          <TokenCard
            key={variant}
            variant={variant}
            className="mx-auto"
            {...cardOverrides?.[variant]}
          />
        ))}
      </div>
    </div>
  );
}
