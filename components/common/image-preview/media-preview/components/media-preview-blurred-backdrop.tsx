"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { isRemoteImageSrc } from "../../components/helpers";

type MediaPreviewBlurredBackdropVariant = "media-preview" | "homepage-banner";

type MediaPreviewBlurredBackdropProps = {
  src: string | StaticImageData;
  className?: string;
  imageClassName?: string;
  variant?: MediaPreviewBlurredBackdropVariant;
};

const IMAGE_CLASS_BY_VARIANT: Record<MediaPreviewBlurredBackdropVariant, string> = {
  "media-preview":
    "scale-150 object-cover blur-[50px] brightness-[0.25] saturate-150 md:blur-[80px]",
  "homepage-banner": "scale-125 object-cover blur-[40px]",
};

export function MediaPreviewBlurredBackdrop({
  src,
  className,
  imageClassName,
  variant = "media-preview",
}: MediaPreviewBlurredBackdropProps) {
  return (
    <div
      aria-hidden
      data-slot="media-preview-blurred-backdrop"
      data-variant={variant}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <Image
        src={src}
        alt=""
        fill
        unoptimized={isRemoteImageSrc(src)}
        className={cn(IMAGE_CLASS_BY_VARIANT[variant], imageClassName)}
        sizes="100vw"
      />
    </div>
  );
}
