"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";
import { TickOnlyIcon } from "@/public/assets/icons/tick-only";

const imageSelectedVariants = cva(
  [
    "relative isolate inline-flex h-[300px] w-[216px] shrink-0 overflow-hidden rounded-[24px] p-3",
    "transition-[box-shadow] duration-200",
    "hover:bg-transparent dark:hover:bg-transparent",
    "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
  ],
  {
    variants: {
      selected: {
        true: "shadow-selection-box",
        false: "",
      },
    },
    defaultVariants: {
      selected: true,
    },
  },
);

export type ImageSelectedProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "size" | "variant"
> &
  VariantProps<typeof imageSelectedVariants> & {
    imageSrc?: string;
    imageAlt?: string;
    selected?: boolean;
    defaultSelected?: boolean;
    showCheckbox?: boolean;
    onSelectedChange?: (selected: boolean) => void;
  };

export function ImageSelected({
  selected,
  defaultSelected = true,
  imageSrc = resolveAsset("demo_pics_model9").image ?? "",
  imageAlt = "Selected image",
  showCheckbox = true,
  onSelectedChange,
  className,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  ...props
}: ImageSelectedProps) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);

  const isSelected = selected ?? internalSelected;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

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
      data-slot="image-selected"
      data-selected={isSelected ? "true" : "false"}
      aria-pressed={isSelected}
      aria-label={ariaLabel ?? imageAlt}
      onClick={handleClick}
      className={cn(
        imageSelectedVariants({
          selected: isSelected,
        }),
        className,
      )}
      {...props}
    >
      <Image src={imageSrc} alt={imageAlt} fill sizes="128px" className="object-cover" />

      {isSelected ? (
        <span
          aria-hidden
          data-slot="image-selected-border"
          className="border-brand-primary pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-4"
        />
      ) : null}

      {isSelected && showCheckbox ? (
        <div
          data-slot="image-selected-checkbox"
          className="bg-brand-primary absolute z-20 inline-flex size-9 items-center justify-center rounded-full p-1.5"
        >
          <TickOnlyIcon className="text-tooltip-text size-6" />
        </div>
      ) : null}
    </Button>
  );
}
