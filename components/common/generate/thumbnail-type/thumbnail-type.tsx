import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { CheckpointThumbnail, type CheckpointThumbnailVariant } from "../checkpoint-thumbnail";
import {
  THUMBNAIL_TYPE_DEFAULT_CHECKPOINT_VARIANT,
  THUMBNAIL_TYPE_DEFAULT_ICON_SRC,
  THUMBNAIL_TYPE_DEFAULT_IMAGE_SRC,
  THUMBNAIL_TYPE_DEFAULT_SIZE,
  THUMBNAIL_TYPE_DEFAULT_TYPE,
  THUMBNAIL_TYPE_ICON_PADDING_RATIO,
  THUMBNAIL_TYPE_LABELS,
  type ThumbnailTypeKind,
} from "./thumbnail-type.constants";

export type ThumbnailTypeProps = Omit<React.ComponentProps<"span">, "children" | "role"> & {
  type?: ThumbnailTypeKind;
  size?: number;
  imageSrc?: string;
  imageAlt?: string;
  iconSrc?: string;
  checkpointVariant?: CheckpointThumbnailVariant;
  alt?: string;
};

export function ThumbnailType({
  type = THUMBNAIL_TYPE_DEFAULT_TYPE,
  size = THUMBNAIL_TYPE_DEFAULT_SIZE,
  imageSrc = THUMBNAIL_TYPE_DEFAULT_IMAGE_SRC,
  imageAlt,
  iconSrc = THUMBNAIL_TYPE_DEFAULT_ICON_SRC,
  checkpointVariant = THUMBNAIL_TYPE_DEFAULT_CHECKPOINT_VARIANT,
  alt,
  className,
  ...props
}: ThumbnailTypeProps) {
  if (type === "checkpoint") {
    return (
      <CheckpointThumbnail
        variant={checkpointVariant}
        size={size}
        alt={alt ?? THUMBNAIL_TYPE_LABELS.checkpoint}
        className={cn("rounded-[12px]", className)}
        data-slot="thumbnail-type"
        data-type={type}
        {...props}
      />
    );
  }

  const iconPadding = Math.round(size * THUMBNAIL_TYPE_ICON_PADDING_RATIO);
  const iconInnerSize = size - iconPadding * 2;
  const ariaLabel =
    alt ??
    (type === "picture" ? (imageAlt ?? THUMBNAIL_TYPE_LABELS.picture) : THUMBNAIL_TYPE_LABELS.icon);

  return (
    <span
      data-slot="thumbnail-type"
      data-type={type}
      role="img"
      aria-label={ariaLabel}
      className={cn("relative inline-flex shrink-0 overflow-hidden rounded-[12px]", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {type === "picture" ? (
        <Image
          src={imageSrc}
          alt=""
          aria-hidden
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span
          className="flex size-full items-center justify-center bg-[image:var(--gradient-thumbnail-type-icon)]"
          style={{ padding: iconPadding }}
        >
          <Image
            src={iconSrc}
            alt=""
            aria-hidden
            width={iconInnerSize}
            height={iconInnerSize}
            className="shrink-0 object-contain"
          />
        </span>
      )}
    </span>
  );
}

export {
  THUMBNAIL_TYPE_DEFAULT_CHECKPOINT_VARIANT,
  THUMBNAIL_TYPE_DEFAULT_ICON_SRC,
  THUMBNAIL_TYPE_DEFAULT_IMAGE_SRC,
  THUMBNAIL_TYPE_DEFAULT_SIZE,
  THUMBNAIL_TYPE_DEFAULT_TYPE,
  THUMBNAIL_TYPE_ICON_PADDING_RATIO,
  THUMBNAIL_TYPE_LABELS,
  THUMBNAIL_TYPE_TYPES,
  type ThumbnailTypeKind,
} from "./thumbnail-type.constants";
