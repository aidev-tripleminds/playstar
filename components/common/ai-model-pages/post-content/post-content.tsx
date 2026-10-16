"use client";

import Image from "next/image";
import * as React from "react";

import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

import { Close } from "../../general/close/close";

export type PostContentProps = React.ComponentProps<"div"> & {
  imageSrc?: string;
  imageAlt?: string;
  onClose?: () => void;
  closeLabel?: string;
};

export function PostContent({
  imageSrc = resolveAsset("demo_pics_pexel2").image ?? "",
  imageAlt = "Post content",
  onClose,
  closeLabel = "Close",
  className,
  ...props
}: PostContentProps) {
  return (
    <div
      data-slot="post-content"
      className={cn(
        "relative isolate w-full overflow-hidden",
        "rounded-[16px] md:rounded-[24px]",
        "h-[300px]",
        className,
      )}
      {...props}
    >
      <div className="relative h-full min-h-0 w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          // sizes="(max-width: 768px) 100vw, 562px"
        />
      </div>

      <Close
        aria-label={closeLabel}
        onClick={onClose}
        size="small"
        className={cn("absolute top-2.5 right-2.5 z-10")}
      />
    </div>
  );
}
