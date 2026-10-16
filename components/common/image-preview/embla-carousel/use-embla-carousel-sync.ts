"use client";

import type { EmblaCarouselType } from "embla-carousel";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import * as React from "react";

import type { EmblaCarouselSlide } from "./types";

const defaultThumbsOptions: EmblaOptionsType = {
  containScroll: false,
  dragFree: true,
  align: "center",
  duration: 25,
};

type UseEmblaCarouselSyncOptions = {
  slides: EmblaCarouselSlide[];
  mainOptions?: EmblaOptionsType;
  thumbsOptions?: EmblaOptionsType;
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
};

export function useEmblaCarouselSync({
  slides,
  mainOptions,
  thumbsOptions = defaultThumbsOptions,
  selectedIndex: selectedIndexProp,
  defaultSelectedIndex = 0,
  onSelectedIndexChange,
}: UseEmblaCarouselSyncOptions) {
  const [internalSelectedIndex, setInternalSelectedIndex] = React.useState(defaultSelectedIndex);
  const selectedIndex = selectedIndexProp ?? internalSelectedIndex;
  // While settled, inactive slides can be hidden to avoid 1px sub-pixel peeks.
  const [isSettled, setIsSettled] = React.useState(true);

  const [mainRef, mainApi] = useEmblaCarousel(mainOptions);
  const [thumbsRef, thumbsApi] = useEmblaCarousel(thumbsOptions);

  const setSelectedIndex = React.useCallback(
    (index: number) => {
      if (selectedIndexProp === undefined) {
        setInternalSelectedIndex(index);
      }

      onSelectedIndexChange?.(index);
    },
    [onSelectedIndexChange, selectedIndexProp],
  );

  const syncThumbsToIndex = React.useCallback(
    (index: number) => {
      if (!thumbsApi) {
        return;
      }

      if (thumbsApi.selectedScrollSnap() !== index) {
        thumbsApi.scrollTo(index);
      }
    },
    [thumbsApi],
  );

  const onThumbClick = React.useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi],
  );

  const onMainSelect = React.useCallback(() => {
    if (!mainApi) {
      return;
    }

    const nextIndex = mainApi.selectedScrollSnap();
    setSelectedIndex(nextIndex);
    syncThumbsToIndex(nextIndex);
  }, [mainApi, setSelectedIndex, syncThumbsToIndex]);

  React.useEffect(() => {
    if (!mainApi) {
      return;
    }

    const onPointerDown = () => setIsSettled(false);
    const onSelect = () => {
      setIsSettled(false);
      onMainSelect();
    };
    const onSettle = () => setIsSettled(true);

    mainApi.on("pointerDown", onPointerDown);
    mainApi.on("select", onSelect);
    mainApi.on("settle", onSettle);
    mainApi.on("reInit", onMainSelect);

    const frameId = window.requestAnimationFrame(() => {
      onMainSelect();
      setIsSettled(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      mainApi.off("pointerDown", onPointerDown);
      mainApi.off("select", onSelect);
      mainApi.off("settle", onSettle);
      mainApi.off("reInit", onMainSelect);
    };
  }, [mainApi, onMainSelect]);

  React.useEffect(() => {
    if (!thumbsApi || !mainApi) {
      return;
    }

    syncThumbsToIndex(mainApi.selectedScrollSnap());

    const onThumbsReInit = () => {
      syncThumbsToIndex(mainApi.selectedScrollSnap());
    };

    thumbsApi.on("reInit", onThumbsReInit);

    return () => {
      thumbsApi.off("reInit", onThumbsReInit);
    };
  }, [mainApi, syncThumbsToIndex, thumbsApi]);

  React.useEffect(() => {
    if (!mainApi || selectedIndexProp === undefined) {
      return;
    }

    if (mainApi.selectedScrollSnap() !== selectedIndexProp) {
      mainApi.scrollTo(selectedIndexProp);
    }
  }, [mainApi, selectedIndexProp]);

  React.useEffect(() => {
    syncThumbsToIndex(selectedIndex);
  }, [selectedIndex, syncThumbsToIndex]);

  const scrollPrev = React.useCallback(() => {
    mainApi?.scrollPrev();
  }, [mainApi]);

  const scrollNext = React.useCallback(() => {
    mainApi?.scrollNext();
  }, [mainApi]);

  return {
    slides,
    selectedIndex,
    isSettled,
    mainRef,
    mainApi: mainApi as EmblaCarouselType | undefined,
    thumbsRef,
    thumbsApi: thumbsApi as EmblaCarouselType | undefined,
    onThumbClick,
    scrollPrev,
    scrollNext,
  };
}
