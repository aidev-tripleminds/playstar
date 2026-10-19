"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

const POSE_IMAGE_SIZE_DESKTOP = 70;
const POSE_IMAGE_SIZE_MOBILE = 65;

const poseSelectVariants = cva(
  [
    "inline-flex shrink-0 flex-col items-center gap-1.5",
    "w-[65px] md:w-[70px]",
    "cursor-pointer transition-colors",
    "focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      status: {
        unselected: "text-modal-text",
        selected: "text-tooltip-text",
      },
    },
    defaultVariants: {
      status: "unselected",
    },
  },
);

const poseImageFrameVariants = cva(
  ["relative w-full overflow-hidden", "aspect-square", "rounded-[8px] md:rounded-[12px]"],
  {
    variants: {
      status: {
        unselected: "",
        selected: "",
      },
    },
    defaultVariants: {
      status: "unselected",
    },
  },
);

const poseImageRingVariants = cva(
  ["pointer-events-none absolute inset-0 z-10", "rounded-[8px] md:rounded-[12px]", "border-2"],
  {
    variants: {
      status: {
        unselected: "border-transparent",
        selected: "border-tooltip-text",
      },
    },
    defaultVariants: {
      status: "unselected",
    },
  },
);

export type PoseSelectStatus = "selected" | "unselected";

export type PoseSelectProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof poseSelectVariants> & {
    label?: string;
    imageSrc?: string;
    selected?: boolean;
    defaultSelected?: boolean;
    onSelectedChange?: (selected: boolean) => void;
  };

export function PoseSelect({
  status,
  selected,
  defaultSelected = false,
  label = "Selfie",
  imageSrc = dummyImage(75),
  onSelectedChange,
  className,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  ...props
}: PoseSelectProps) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);

  const isSelected =
    selected ?? (status === "selected" ? true : status === "unselected" ? false : internalSelected);
  const resolvedStatus: PoseSelectStatus = isSelected ? "selected" : "unselected";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    const nextSelected = !isSelected;
    if (selected === undefined && status === undefined) {
      setInternalSelected(nextSelected);
    }
    onSelectedChange?.(nextSelected);
  };

  return (
    <button
      type={type}
      data-slot="pose-select"
      data-status={resolvedStatus}
      aria-pressed={isSelected}
      aria-label={ariaLabel ?? label}
      onClick={handleClick}
      className={cn(poseSelectVariants({ status: resolvedStatus }), className)}
      {...props}
    >
      <span className={cn(poseImageFrameVariants({ status: resolvedStatus }))}>
        <span className={cn(poseImageRingVariants({ status: resolvedStatus }))} aria-hidden />
        <Image
          src={imageSrc}
          alt=""
          aria-hidden
          fill
          sizes={`(max-width: 767px) ${POSE_IMAGE_SIZE_MOBILE}px, ${POSE_IMAGE_SIZE_DESKTOP}px`}
          className="object-cover"
        />
      </span>
      <span className="w-full text-center text-[12px] leading-3 font-medium">{label}</span>
    </button>
  );
}
