"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { MediaSkeletonOverlay } from "./media-skeleton-overlay";

export type VideoWithSkeletonProps = Omit<React.ComponentProps<"video">, "src"> & {
  src: string;
  sourceType?: string;
  skeletonClassName?: string;
  wrapperClassName?: string;
};

/**
 * Card video that stays hidden (and shows a skeleton) until a frame can paint.
 * When `src` changes the overlay returns until the new clip is ready.
 */
export const VideoWithSkeleton = React.forwardRef<HTMLVideoElement, VideoWithSkeletonProps>(
  function VideoWithSkeleton(
    {
      src,
      sourceType = "video/mp4",
      className,
      skeletonClassName,
      wrapperClassName,
      preload = "auto",
      onCanPlay,
      onLoadedData,
      onError,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const [readySrc, setReadySrc] = React.useState<string | null>(null);
    const isLoaded = readySrc === src;

    const markLoaded = React.useCallback(() => {
      setReadySrc(src);
    }, [src]);

    const setVideoRef = React.useCallback(
      (video: HTMLVideoElement | null) => {
        if (typeof forwardedRef === "function") {
          forwardedRef(video);
        } else if (forwardedRef) {
          forwardedRef.current = video;
        }

        if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          markLoaded();
        }
      },
      [forwardedRef, markLoaded],
    );

    return (
      <span
        data-slot="video-with-skeleton"
        data-loaded={isLoaded ? "true" : "false"}
        className={cn("absolute inset-0 overflow-hidden rounded-[inherit]", wrapperClassName)}
      >
        <video
          {...props}
          key={src}
          ref={setVideoRef}
          src={children ? undefined : src}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-300 motion-reduce:transition-none",
            isLoaded ? "opacity-100" : "opacity-0",
            className,
          )}
          preload={preload}
          onCanPlay={(event) => {
            markLoaded();
            onCanPlay?.(event);
          }}
          onLoadedData={(event) => {
            markLoaded();
            onLoadedData?.(event);
          }}
          onError={(event) => {
            markLoaded();
            onError?.(event);
          }}
        >
          {children ?? <source src={src} type={sourceType} />}
        </video>
        <MediaSkeletonOverlay isLoaded={isLoaded} skeletonClassName={skeletonClassName} />
      </span>
    );
  },
);
