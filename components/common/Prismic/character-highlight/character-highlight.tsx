"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Close } from "@/components/common/general/close/close";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  CHARACTER_HIGHLIGHT_DEFAULT_CATEGORY_LABEL,
  CHARACTER_HIGHLIGHT_DEFAULT_IMAGE_SRC,
  CHARACTER_HIGHLIGHT_DEFAULT_LABEL,
  CHARACTER_HIGHLIGHT_DEFAULT_LIVE_LABEL,
  CHARACTER_HIGHLIGHT_VERIFIED_ICON_SRC,
  type CharacterHighlightLabelType,
} from "./character-highlight.constants";

const characterHighlightVariants = cva(
  "inline-flex w-auto shrink-0 flex-col items-center gap-1 border-0 bg-transparent p-0 md:w-[100px]",
  {
    variants: {
      state: {
        default: "",
        selected: "",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

const characterHighlightAvatarVariants = cva(
  "relative shrink-0 rounded-full p-0.75 md:p-1 size-[75px] md:size-[95px] box-content",
  {
    variants: {
      state: {
        default: "",
        selected: "",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

const characterHighlightAvatarImageVariants = cva(
  "relative block size-[75px] overflow-hidden rounded-full md:size-[95px]",
);

const characterHighlightLabelVariants = cva(
  "inline-flex max-w-full items-center justify-center gap-1 truncate px-1 font-medium transition-colors duration-200",
  {
    variants: {
      state: {
        default:
          "text-select-muted-text text-sm leading-4 md:text-base md:leading-5 md:group-hover:text-[var(--Colors-Neutral-200,#e5e5e5)]",
        selected: "text-tooltip-text rounded-full  text-sm leading-4 md:text-base md:leading-5",
      },
      labelType: {
        name: "",
        verified: "rounded px-2 py-0.5 md:px-2.5",
        live: "rounded  px-2 py-0.5 md:px-2.5",
      },
    },
    defaultVariants: {
      state: "default",
      labelType: "name",
    },
  },
);

const characterHighlightLiveDotVariants = cva(
  "size-1.5 shrink-0 rounded-full bg-status-active-dot md:size-2",
);

const characterHighlightVerifiedIconVariants = cva("relative size-3 shrink-0 md:size-4");

const characterHighlightCloseVariants = cva("absolute -top-0.5 -right-0.5 z-[1] size-6 md:size-7");

const DEFAULT_LABELS: Record<CharacterHighlightLabelType, string> = {
  name: CHARACTER_HIGHLIGHT_DEFAULT_LABEL,
  verified: CHARACTER_HIGHLIGHT_DEFAULT_CATEGORY_LABEL,
  live: CHARACTER_HIGHLIGHT_DEFAULT_LIVE_LABEL,
};

export type CharacterHighlightProps = VariantProps<typeof characterHighlightVariants> &
  Omit<React.ComponentProps<"div">, "children"> & {
    label?: string;
    labelType?: CharacterHighlightLabelType;
    /**
     * Logical asset key. When set, the avatar re-resolves from the live asset
     * map (`useAsset`) so admin/live-map edits render, falling back to the
     * baked `imageSrc` prop for first paint, SSR, offline, and stories.
     */
    assetKey?: string;
    imageSrc?: string;
    videoSrc?: string;
    imageAlt?: string;
    defaultState?: "default" | "selected";
    onStateChange?: (state: "default" | "selected") => void;
    onClose?: () => void;
  };

export function CharacterHighlight({
  state: stateProp,
  defaultState = "default",
  label,
  labelType = "name",
  assetKey,
  imageSrc = CHARACTER_HIGHLIGHT_DEFAULT_IMAGE_SRC,
  imageAlt,
  videoSrc,
  onClose,
  onStateChange,
  className,
  onClick,
  onKeyDown,
  ...props
}: CharacterHighlightProps) {
  const resolvedImageSrc = useAssetImage(assetKey ?? "", imageSrc);
  const isControlled = stateProp !== undefined;
  const [internalState, setInternalState] = React.useState(defaultState);
  const state = isControlled ? stateProp : internalState;

  const setState = React.useCallback(
    (nextState: "default" | "selected") => {
      if (!isControlled) {
        setInternalState(nextState);
      }
      onStateChange?.(nextState);
    },
    [isControlled, onStateChange],
  );

  const resolvedLabel = label ?? DEFAULT_LABELS[labelType];
  const resolvedImageAlt = imageAlt ?? resolvedLabel;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) {
      return;
    }

    if (state === "selected") {
      setState("default");
      onClose?.();
      return;
    }

    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    setState("selected");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (state === "selected") {
      setState("default");
      onClose?.();
      return;
    }
    setState("selected");
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setState("default");
    onClose?.();
  };

  return (
    <div
      data-slot="character-highlight"
      data-state={state}
      data-label-type={labelType}
      role="button"
      tabIndex={0}
      aria-label={resolvedLabel}
      aria-pressed={state === "selected"}
      className={cn(characterHighlightVariants({ state }), "group cursor-pointer", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span
        className={characterHighlightAvatarVariants({ state })}
        data-slot="character-highlight-avatar"
        style={
          state === "selected" ? { background: "var(--gradient-highlight-select)" } : undefined
        }
      >
        <span className={characterHighlightAvatarImageVariants()}>
          {videoSrc ? (
            <video
              src={videoSrc}
              preload="metadata"
              muted
              playsInline
              className="size-full object-cover"
              aria-hidden
            />
          ) : resolvedImageSrc ? (
            <Image
              src={resolvedImageSrc}
              alt={resolvedImageAlt}
              fill
              className="object-cover transition-transform duration-200 ease-out md:group-hover:scale-[1.10]"
            />
          ) : (
            <span aria-hidden className="bg-surface-strong block size-full" />
          )}
        </span>
        {state === "selected" ? (
          <Close
            size="small"
            aria-label={`Remove ${resolvedLabel}`}
            className={characterHighlightCloseVariants()}
            iconClassName="size-4 md:size-5"
            onClick={handleClose}
          />
        ) : null}
      </span>

      <span
        className={characterHighlightLabelVariants({ state, labelType })}
        data-slot="character-highlight-label"
      >
        {labelType === "verified" ? (
          <span className={characterHighlightVerifiedIconVariants()} aria-hidden>
            <Image
              src={CHARACTER_HIGHLIGHT_VERIFIED_ICON_SRC}
              alt=""
              fill
              className="object-contain"
            />
          </span>
        ) : null}
        {labelType === "live" ? (
          <span
            aria-hidden
            className={characterHighlightLiveDotVariants()}
            data-slot="character-highlight-live-dot"
          />
        ) : null}
        <span data-slot="character-highlight-label-text">{resolvedLabel}</span>
      </span>
    </div>
  );
}

export {
  characterHighlightAvatarImageVariants,
  characterHighlightAvatarVariants,
  characterHighlightLabelVariants,
  characterHighlightVariants,
};
