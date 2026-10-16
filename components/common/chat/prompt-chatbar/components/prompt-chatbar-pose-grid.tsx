"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { PoseSelect } from "@/components/common/chat/pose-select/pose-select";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import type { PromptChatbarPose } from "../types";

const CLIP_TOLERANCE_PX = 1;

function isPartiallyClippedInContainer(
  element: HTMLElement,
  container: HTMLElement,
  tolerance = CLIP_TOLERANCE_PX,
): boolean {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return (
    elementRect.left < containerRect.left - tolerance ||
    elementRect.right > containerRect.right + tolerance
  );
}

function getRevealScrollDelta(
  slide: HTMLElement,
  viewport: HTMLElement,
  tolerance = CLIP_TOLERANCE_PX,
): number | null {
  const slideRect = slide.getBoundingClientRect();
  const viewportRect = viewport.getBoundingClientRect();

  if (slideRect.left < viewportRect.left - tolerance) {
    return slideRect.left - viewportRect.left;
  }

  if (slideRect.right > viewportRect.right + tolerance) {
    return slideRect.right - viewportRect.right;
  }

  return null;
}

function revealClippedSlide(api: CarouselApi | undefined, slideNode: HTMLElement): boolean {
  if (!api) return false;

  const viewport = api.rootNode();
  const delta = getRevealScrollDelta(slideNode, viewport);
  if (delta === null) return false;

  api.internalEngine().scrollTo.distance(delta, false);
  return true;
}

function ensureEdgeSlideFullyVisible(api: CarouselApi | undefined): void {
  if (!api) return;

  const selectedIndex = api.selectedScrollSnap();
  const slideNodes = api.slideNodes();
  const viewport = api.rootNode();
  const lastIndex = slideNodes.length - 1;

  if (selectedIndex <= 0) {
    api.scrollTo(0);
    return;
  }

  if (selectedIndex >= lastIndex) {
    api.scrollTo(lastIndex);

    const lastSlide = slideNodes[lastIndex];
    if (lastSlide && viewport) {
      revealClippedSlide(api, lastSlide);
    }
  }
}

const DESKTOP_POSE_CAROUSEL_MAX_WIDTH = "max-w-[680px]";

const poseGridVariants = cva("w-full min-w-0", {
  variants: {
    placement: {
      desktop: cn("hidden md:block", DESKTOP_POSE_CAROUSEL_MAX_WIDTH),
      // mobile: "grid gap-x-2 gap-y-4 md:hidden w-fit",4
      mobile: "md:hidden",
    },
  },
  defaultVariants: {
    placement: "desktop",
  },
});

export type PromptChatbarPoseGridPlacement = NonNullable<
  VariantProps<typeof poseGridVariants>["placement"]
>;

export type PromptChatbarPoseGridSharedSelection = {
  selectedPoseId: string | null;
  onPoseSelect: (poseId: string, selected: boolean) => void;
  clearSelection: () => void;
};

export type PromptChatbarPoseGridProps = VariantProps<typeof poseGridVariants> & {
  poses: PromptChatbarPose[];
  className?: string;
  /** Share one selection between desktop and mobile grids rendered together. */
  sharedSelection?: PromptChatbarPoseGridSharedSelection;
  onPoseSelectedChange?: (poseId: string, selected: boolean) => void;
};

export function usePromptChatbarPoseGridSelection(
  poses: PromptChatbarPose[],
  onPoseSelectedChange?: (poseId: string, selected: boolean) => void,
): PromptChatbarPoseGridSharedSelection {
  const [selectedPoseId, setSelectedPoseId] = React.useState<string | null>(
    () => poses.find((pose) => pose.selected)?.id ?? null,
  );

  const onPoseSelect = React.useCallback(
    (poseId: string, selected: boolean) => {
      const previousId = selectedPoseId;

      if (selected) {
        setSelectedPoseId(poseId);
        if (previousId && previousId !== poseId) {
          onPoseSelectedChange?.(previousId, false);
        }
        onPoseSelectedChange?.(poseId, true);
        return;
      }

      if (previousId === poseId) {
        setSelectedPoseId(null);
        onPoseSelectedChange?.(poseId, false);
      }
    },
    [onPoseSelectedChange, selectedPoseId],
  );

  const clearSelection = React.useCallback(() => {
    if (!selectedPoseId) return;

    onPoseSelectedChange?.(selectedPoseId, false);
    setSelectedPoseId(null);
  }, [onPoseSelectedChange, selectedPoseId]);

  return { selectedPoseId, onPoseSelect, clearSelection };
}

function resolvePosesWithSelection(
  poses: PromptChatbarPose[],
  selectedPoseId: string | null,
): PromptChatbarPose[] {
  return poses.map((pose) => ({
    ...pose,
    selected: pose.id === selectedPoseId,
  }));
}

function PromptChatbarPoseGridMobile({
  poses,
  className,
  onPoseSelect,
}: {
  poses: PromptChatbarPose[];
  className?: string;
  onPoseSelect: (poseId: string, selected: boolean) => void;
}) {
  return (
    <div
      data-slot="prompt-chatbar-scene-grid"
      data-placement="mobile"
      aria-label="Select a pose"
      className={cn(
        "scrollbar-hidden grid w-full min-w-0 touch-pan-x grid-flow-col grid-rows-2 justify-start gap-x-2 gap-y-4 overflow-x-auto overflow-y-hidden overscroll-x-contain md:hidden",
        className,
      )}
    >
      {poses.map((pose) => (
        <PoseSelect
          key={pose.id}
          label={pose.label}
          imageSrc={pose.imageSrc}
          selected={pose.selected}
          className="shrink-0"
          onSelectedChange={(selected) => onPoseSelect(pose.id, selected)}
        />
      ))}
    </div>
  );
}

function PromptChatbarPoseGridDesktop({
  poses,
  className,
  onPoseSelect,
}: {
  poses: PromptChatbarPose[];
  className?: string;
  onPoseSelect: (poseId: string, selected: boolean) => void;
}) {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [selectedSnap, setSelectedSnap] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(1);
  const carouselNavButtonClass =
    "border-none bg-[var(--slider-btn-bg)] text-white hover:bg-background-blur hover:text-white";

  const scrollToPose = React.useCallback(
    (index: number) => {
      if (!carouselApi) return;

      const clampedIndex = Math.max(0, Math.min(index, poses.length - 1));
      carouselApi.scrollTo(clampedIndex);
    },
    [carouselApi, poses.length],
  );

  React.useEffect(() => {
    if (!carouselApi) return;

    const handleCarouselUpdate = () => {
      ensureEdgeSlideFullyVisible(carouselApi);
      setSelectedSnap(carouselApi.selectedScrollSnap());
      setSnapCount(carouselApi.scrollSnapList().length);
    };

    carouselApi.on("select", handleCarouselUpdate);
    carouselApi.on("settle", handleCarouselUpdate);
    carouselApi.on("reInit", handleCarouselUpdate);
    handleCarouselUpdate();

    const handleResize = () => {
      carouselApi.reInit();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      carouselApi.off("select", handleCarouselUpdate);
      carouselApi.off("settle", handleCarouselUpdate);
      carouselApi.off("reInit", handleCarouselUpdate);
      window.removeEventListener("resize", handleResize);
    };
  }, [carouselApi]);

  const showPrev = selectedSnap > 0;
  const showNext = selectedSnap < snapCount - 1;

  const handlePoseClick = React.useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!carouselApi) return;

      const slideNode = carouselApi.slideNodes()[index];
      const viewport = carouselApi.rootNode();
      if (!slideNode || !viewport) return;

      if (!isPartiallyClippedInContainer(slideNode, viewport)) return;

      event.preventDefault();
      revealClippedSlide(carouselApi, slideNode);
    },
    [carouselApi],
  );

  return (
    <Carousel
      setApi={setCarouselApi}
      data-slot="prompt-chatbar-scene-grid"
      data-placement="desktop"
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        loop: false,
      }}
      className={cn(poseGridVariants({ placement: "desktop" }), className)}
      aria-label="Select a pose"
    >
      <CarouselContent className="mr-0 ml-0 gap-4">
        {poses.map((pose, index) => (
          <CarouselItem key={pose.id} className="basis-auto pl-0">
            <PoseSelect
              label={pose.label}
              imageSrc={pose.imageSrc}
              selected={pose.selected}
              className="shrink-0"
              onClick={handlePoseClick(index)}
              onSelectedChange={(selected) => onPoseSelect(pose.id, selected)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {showNext ? (
        <CarouselNext
          className={cn(carouselNavButtonClass, "absolute top-9 right-2 z-20 size-[33px]")}
          onClick={(event) => {
            event.preventDefault();
            if (!carouselApi) return;
            scrollToPose(carouselApi.selectedScrollSnap() + 1);
          }}
        />
      ) : null}
      {showPrev ? (
        <CarouselPrevious
          className={cn(
            carouselNavButtonClass,
            "absolute top-9 left-3 z-20 size-[33px] cursor-pointer",
          )}
          onClick={(event) => {
            event.preventDefault();
            if (!carouselApi) return;
            scrollToPose(carouselApi.selectedScrollSnap() - 1);
          }}
        />
      ) : null}
    </Carousel>
  );
}

export function PromptChatbarPoseGrid({
  placement = "desktop",
  poses,
  className,
  sharedSelection,
  onPoseSelectedChange,
}: PromptChatbarPoseGridProps) {
  const internalSelection = usePromptChatbarPoseGridSelection(poses, onPoseSelectedChange);
  const resolvedSelection = sharedSelection ?? internalSelection;
  const resolvedPoses = resolvePosesWithSelection(poses, resolvedSelection.selectedPoseId);

  if (placement === "mobile") {
    return (
      <PromptChatbarPoseGridMobile
        poses={resolvedPoses}
        className={className}
        onPoseSelect={resolvedSelection.onPoseSelect}
      />
    );
  }

  return (
    <PromptChatbarPoseGridDesktop
      poses={resolvedPoses}
      className={className}
      onPoseSelect={resolvedSelection.onPoseSelect}
    />
  );
}
