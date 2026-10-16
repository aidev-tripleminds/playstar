"use client";

import "./placeholders-hybrid-waveform.css";

import { cva } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Close } from "@/components/common/general/close/close";
import { cn } from "@/lib/utils";
import { PaperclipIcon } from "@/public/assets/icons";

import {
  PLACEHOLDERS_HYBRID_BORDER_FILLED_CLASS,
  PLACEHOLDERS_HYBRID_DEFAULT_AUDIO_LABEL,
  PLACEHOLDERS_HYBRID_DEFAULT_IMAGE_SRC,
  PLACEHOLDERS_HYBRID_DEFAULT_STATUS,
  PLACEHOLDERS_HYBRID_DEFAULT_SUBTITLE,
  PLACEHOLDERS_HYBRID_DEFAULT_TITLE,
  PLACEHOLDERS_HYBRID_DESKTOP_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_FLUID_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_MOBILE_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_PAUSE_ICON_SRC,
  PLACEHOLDERS_HYBRID_PLAY_ICON_SRC,
  PLACEHOLDERS_HYBRID_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_WAVEFORM_HEIGHTS_PX,
  type PlaceholdersHybridSize,
  type PlaceholdersHybridStatus,
} from "./placeholders-hybrid.constants";

const placeholdersHybridVariants = cva(
  "relative isolate flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-[20px]",
  {
    variants: {
      size: {
        fixed: PLACEHOLDERS_HYBRID_SIZE_CLASS,
        desktop: PLACEHOLDERS_HYBRID_DESKTOP_SIZE_CLASS,
        mobile: PLACEHOLDERS_HYBRID_MOBILE_SIZE_CLASS,
        fluid: PLACEHOLDERS_HYBRID_FLUID_SIZE_CLASS,
      },
      status: {
        empty: cn("placeholder-hybrid", "gap-1 px-0 py-2"),
        loaded: cn(PLACEHOLDERS_HYBRID_BORDER_FILLED_CLASS, "gap-3"),
        audio: cn("placeholder-hybrid-audio", "gap-3"),
      },
    },
    defaultVariants: {
      size: "fixed",
      status: "empty",
    },
  },
);

export type PlaceholdersHybridProps = Omit<React.ComponentPropsWithoutRef<"button">, "children"> & {
  size?: PlaceholdersHybridSize;
  status?: PlaceholdersHybridStatus;
  defaultStatus?: PlaceholdersHybridStatus;
  title?: string;
  subtitle?: string;
  audioLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  playing?: boolean;
  defaultPlaying?: boolean;
  onStatusChange?: (status: PlaceholdersHybridStatus) => void;
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPlay?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPlayingChange?: (playing: boolean) => void;
  closeLabel?: string;
  playLabel?: string;
  pauseLabel?: string;
};

function PlaceholdersHybridWaveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      data-slot="placeholders-hybrid-waveform"
      data-playing={isPlaying ? "true" : "false"}
      aria-hidden
      className="flex h-9 w-full max-w-[120px] items-center justify-center gap-0.5 overflow-hidden px-4 py-1"
    >
      {PLACEHOLDERS_HYBRID_WAVEFORM_HEIGHTS_PX.map((height, index) => (
        <span
          key={index}
          className="bg-select-muted-text w-0.5 shrink-0 rounded-[50px]"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}

function PlaceholdersHybridSelectOverlay({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  if (!onClick || disabled) return null;

  return (
    <button
      type="button"
      data-slot="placeholders-hybrid-select"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute inset-0 z-1 cursor-pointer rounded-[20px] border-0 bg-transparent p-0",
        "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
      )}
    />
  );
}

export function PlaceholdersHybrid({
  size = "fixed",
  status,
  defaultStatus = PLACEHOLDERS_HYBRID_DEFAULT_STATUS,
  title = PLACEHOLDERS_HYBRID_DEFAULT_TITLE,
  subtitle = PLACEHOLDERS_HYBRID_DEFAULT_SUBTITLE,
  audioLabel = PLACEHOLDERS_HYBRID_DEFAULT_AUDIO_LABEL,
  imageSrc = PLACEHOLDERS_HYBRID_DEFAULT_IMAGE_SRC,
  imageAlt = title,
  playing,
  defaultPlaying = false,
  onStatusChange,
  onClear,
  onPlay,
  onPlayingChange,
  closeLabel,
  playLabel = "Play audio",
  pauseLabel = "Pause audio",
  className,
  type = "button",
  onClick,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: PlaceholdersHybridProps) {
  const [internalStatus, setInternalStatus] =
    React.useState<PlaceholdersHybridStatus>(defaultStatus);
  const [internalPlaying, setInternalPlaying] = React.useState(defaultPlaying);
  const resolvedStatus = status ?? internalStatus;
  const isPlaying = playing ?? internalPlaying;

  const setStatus = (nextStatus: PlaceholdersHybridStatus) => {
    if (status === undefined) {
      setInternalStatus(nextStatus);
    }
    onStatusChange?.(nextStatus);
  };

  const setPlaying = (nextPlaying: boolean) => {
    if (playing === undefined) {
      setInternalPlaying(nextPlaying);
    }
    onPlayingChange?.(nextPlaying);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  };

  const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClear?.(event);
    if (event.defaultPrevented) return;
    setPlaying(false);
    setStatus("empty");
  };

  const handlePlayToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onPlay?.(event);
    if (event.defaultPrevented) return;
    setPlaying(!isPlaying);
  };

  const selectLabel = `Change ${resolvedStatus === "audio" ? audioLabel : title}`;

  const resolvedCloseLabel =
    closeLabel ?? (resolvedStatus === "audio" ? `Remove ${audioLabel}` : `Remove ${title}`);
  const resolvedActionLabel = isPlaying ? pauseLabel : playLabel;

  if (resolvedStatus === "loaded") {
    return (
      <div
        data-slot="placeholders-hybrid"
        data-status="loaded"
        className={cn(placeholdersHybridVariants({ size, status: "loaded" }), className)}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes={
            size === "fluid" || size === "desktop" ? "160px" : size === "mobile" ? "140px" : "240px"
          }
          className="object-cover object-top"
        />

        <Close
          type="button"
          size="small"
          status="default"
          aria-label={resolvedCloseLabel}
          onClick={handleClear}
          className={cn(
            "absolute top-3 right-3 z-10",
            "bg-surface-strong! text-tooltip-text border-border-focus size-6 rounded-full border p-1",
            "hover:bg-surface-strong! hover:text-tooltip-text dark:hover:bg-surface-strong!",
          )}
        />

        <PlaceholdersHybridSelectOverlay
          label={selectLabel}
          disabled={disabled}
          onClick={onClick ? handleClick : undefined}
        />
      </div>
    );
  }

  if (resolvedStatus === "audio") {
    return (
      <div
        data-slot="placeholders-hybrid"
        data-status="audio"
        data-playing={isPlaying ? "true" : "false"}
        className={cn(placeholdersHybridVariants({ size, status: "audio" }), className)}
      >
        <Close
          type="button"
          size="small"
          status="default"
          aria-label={resolvedCloseLabel}
          onClick={handleClear}
          className={cn(
            "absolute top-3 right-3 z-10",
            "bg-surface-strong! text-tooltip-text border-border-focus size-6 rounded-full border p-1",
            "hover:bg-surface-strong! hover:text-tooltip-text dark:hover:bg-surface-strong!",
          )}
        />

        <span className="text-tooltip-text text-sm leading-5 font-medium">{audioLabel}</span>

        <button
          type="button"
          data-slot="placeholders-hybrid-play"
          data-playing={isPlaying ? "true" : "false"}
          aria-label={resolvedActionLabel}
          aria-pressed={isPlaying}
          onClick={handlePlayToggle}
          className={cn(
            "z-2 size-9 min-h-0 min-w-0 shrink-0 cursor-pointer rounded-full border-0 p-3",
            "bg-transparent! bg-[image:var(--gradient-rose)]!",
            "hover:bg-[image:var(--gradient-rose)]! hover:opacity-90",
            "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
          )}
        >
          <Image
            src={isPlaying ? PLACEHOLDERS_HYBRID_PAUSE_ICON_SRC : PLACEHOLDERS_HYBRID_PLAY_ICON_SRC}
            alt=""
            aria-hidden
            width={12}
            height={12}
            className="size-3 object-contain"
          />
        </button>

        <PlaceholdersHybridWaveform isPlaying={isPlaying} />

        <PlaceholdersHybridSelectOverlay
          label={selectLabel}
          disabled={disabled}
          onClick={onClick ? handleClick : undefined}
        />
      </div>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      data-slot="placeholders-hybrid"
      data-status="empty"
      aria-label={ariaLabel ?? `Add ${title}`}
      onClick={handleClick}
      className={cn(
        placeholdersHybridVariants({ size, status: "empty" }),
        "cursor-pointer appearance-none",
        "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <PaperclipIcon aria-hidden className="text-select-muted-text size-5 shrink-0" />

      <span className="flex w-full flex-col items-center">
        <span className="text-select-muted-text w-full text-center text-sm leading-5 font-medium">
          {title}
        </span>
        <span className="text-gray-text w-full text-center text-xs leading-4 font-medium">
          {subtitle}
        </span>
      </span>
    </button>
  );
}

export {
  PLACEHOLDERS_HYBRID_DEFAULT_AUDIO_LABEL,
  PLACEHOLDERS_HYBRID_DEFAULT_IMAGE_SRC,
  PLACEHOLDERS_HYBRID_DEFAULT_STATUS,
  PLACEHOLDERS_HYBRID_DEFAULT_SUBTITLE,
  PLACEHOLDERS_HYBRID_DEFAULT_TITLE,
  PLACEHOLDERS_HYBRID_DESKTOP_HEIGHT,
  PLACEHOLDERS_HYBRID_DESKTOP_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_DESKTOP_WIDTH,
  PLACEHOLDERS_HYBRID_FLUID_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_HEIGHT,
  PLACEHOLDERS_HYBRID_MOBILE_HEIGHT,
  PLACEHOLDERS_HYBRID_MOBILE_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_MOBILE_WIDTH,
  PLACEHOLDERS_HYBRID_SIZE_CLASS,
  PLACEHOLDERS_HYBRID_SIZES,
  PLACEHOLDERS_HYBRID_STATUSES,
  PLACEHOLDERS_HYBRID_WIDTH,
  type PlaceholdersHybridSize,
  type PlaceholdersHybridStatus,
} from "./placeholders-hybrid.constants";
