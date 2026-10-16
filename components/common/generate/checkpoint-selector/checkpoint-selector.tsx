"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { RadioIndicator } from "@/components/common/general/radio-indicator/radio-indicator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { CheckpointThumbnailVariant } from "../checkpoint-thumbnail";
import { ThumbnailType } from "../thumbnail-type";
import {
  CHECKPOINT_SELECTOR_CROWN_ICON_SRC,
  CHECKPOINT_SELECTOR_DEFAULT_CHECKPOINT_VARIANT,
  CHECKPOINT_SELECTOR_DEFAULT_DESCRIPTION,
  CHECKPOINT_SELECTOR_DEFAULT_NAME,
  CHECKPOINT_SELECTOR_DEFAULT_THUMBNAIL_SIZE,
  CHECKPOINT_SELECTOR_DEFAULT_TOKEN_COST,
  CHECKPOINT_SELECTOR_UNLIMITED_ICON_SRC,
} from "./checkpoint-selector.constants";

const checkpointSelectorVariants = cva(
  [
    "h-15 min-h-15 max-h-15 w-[342px] shrink-0 items-center justify-start gap-2 overflow-hidden rounded-[12px] border-0 text-left",
    "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none text-divider-label",
    "disabled:opacity-50",
  ],
  {
    variants: {
      selected: {
        true: "bg-surface-strong-hover p-2 pr-3 hover:bg-surface-strong-hover hover:text-divider-label  dark:hover:bg-surface-strong-hover",
        false:
          "bg-transparent p-2 hover:bg-surface-strong dark:hover:bg-surface-strong hover:text-divider-label ",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

export type CheckpointSelectorProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children" | "size" | "variant"
> &
  VariantProps<typeof checkpointSelectorVariants> & {
    name?: string;
    description?: string;
    selected?: boolean;
    defaultSelected?: boolean;
    checkpointVariant?: CheckpointThumbnailVariant;
    thumbnailSize?: number;
    tokenCost?: React.ReactNode;
    showTokenBadge?: boolean;
    showPremiumBadge?: boolean;
    showUnlimitedBadge?: boolean;
    onSelectedChange?: (selected: boolean) => void;
  };

export function CheckpointSelector({
  name = CHECKPOINT_SELECTOR_DEFAULT_NAME,
  description = CHECKPOINT_SELECTOR_DEFAULT_DESCRIPTION,
  selected,
  defaultSelected = false,
  checkpointVariant = CHECKPOINT_SELECTOR_DEFAULT_CHECKPOINT_VARIANT,
  thumbnailSize = CHECKPOINT_SELECTOR_DEFAULT_THUMBNAIL_SIZE,
  tokenCost = CHECKPOINT_SELECTOR_DEFAULT_TOKEN_COST,
  showTokenBadge = true,
  showPremiumBadge = true,
  showUnlimitedBadge = true,
  onSelectedChange,
  className,
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: CheckpointSelectorProps) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
  const isSelected = selected ?? internalSelected;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented || disabled) return;

    const nextSelected = !isSelected;

    if (selected === undefined) {
      setInternalSelected(nextSelected);
    }

    onSelectedChange?.(nextSelected);
  };

  return (
    <Button
      type={type}
      variant="ghost"
      disableActiveEffect
      data-slot="checkpoint-selector"
      data-selected={isSelected ? "true" : "false"}
      aria-pressed={isSelected}
      aria-label={ariaLabel ?? name}
      disabled={disabled}
      onClick={handleClick}
      className={cn(checkpointSelectorVariants({ selected: isSelected }), className)}
      {...props}
    >
      <ThumbnailType
        type="checkpoint"
        checkpointVariant={checkpointVariant}
        size={thumbnailSize}
        alt=""
        aria-hidden
        className="pointer-events-none size-11 shrink-0"
      />

      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 overflow-hidden">
        <span className="flex min-w-0 flex-nowrap items-center gap-1.5">
          <span className="text-tooltip-text truncate text-sm leading-5 font-medium">{name}</span>

          {showTokenBadge ? (
            <Badge
              type="neutral"
              size="small"
              text={tokenCost}
              showIcon
              className="border-border-focus shrink-0 items-end"
            />
          ) : null}

          {showPremiumBadge ? (
            <Badge
              type="neutral"
              size="small"
              showText={false}
              iconSrc={CHECKPOINT_SELECTOR_CROWN_ICON_SRC}
              className="display-badge shrink-0"
            />
          ) : null}
          {showUnlimitedBadge ? (
            <Badge
              type="neutral"
              size="small"
              showText={false}
              iconSrc={CHECKPOINT_SELECTOR_UNLIMITED_ICON_SRC}
              className="gradient-badge shrink-0"
            />
          ) : null}
        </span>
        <span className="truncate text-xs leading-4 font-normal">{description}</span>
      </span>

      {isSelected ? (
        <RadioIndicator checked className="shrink-0 bg-[image:var(--check-button)]" />
      ) : null}
    </Button>
  );
}

export {
  CHECKPOINT_SELECTOR_CROWN_ICON_SRC,
  CHECKPOINT_SELECTOR_DEFAULT_CHECKPOINT_VARIANT,
  CHECKPOINT_SELECTOR_DEFAULT_DESCRIPTION,
  CHECKPOINT_SELECTOR_DEFAULT_NAME,
  CHECKPOINT_SELECTOR_DEFAULT_THUMBNAIL_SIZE,
  CHECKPOINT_SELECTOR_DEFAULT_TOKEN_COST,
  CHECKPOINT_SELECTOR_UNLIMITED_ICON_SRC,
} from "./checkpoint-selector.constants";
