"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const scrollArrowButtonVariants = cva(
  [
    "bg-surface-strong text-tooltip-text absolute top-1/2 z-20 inline-flex size-10 -translate-y-1/2",
    "items-center justify-center rounded-full shadow-[0_0_25px_0_#000] transition-opacity",
  ],
  {
    variants: {
      direction: {
        prev: "left-0",
        next: "right-0",
      },
      desktopOnly: {
        true: "hidden md:inline-flex",
        false: "inline-flex",
      },
    },
    defaultVariants: {
      direction: "next",
      desktopOnly: true,
    },
  },
);

const scrollArrowGradientVariants = cva(
  "from-dialog-bg pointer-events-none absolute inset-y-0 z-10 w-14 to-transparent",
  {
    variants: {
      direction: {
        prev: "left-0 bg-gradient-to-r",
        next: "right-0 bg-gradient-to-l",
      },
      desktopOnly: {
        true: "hidden md:block",
        false: "block",
      },
    },
    defaultVariants: {
      direction: "next",
      desktopOnly: true,
    },
  },
);

export type ScrollArrowButtonProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof scrollArrowButtonVariants> & {
    showGradient?: boolean;
    gradientClassName?: string;
    iconClassName?: string;
  };

export function ScrollArrowButton({
  direction = "next",
  desktopOnly = true,
  showGradient = true,
  className,
  gradientClassName,
  iconClassName,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: ScrollArrowButtonProps) {
  const resolvedDirection = direction ?? "next";
  const Icon = resolvedDirection === "prev" ? ChevronLeft : ChevronRight;
  const resolvedAriaLabel =
    ariaLabel ?? (resolvedDirection === "prev" ? "Scroll left" : "Scroll right");

  return (
    <>
      {showGradient ? (
        <div
          aria-hidden
          data-slot="scroll-arrow-gradient"
          className={cn(
            scrollArrowGradientVariants({
              direction: resolvedDirection,
              desktopOnly: desktopOnly ?? true,
            }),
            gradientClassName,
          )}
        />
      ) : null}
      <button
        type={type}
        data-slot="scroll-arrow-button"
        data-direction={resolvedDirection}
        aria-label={resolvedAriaLabel}
        className={cn(
          scrollArrowButtonVariants({
            direction: resolvedDirection,
            desktopOnly: desktopOnly ?? true,
          }),
          className,
        )}
        {...props}
      >
        <Icon className={cn("size-5 shrink-0 cursor-pointer", iconClassName)} aria-hidden />
      </button>
    </>
  );
}
