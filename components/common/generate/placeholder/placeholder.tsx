"use client";

import { cva } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Close } from "@/components/common/general/close/close";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddCircleIcon } from "@/public/assets/icons/add-circle";

import {
  PLACEHOLDER_BORDER_DEFAULT_CLASS,
  PLACEHOLDER_BORDER_HOVER_CLASS,
  PLACEHOLDER_BORDER_SELECTED_CLASS,
  PLACEHOLDER_DEFAULT_IMAGE_SRC,
  PLACEHOLDER_DEFAULT_SUBTITLE,
  PLACEHOLDER_DEFAULT_TITLE,
  PLACEHOLDER_SIZE_CLASS,
} from "./placeholder.constants";

/** Same crawl as a clipped Create AI label, without waiting for hover. */
const PLACEHOLDER_CAPTION_SCROLL_PX_PER_SECOND = 40;
const PLACEHOLDER_CAPTION_SCROLL_END_HOLD_MS = 2000;
/** Extra travel so the last italic glyph clears the card edge. */
const PLACEHOLDER_CAPTION_END_CLEARANCE_PX = 4;
/** Resting inset. It travels with the label, so a long name can still cross the edge. */
const PLACEHOLDER_CAPTION_START_CLASS = "pl-1.5";
const PLACEHOLDER_CAPTION_REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const PLACEHOLDER_CAPTION_CLASS =
  "font-[family-name:var(--font-geist-extra-bold-italic)] text-[11px] leading-none font-black italic uppercase text-tooltip-text [text-shadow:0_0_2px_rgba(0,0,0,0.7)]";

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = React.useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia(PLACEHOLDER_CAPTION_REDUCE_MOTION_QUERY).matches;
  });

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(PLACEHOLDER_CAPTION_REDUCE_MOTION_QUERY);
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduceMotion;
}

function PlaceholderCaption({ text }: { text: string }) {
  const containerRef = React.useRef<HTMLSpanElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = React.useState(0);
  const reduceMotion = usePrefersReducedMotion();

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const probe = measureRef.current;
    if (!container || !probe) return;

    const overflow = probe.scrollWidth - container.clientWidth;
    // "HOTEL ROOM" is only 1px wider than the 73px card. A threshold of 1px
    // left that label clipped and still.
    const next = overflow > 0 ? Math.ceil(overflow) + PLACEHOLDER_CAPTION_END_CLEARANCE_PX : 0;
    setDistance((current) => (current === next ? current : next));
  }, []);

  React.useLayoutEffect(() => {
    measure();
  }, [measure, text]);

  React.useEffect(() => {
    const container = containerRef.current;
    const probe = measureRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    if (probe) observer.observe(probe);
    return () => observer.disconnect();
  }, [measure]);

  React.useEffect(() => {
    const fonts = document.fonts;
    if (!fonts?.ready) return;
    let cancelled = false;
    void fonts.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [measure, text]);

  const animating = !reduceMotion && distance > 0;

  React.useEffect(() => {
    const node = textRef.current;
    if (!node || !animating || typeof node.animate !== "function") return;

    const scrollMs = (distance / PLACEHOLDER_CAPTION_SCROLL_PX_PER_SECOND) * 1000;
    const holdMs = PLACEHOLDER_CAPTION_SCROLL_END_HOLD_MS;
    const duration = scrollMs * 2 + holdMs * 2;
    const shift = `translateX(-${distance}px)`;
    const rest = "translateX(0px)";
    const animation = node.animate(
      [
        { transform: rest, offset: 0 },
        { transform: shift, offset: scrollMs / duration },
        { transform: shift, offset: (scrollMs + holdMs) / duration },
        { transform: rest, offset: (scrollMs * 2 + holdMs) / duration },
        { transform: rest, offset: 1 },
      ],
      { duration, easing: "linear", iterations: Infinity },
    );

    return () => animation.cancel();
  }, [animating, distance]);

  return (
    <span
      ref={containerRef}
      data-slot="placeholder-caption"
      className="relative block max-w-full min-w-0 overflow-hidden pt-4 pb-2 text-left"
    >
      <span
        ref={measureRef}
        className={cn(
          "pointer-events-none absolute top-0 left-0 w-max whitespace-nowrap opacity-0",
          PLACEHOLDER_CAPTION_START_CLASS,
          PLACEHOLDER_CAPTION_CLASS,
        )}
        aria-hidden
      >
        {text}
      </span>
      <span
        ref={textRef}
        data-marquee={animating ? "running" : "idle"}
        className={cn(
          "block whitespace-nowrap",
          PLACEHOLDER_CAPTION_CLASS,
          distance > 0 ? cn(PLACEHOLDER_CAPTION_START_CLASS, "text-left") : "truncate text-center",
          animating ? "w-max" : "truncate",
        )}
      >
        {text}
      </span>
    </span>
  );
}

const placeholderDropVariants = cva(
  [
    "relative isolate flex shrink-0 flex-col items-center overflow-hidden",
    "shadow-[0px_4px_8px_rgba(0,0,0,0.2)] bg-border-strong",
  ],
  {
    variants: {
      status: {
        default: cn(
          PLACEHOLDER_BORDER_DEFAULT_CLASS,
          PLACEHOLDER_BORDER_HOVER_CLASS,
          "justify-between gap-1 px-1.5! py-2! md:gap-1 md:p-2!",
        ),
        selected: cn(PLACEHOLDER_BORDER_SELECTED_CLASS, "justify-center"),
      },
      density: {
        default: cn("rounded-[12px]", PLACEHOLDER_SIZE_CLASS),
        /** Figma compact action card: 35×44, radius 6, icon only. */
        compact:
          "h-11 max-h-11 min-h-11 w-[35px] max-w-[35px] min-w-[35px] justify-center rounded-[6px] p-1",
      },
    },
    defaultVariants: {
      status: "default",
      density: "default",
    },
  },
);

export type PlaceholderProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children" | "size" | "variant"
> & {
  title?: string;
  subtitle?: string;
  selected?: boolean;
  defaultSelected?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /** Name of the selected character, action, clothing, or location. */
  caption?: string;
  onSelectedChange?: (selected: boolean) => void;
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  closeLabel?: string;
  /** `compact` is the 35×44 scroll-collapsed card (icon or thumbnail only). */
  density?: "default" | "compact";
};

export function Placeholder({
  title = PLACEHOLDER_DEFAULT_TITLE,
  subtitle = PLACEHOLDER_DEFAULT_SUBTITLE,
  selected,
  defaultSelected = false,
  imageSrc = PLACEHOLDER_DEFAULT_IMAGE_SRC,
  imageAlt = title,
  caption,
  onSelectedChange,
  onClear,
  closeLabel = `Remove ${title}`,
  density = "default",
  className,
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: PlaceholderProps) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
  const isSelected = selected ?? internalSelected;

  const setSelected = React.useCallback(
    (nextSelected: boolean) => {
      if (selected === undefined) {
        setInternalSelected(nextSelected);
      }
      onSelectedChange?.(nextSelected);
    },
    [onSelectedChange, selected],
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || isSelected) return;
    setSelected(true);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClear?.(event);
    if (event.defaultPrevented) return;
    setSelected(false);
  };

  const handleSelectedClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
  };

  if (isSelected) {
    return (
      <div
        data-slot="placeholder"
        data-status="selected"
        data-density={density}
        onClick={handleSelectedClick}
        className={cn(placeholderDropVariants({ status: "selected", density }), className)}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          // 4-col cards stay fluid while the prompt-box container is ≤639px.
          // Mobile `px-4` plus prompt-box `p-3` keep that true through a 695px viewport.
          sizes="(max-width: 695px) calc((100vw - 4.625rem) / 4), 73px"
          className="object-cover object-top"
        />

        {density === "compact" ? null : (
          <Close
            type="button"
            size="small"
            status="default"
            aria-label={closeLabel}
            onClick={handleClear}
            className={cn(
              "absolute top-1 right-1 z-10",
              "bg-tooltip-default-bg size-6 rounded-full p-1",
              "hover:bg-tooltip-default-bg dark:hover:bg-tooltip-default-bg",
            )}
          />
        )}

        {caption?.trim() ? (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <PlaceholderCaption text={caption.trim()} />
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <Button
      type={type}
      variant="ghost"
      disableActiveEffect
      disabled={disabled}
      data-slot="placeholder"
      data-status="default"
      data-density={density}
      aria-label={ariaLabel ?? `Add ${title}`}
      onClick={handleClick}
      className={cn(
        placeholderDropVariants({ status: "default", density }),
        "cursor-pointer p-0",
        "bg-border-strong hover:bg-border-strong dark:hover:bg-border-strong",
        "focus-visible:ring-2 focus-visible:outline-none",
        // 'focus-visible:ring-[#8a38f5]',
        className,
      )}
      {...props}
    >
      <AddCircleIcon
        aria-hidden
        className={cn("text-gray-text shrink-0", density === "compact" ? "size-4" : "size-7")}
      />

      {density === "compact" ? null : (
        <span className="flex w-full flex-col items-center">
          <span className="text-cookie-bg w-full text-center text-[12px] leading-4 font-medium">
            {title}
          </span>
          <span className="text-gray-text w-full text-center text-[10px] leading-4 font-medium">
            {subtitle}
          </span>
        </span>
      )}
    </Button>
  );
}

export {
  PLACEHOLDER_BORDER_DEFAULT_CLASS,
  PLACEHOLDER_BORDER_HOVER_CLASS,
  PLACEHOLDER_BORDER_SELECTED_CLASS,
  PLACEHOLDER_DEFAULT_IMAGE_SRC,
  PLACEHOLDER_DEFAULT_SUBTITLE,
  PLACEHOLDER_DEFAULT_TITLE,
  PLACEHOLDER_DESKTOP_HEIGHT,
  PLACEHOLDER_DESKTOP_WIDTH,
  PLACEHOLDER_MOBILE_ASPECT_RATIO,
  PLACEHOLDER_MOBILE_HEIGHT,
  PLACEHOLDER_MOBILE_WIDTH,
  PLACEHOLDER_SIZE_CLASS,
} from "./placeholder.constants";
