import type { EmblaOptionsType } from "embla-carousel";
import type * as React from "react";

import type {
  EmblaCarouselSlide,
  EmblaCarouselVariant,
} from "@/components/common/image-preview/embla-carousel/types";

export type MediaPreviewCarouselProps = Omit<React.ComponentProps<"div">, "children"> & {
  slides?: number[];
  items?: EmblaCarouselSlide[];
  options?: EmblaOptionsType;
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  variant?: EmblaCarouselVariant;
};
