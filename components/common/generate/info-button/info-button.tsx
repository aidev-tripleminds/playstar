"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INFO_ICON_SRC = "/assets/info-circle-filled.svg";

export type InfoButtonStatus = "highlight" | "dark";

export type InfoButtonSize = "desktop" | "mobile" | "responsive";

export type InfoButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children" | "size" | "variant"
> & {
  status?: InfoButtonStatus;
  size?: InfoButtonSize;
};

const INFO_BUTTON_SIZE_CLASS = {
  mobile: {
    button: "size-7",
    outerPad: "p-1",
    innerPad: "p-0.5",
    icon: "size-4",
  },
  desktop: {
    button: "size-11",
    outerPad: "p-[7px]",
    innerPad: "p-[5px]",
    icon: "size-5",
  },
  responsive: {
    button: "size-7 md:size-11",
    outerPad: "p-1 md:p-[7px]",
    innerPad: "p-0.5 md:p-[5px]",
    icon: "size-4 md:size-5",
  },
} as const satisfies Record<
  InfoButtonSize,
  { button: string; outerPad: string; innerPad: string; icon: string }
>;

const HIGHLIGHT_GOLD_RING =
  "linear-gradient(360.28deg, rgba(255, 208, 113, 0.75) 8.17%, rgba(255, 120, 0, 0.55) 45.27%, rgba(255, 180, 50, 0.75) 100%)";
// Ring 2: dark warm-brown (amber tint over very dark base)
const HIGHLIGHT_OUTER_RING =
  "linear-gradient(180deg, rgba(252, 199, 56, 0.12) 0%, rgba(215, 123, 8, 0.14) 100%), #0a0700";

// Ring 3: slightly lighter warm-brown
const HIGHLIGHT_INNER_RING =
  "linear-gradient(180deg, rgba(252, 199, 56, 0.38) 0%, rgba(215, 123, 8, 0.24) 100%), #100c00";

const darkOuterGradient =
  "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(212, 212, 212, 0.07) 20%, rgba(151, 151, 151, 0.07) 100%)";

export function InfoButton({
  status = "highlight",
  size = "responsive",
  className,
  type = "button",
  "aria-label": ariaLabel = "More information",
  ...props
}: InfoButtonProps) {
  const isHighlight = status === "highlight";
  const sizeClass = INFO_BUTTON_SIZE_CLASS[size];

  return (
    <Button
      type={type}
      variant="ghost"
      disableActiveEffect
      data-slot="info-button"
      data-status={status}
      data-size={size}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-0 shrink-0 p-0",
        sizeClass.button,
        "hover:bg-transparent dark:hover:bg-transparent",
        "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-flex size-full items-center justify-center overflow-hidden rounded-[100px]",
          isHighlight && "border border-solid border-transparent",
        )}
        style={isHighlight ? { background: HIGHLIGHT_GOLD_RING } : { background: "transparent" }}
      >
        <span
          className={cn("inline-flex items-center", sizeClass.outerPad)}
          style={{
            background: isHighlight ? HIGHLIGHT_OUTER_RING : darkOuterGradient,
          }}
        >
          <span
            className={cn("inline-flex items-center rounded-[84px]", sizeClass.innerPad)}
            style={{
              background: isHighlight ? HIGHLIGHT_INNER_RING : "",
            }}
          >
            <Image
              src={INFO_ICON_SRC}
              alt=""
              aria-hidden
              width={20}
              height={20}
              className={cn("relative shrink-0 object-cover", sizeClass.icon)}
            />
          </span>
        </span>
      </span>
    </Button>
  );
}
