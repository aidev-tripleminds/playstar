import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import type { StaticImageData } from "next/image";
import type * as React from "react";

export type EmblaCarouselSlide = {
  id: string | number;
  label?: string;
  src?: string | StaticImageData;
  videoSrc?: string;
  /** Small still for the thumbnail strip; falls back to `src`. */
  thumbSrc?: string;
  alt?: string;
};

export type EmblaCarouselVariant = "default" | "media-preview";

export type EmblaCarouselProps = Omit<React.ComponentProps<"div">, "children"> & {
  slides?: number[];
  items?: EmblaCarouselSlide[];
  options?: EmblaOptionsType;
  thumbsOptions?: EmblaOptionsType;
  showThumbs?: boolean;
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  onMainApiReady?: (api: EmblaCarouselType | undefined) => void;
  variant?: EmblaCarouselVariant;
  thumbsClassName?: string;
};

export type EmblaCarouselMainProps = {
  slides: EmblaCarouselSlide[];
  mainRef: (node: HTMLElement | null) => void;
  selectedIndex?: number;
  /** When true, inactive media-preview slides are hidden to prevent edge peeks. */
  isSettled?: boolean;
  variant?: EmblaCarouselVariant;
  className?: string;
};

export type EmblaCarouselThumbsViewProps = {
  slides: EmblaCarouselSlide[];
  thumbsRef: (node: HTMLElement | null) => void;
  selectedIndex: number;
  onThumbClick?: (index: number) => void;
  variant?: EmblaCarouselVariant;
  className?: string;
};
