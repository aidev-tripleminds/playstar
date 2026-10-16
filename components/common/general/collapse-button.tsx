"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

const COLLAPSE_ICON_SRC = "/assets/expanded.svg";

const collapseButtonVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center transition-colors",
    "focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:outline-none",
  ],
  {
    variants: {
      variant: {
        footer: "rounded-lg bg-black p-1.5",
        header: "text-tooltip-text size-6 shrink-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "footer",
    },
  },
);

const collapseButtonIconVariants = cva("size-6 shrink-0 object-contain", {
  variants: {
    iconRotation: {
      default: "",
      flipped: "rotate-180",
    },
  },
  defaultVariants: {
    iconRotation: "default",
  },
});

export type CollapseButtonProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof collapseButtonVariants> &
  VariantProps<typeof collapseButtonIconVariants> & {
    label?: string;
    iconSrc?: string;
  };

export function CollapseButton({
  variant = "footer",
  iconRotation,
  label = "Collapse panel",
  iconSrc = COLLAPSE_ICON_SRC,
  className,
  type = "button",
  ...props
}: CollapseButtonProps) {
  const resolvedIconRotation = iconRotation ?? (variant === "header" ? "flipped" : "default");

  return (
    <button
      type={type}
      data-slot="collapse-button"
      data-variant={variant}
      aria-label={label}
      className={cn(collapseButtonVariants({ variant }), className)}
      {...props}
    >
      <Image
        src={iconSrc}
        alt=""
        aria-hidden
        width={24}
        height={24}
        className={collapseButtonIconVariants({ iconRotation: resolvedIconRotation })}
      />
    </button>
  );
}
