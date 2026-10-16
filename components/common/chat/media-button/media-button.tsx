"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Tooltip } from "@/components/common/general/tooltip/tooltip";
import { cn } from "@/lib/utils";
import { GalleryIcon2 } from "@/public/assets/icons/gallery-icon2";
import { VideoCameraIcon } from "@/public/assets/icons/video-camera";

const MEDIA_BUTTON_KINDS = {
  image: {
    Icon: GalleryIcon2,
    defaultTooltip: "Make image",
  },
  video: {
    Icon: VideoCameraIcon,
    defaultTooltip: "Make video",
  },
} as const;

export type MediaButtonKind = keyof typeof MEDIA_BUTTON_KINDS;

const CLOSE_ICON_SIZE_PX = 20;
const CLOSE_ICON_GAP_PX = 8;

const mediaButtonVariants = cva(
  "inline-flex items-center rounded-[32px] border cursor-pointer p-3 text-sm font-medium text-tooltip-text transition-colors duration-300 ease-in-out",
  {
    variants: {
      status: {
        unselected: "bg-tooltip-default-bg border-surface-strong",
        selected: "bg-select-fill-end border-brand-primary text-brand-primary",
        hover: "bg-surface-strong border-surface-strong relative isolate",
      },
    },
    defaultVariants: {
      status: "unselected",
    },
  },
);

export type MediaButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> &
  VariantProps<typeof mediaButtonVariants> & {
    kind?: MediaButtonKind;
    selected?: boolean;
    defaultSelected?: boolean;
    label?: string;
    showLabel?: boolean;
    tooltip?: string;
    showTooltip?: boolean;
    selectedIconSrc?: string;
    onSelectedChange?: (selected: boolean) => void;
  };

export function MediaButton({
  kind = "image",
  selected,
  defaultSelected = false,
  label = "4:3",
  showLabel = false,
  tooltip,
  showTooltip = true,
  selectedIconSrc = "/assets/cross-icon.svg",
  onSelectedChange,
  className,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: MediaButtonProps) {
  const { Icon, defaultTooltip } = MEDIA_BUTTON_KINDS[kind];
  const resolvedTooltip = tooltip ?? defaultTooltip;

  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
  const [isHovered, setIsHovered] = React.useState(false);

  const isSelected = selected ?? internalSelected;

  const status = isSelected ? "selected" : isHovered ? "hover" : "unselected";

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    const nextSelected = !isSelected;
    if (selected === undefined) setInternalSelected(nextSelected);
    onSelectedChange?.(nextSelected);
  };

  const button = (
    <button
      type="button"
      data-slot="media-button"
      data-kind={kind}
      data-status={status}
      aria-pressed={isSelected}
      aria-label={ariaLabel ?? resolvedTooltip}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(mediaButtonVariants({ status }), className)}
      {...props}
    >
      <Icon className="size-5 shrink-0" />
      <span
        aria-hidden={!isSelected}
        className="block shrink-0 overflow-hidden ease-in-out"
        style={{
          width: isSelected ? CLOSE_ICON_SIZE_PX : 0,
          marginLeft: isSelected ? CLOSE_ICON_GAP_PX : 0,
          opacity: isSelected ? 1 : 0,
          transition:
            "width 300ms ease-in-out, margin 300ms ease-in-out, opacity 300ms ease-in-out",
        }}
      >
        <Image
          src={selectedIconSrc}
          alt=""
          aria-hidden
          width={CLOSE_ICON_SIZE_PX}
          height={CLOSE_ICON_SIZE_PX}
          className={cn(
            "block size-5 cursor-pointer object-contain",
            !isSelected && "pointer-events-none",
          )}
        />
      </span>
      <span
        className={cn("shrink-0 leading-5", !showLabel && "hidden", status === "hover" && "z-[1]")}
      >
        {label}
      </span>
    </button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip text={resolvedTooltip} delayDuration={0} open={isSelected ? false : undefined}>
      {button}
    </Tooltip>
  );
}
