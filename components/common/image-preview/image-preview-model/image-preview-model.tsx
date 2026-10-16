"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as React from "react";

import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

import { MediaPreviewEmptyIcon } from "../components/helpers";

export type ImagePreviewModelStatus = "empty" | "filled";

export type ImagePreviewModelProps = Omit<React.ComponentProps<"div">, "title"> & {
  status?: ImagePreviewModelStatus;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  title?: string;
  emptyLabel?: string;
  emptyIconSrc?: string | StaticImageData | React.ReactNode;
  onEmptyClick?: () => void;
};

const EMPTY_SLOT_CLASS =
  "border-border-control bg-surface-strong hover:bg-surface-strong-hover flex min-h-10 w-[calc(100%-2rem)] items-center justify-center rounded-lg border border-dashed px-3 py-2 transition-colors";

export function ImagePreviewModel({
  status,
  imageSrc = resolveAsset("demo_pics_model4").image ?? "",
  imageAlt = "",
  title = "Eva Marina Petranova",
  emptyLabel = "Create AI Character",
  emptyIconSrc,
  onEmptyClick,
  className,
  ...props
}: ImagePreviewModelProps) {
  const resolvedStatus: ImagePreviewModelStatus = status ?? (imageSrc ? "filled" : "empty");

  return (
    <>
      {resolvedStatus === "filled" && (
        <div
          data-slot="image-preview-model"
          data-status="filled"
          className={cn("text-tooltip-text flex w-full items-center gap-3", className)}
        >
          {imageSrc ? (
            <div className="shrink-0 overflow-hidden rounded-[12px]">
              <Image
                src={imageSrc}
                alt={imageAlt || title || "Model preview"}
                width={40}
                height={40}
                className="size-10 object-cover"
                sizes="(max-width: 640px) 40px, 40px"
              />
            </div>
          ) : null}

          {title ? (
            <p className="min-w-0 flex-1 truncate text-[14px] leading-5 font-medium">{title}</p>
          ) : null}
        </div>
      )}

      {resolvedStatus === "empty" &&
        (onEmptyClick ? (
          <button
            type="button"
            data-slot="image-preview-model"
            data-status="empty"
            onClick={onEmptyClick}
            className={cn(EMPTY_SLOT_CLASS, "cursor-pointer", className)}
          >
            <span className="flex items-center gap-1 text-center">
              <MediaPreviewEmptyIcon emptyIconSrc={emptyIconSrc} />
              <span className="text-divider-label text-[12px] leading-4 font-medium">
                {emptyLabel}
              </span>
            </span>
          </button>
        ) : (
          <div
            data-slot="image-preview-model"
            data-status="empty"
            className={cn(EMPTY_SLOT_CLASS, className)}
            {...props}
          >
            <span className="flex items-center gap-1 text-center">
              <MediaPreviewEmptyIcon emptyIconSrc={emptyIconSrc} />
              <span className="text-divider-label text-[12px] leading-4 font-medium">
                {emptyLabel}
              </span>
            </span>
          </div>
        ))}
    </>
  );
}
