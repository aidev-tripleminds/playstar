import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import {
  CHECKPOINT_THUMBNAIL_DEFAULT_SIZE,
  CHECKPOINT_THUMBNAIL_DEFAULT_VARIANT,
  CHECKPOINT_THUMBNAIL_LABELS,
  CHECKPOINT_THUMBNAIL_SRC,
  type CheckpointThumbnailVariant,
} from "./checkpoint-thumbnail.constants";

export type CheckpointThumbnailProps = Omit<React.ComponentProps<"span">, "children" | "role"> & {
  variant?: CheckpointThumbnailVariant;
  size?: number;
  alt?: string;
};

export function CheckpointThumbnail({
  variant = CHECKPOINT_THUMBNAIL_DEFAULT_VARIANT,
  size = CHECKPOINT_THUMBNAIL_DEFAULT_SIZE,
  alt,
  className,
  ...props
}: CheckpointThumbnailProps) {
  const label = CHECKPOINT_THUMBNAIL_LABELS[variant];

  return (
    <span
      data-slot="checkpoint-thumbnail"
      data-variant={variant}
      role="img"
      aria-label={alt ?? label}
      className={cn("inline-flex shrink-0 overflow-hidden", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <Image
        src={CHECKPOINT_THUMBNAIL_SRC[variant]}
        alt=""
        aria-hidden
        width={size}
        height={size}
        className="size-full object-contain"
      />
    </span>
  );
}

export {
  CHECKPOINT_THUMBNAIL_DEFAULT_SIZE,
  CHECKPOINT_THUMBNAIL_DEFAULT_VARIANT,
  CHECKPOINT_THUMBNAIL_LABELS,
  CHECKPOINT_THUMBNAIL_SRC,
  CHECKPOINT_THUMBNAIL_VARIANTS,
  type CheckpointThumbnailVariant,
} from "./checkpoint-thumbnail.constants";
