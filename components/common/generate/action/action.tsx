"use client";

import { cva } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { ImageWithSkeleton, MediaSkeletonOverlay } from "@/components/common/skeleton";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  ACTION_CROWN_ICON_SRC,
  ACTION_CROWN_PADDING,
  ACTION_DEFAULT_IMAGE_SIZE,
  ACTION_DEFAULT_IMAGE_SRC,
  ACTION_DEFAULT_LABEL,
  ACTION_DEFAULT_VARIANT,
  type ActionVariant,
} from "./action.constants";

const actionVariants = cva(
  [
    "text-select-text h-10",
    "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border py-1 pr-3 pl-1",
    "text-xs leading-4 font-medium",
    "transition-[border-color] duration-300 ease-out focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      appearance: {
        default: [
          "border-border-focus bg-surface-strong hover:border-border-control",
          "focus-visible:ring-border-focus focus-visible:ring-2",
        ],
        premium: [
          "border-border-focus bg-surface-strong hover:border-border-control",
          "focus-visible:ring-0",
        ],
        "premium-focus": "relative action-premium-focus",
      },
    },
    defaultVariants: {
      appearance: "default",
    },
  },
);

export type ActionProps = Omit<React.ComponentProps<"button">, "children"> & {
  variant?: ActionVariant;
  focused?: boolean;
  label?: string;
  /** Logical asset key, re-resolved live via `useAsset`. */
  assetKey?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageSize?: number;
};

function ActionThumbnail({
  variant,
  focused,
  assetKey,
  imageSrc,
  imageAlt,
  imageSize,
}: {
  variant: ActionVariant;
  focused: boolean;
  assetKey?: string;
  imageSrc: string;
  imageAlt?: string;
  imageSize: number;
}) {
  const isPremium = variant === "premium";
  const crownPadding = Math.round((imageSize * ACTION_CROWN_PADDING) / ACTION_DEFAULT_IMAGE_SIZE);
  const crownSize = Math.max(imageSize - crownPadding * 2, 0);

  return (
    <span
      data-slot="action-image"
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full",
        isPremium && "items-center justify-center",
        isPremium &&
          (focused ? "action-premium-focus-image" : "bg-[image:var(--gradient-action-premium)]"),
      )}
      style={{
        width: imageSize,
        height: imageSize,
        ...(isPremium ? { padding: crownPadding } : {}),
      }}
    >
      {isPremium ? (
        <Image
          src={ACTION_CROWN_ICON_SRC}
          alt=""
          aria-hidden
          width={crownSize}
          height={crownSize}
        />
      ) : imageSrc ? (
        <ImageWithSkeleton
          src={imageSrc}
          alt={imageAlt ?? ""}
          aria-hidden
          fill
          sizes={`${imageSize}px`}
          className="object-cover"
        />
      ) : assetKey ? (
        <MediaSkeletonOverlay isLoaded={false} />
      ) : null}
    </span>
  );
}

export function Action({
  variant = ACTION_DEFAULT_VARIANT,
  focused = false,
  label = ACTION_DEFAULT_LABEL,
  assetKey,
  imageSrc = ACTION_DEFAULT_IMAGE_SRC,
  imageAlt,
  imageSize = ACTION_DEFAULT_IMAGE_SIZE,
  className,
  style,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
  ...props
}: ActionProps) {
  const isPremium = variant === "premium";
  const isPremiumFocus = isPremium && focused;
  const appearance = isPremiumFocus ? "premium-focus" : variant;
  const resolvedImageSrc = useAssetImage(assetKey ?? "", imageSrc);

  return (
    <button
      type={type}
      data-slot="action"
      data-variant={variant}
      data-state={isPremiumFocus ? "focus" : "default"}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      className={cn(actionVariants({ appearance }), className)}
      style={style}
      {...props}
    >
      <ActionThumbnail
        variant={variant}
        focused={focused}
        assetKey={assetKey}
        imageSrc={resolvedImageSrc}
        imageAlt={imageAlt}
        imageSize={imageSize}
      />
      <span className="shrink-0 text-nowrap">{label}</span>
    </button>
  );
}

export {
  ACTION_BORDER_HOVER_CLASS,
  ACTION_CROWN_ICON_SRC,
  ACTION_CROWN_PADDING,
  ACTION_DEFAULT_IMAGE_SIZE,
  ACTION_DEFAULT_IMAGE_SRC,
  ACTION_DEFAULT_LABEL,
  ACTION_DEFAULT_VARIANT,
  ACTION_VARIANTS,
  type ActionVariant,
} from "./action.constants";
