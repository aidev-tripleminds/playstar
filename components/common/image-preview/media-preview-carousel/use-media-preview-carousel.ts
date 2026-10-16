"use client";

import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";

import type { EmblaCarouselSlide } from "@/components/common/image-preview/embla-carousel/types";

const defaultCarouselOptions: EmblaOptionsType = {
  containScroll: false,
  dragFree: true,
  align: "center",
  duration: 25,
};

type UseMediaPreviewCarouselOptions = {
  slides: EmblaCarouselSlide[];
  options?: EmblaOptionsType;
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
};

export function useMediaPreviewCarousel({
  slides,
  options = defaultCarouselOptions,
  selectedIndex: selectedIndexProp,
  defaultSelectedIndex = 0,
  onSelectedIndexChange,
}: UseMediaPreviewCarouselOptions) {
  const [internalSelectedIndex, setInternalSelectedIndex] = React.useState(defaultSelectedIndex);
  const selectedIndex = selectedIndexProp ?? internalSelectedIndex;

  const [thumbsRef, thumbsApi] = useEmblaCarousel(options);

  const setSelectedIndex = React.useCallback(
    (index: number) => {
      if (selectedIndexProp === undefined) {
        setInternalSelectedIndex(index);
      }

      onSelectedIndexChange?.(index);
    },
    [onSelectedIndexChange, selectedIndexProp],
  );

  const onThumbClick = React.useCallback(
    (index: number) => {
      setSelectedIndex(index);
    },
    [setSelectedIndex],
  );

  React.useEffect(() => {
    if (!thumbsApi) {
      return;
    }

    if (thumbsApi.selectedScrollSnap() !== selectedIndex) {
      thumbsApi.scrollTo(selectedIndex);
    }
  }, [selectedIndex, thumbsApi]);

  React.useEffect(() => {
    if (!thumbsApi || selectedIndexProp === undefined) {
      return;
    }

    if (thumbsApi.selectedScrollSnap() !== selectedIndexProp) {
      thumbsApi.scrollTo(selectedIndexProp);
    }
  }, [selectedIndexProp, thumbsApi]);

  return {
    slides,
    selectedIndex,
    thumbsRef,
    thumbsApi,
    onThumbClick,
  };
}
