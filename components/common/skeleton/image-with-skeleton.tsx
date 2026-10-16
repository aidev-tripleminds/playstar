"use client";

import Image, { type ImageProps } from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { MediaSkeletonOverlay } from "./media-skeleton-overlay";

function getImageSrcKey(src: ImageProps["src"]): string {
  if (typeof src === "string") {
    return src;
  }

  if ("src" in src) {
    return src.src;
  }

  return src.default.src;
}

export type ImageWithSkeletonProps = ImageProps & {
  /** Extra classes for the overlay `Skeleton` (size/radius default to the image box). */
  skeletonClassName?: string;
  /** Extra classes for the positioned wrapper around the image + skeleton. */
  wrapperClassName?: string;
};

/**
 * Next.js `Image` that stays hidden under a same-size skeleton until the
 * optimized bitmap is actually ready (`onLoad` / `onLoadingComplete`).
 * Changing `src` shows the skeleton again.
 */
export function ImageWithSkeleton({
  src,
  alt,
  fill,
  className,
  style,
  skeletonClassName,
  wrapperClassName,
  onLoad,
  onLoadingComplete,
  onError,
  ...props
}: ImageWithSkeletonProps) {
  const srcKey = getImageSrcKey(src);
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
  const isLoaded = loadedSrc === srcKey;

  const markLoaded = React.useCallback(() => {
    setLoadedSrc(srcKey);
  }, [srcKey]);

  return (
    <span
      data-slot="image-with-skeleton"
      data-loaded={isLoaded ? "true" : "false"}
      className={cn(
        fill ? "absolute inset-0" : "relative inline-block",
        "overflow-hidden rounded-[inherit]",
        wrapperClassName,
      )}
    >
      <Image
        {...props}
        src={src}
        alt={alt}
        fill={fill}
        className={cn(
          "transition-opacity duration-300 motion-reduce:transition-none",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        style={{
          ...style,
          ...(!isLoaded ? { opacity: 0 } : null),
        }}
        onLoad={(event) => {
          markLoaded();
          onLoad?.(event);
        }}
        onLoadingComplete={(img) => {
          markLoaded();
          onLoadingComplete?.(img);
        }}
        onError={(event) => {
          markLoaded();
          onError?.(event);
        }}
      />
      <MediaSkeletonOverlay isLoaded={isLoaded} skeletonClassName={skeletonClassName} />
    </span>
  );
}
