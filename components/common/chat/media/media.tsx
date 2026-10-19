"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

const DEFAULT_IMAGE_SRC = dummyImage(74);
const DEFAULT_MEDIA_WIDTH_PX = 328;
const DEFAULT_MEDIA_HEIGHT_PX = 410;

const mediaPlayButtonVariants = cva(
  [
    "absolute z-[1] inline-flex items-center justify-center",
    "transition-opacity hover:opacity-90",
    "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "top-2 right-2",
        video: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type MediaVariant = NonNullable<VariantProps<typeof mediaPlayButtonVariants>["variant"]>;

export type MediaProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof mediaPlayButtonVariants> & {
    imageSrc?: string;
    imageAlt?: string;
    mediaWidth?: number;
    mediaHeight?: number;
    playing?: boolean;
    defaultPlaying?: boolean;
    playLabel?: string;
    pauseLabel?: string;
    onPlayingChange?: (playing: boolean) => void;
    onPlayClick?: () => void;
  };

export function Media({
  variant = "default",
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = "",
  mediaWidth = DEFAULT_MEDIA_WIDTH_PX,
  mediaHeight = DEFAULT_MEDIA_HEIGHT_PX,
  playing,
  defaultPlaying = false,
  playLabel,
  pauseLabel,
  onPlayingChange,
  onPlayClick,
  className,
  ...props
}: MediaProps) {
  const resolvedVariant: MediaVariant = variant ?? "default";

  const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);

  const isVideoVariant = resolvedVariant === "video";

  const isPlaying = isVideoVariant ? (playing ?? internalPlaying) : false;

  const resolvedActionLabel = React.useMemo(() => {
    if (!isVideoVariant) {
      return playLabel ?? "Create video";
    }

    return isPlaying ? (pauseLabel ?? "Pause video") : (playLabel ?? "Play video");
  }, [isVideoVariant, isPlaying, playLabel, pauseLabel]);

  const handlePlayToggle = React.useCallback(() => {
    if (!isVideoVariant) {
      onPlayClick?.();
      return;
    }

    const nextPlaying = !isPlaying;

    if (playing === undefined) {
      setInternalPlaying(nextPlaying);
    }

    onPlayingChange?.(nextPlaying);
    onPlayClick?.();
  }, [isVideoVariant, isPlaying, playing, onPlayingChange, onPlayClick]);

  return (
    <div
      data-slot="media"
      data-variant={resolvedVariant}
      className={cn("isolate inline-flex items-start gap-2", className)}
      {...props}
    >
      <div
        data-slot="media-preview"
        className="relative shrink-0 overflow-hidden rounded-2xl"
        style={{
          width: mediaWidth,
          height: mediaHeight,
        }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes={`${mediaWidth}px`}
        />

        <Button
          disableActiveEffect
          type="button"
          variant="ghost"
          data-slot="media-play"
          data-playing={isPlaying ? "true" : "false"}
          aria-label={resolvedActionLabel}
          aria-pressed={isVideoVariant ? isPlaying : undefined}
          onClick={handlePlayToggle}
          className={cn(
            "absolute flex h-9 w-9 items-center justify-center rounded-full border-none bg-[image:var(--gradient-rose)] p-2 shadow-none",
            "text-tooltip-text hover:bg-[image:var(--gradient-rose)] hover:opacity-90",
            mediaPlayButtonVariants({ variant: resolvedVariant }),
          )}
        >
          <Image src="/assets/play-outline.svg" alt="" width={20} height={20} />
        </Button>
      </div>
    </div>
  );
}
