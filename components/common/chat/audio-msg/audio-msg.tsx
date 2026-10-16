"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { AudioCompactWaveform } from "@/components/common/chat/audio-compact/components/audio-compact-waveform";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAudioCompactPlayback } from "@/hooks/use-audio-compact-playback";
import { useSimpleAudioPlayback } from "@/hooks/use-simple-audio-playback";
import { cn } from "@/lib/utils";

import { Close } from "../../general/close/close";
import {
  AUDIO_MSG_COMPACT_WAVESURFER_OPTIONS,
  AUDIO_MSG_DEFAULT_WAVESURFER_OPTIONS,
} from "./audio-msg.constants";

function noopApplyWaveformStyles() {}

const audioMsgShellVariants = cva(
  "group/shell inline-flex items-center gap-2 rounded-[64px] p-0.5 transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "w-full max-w-full",
        compact: "w-fit ",
      },
      selected: {
        true: "bg-[image:var(--gradient-rose)]",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        selected: false,
        className: "bg-tooltip-default-bg hover:bg-surface-strong",
      },
      {
        variant: "compact",
        selected: false,
        // className: "bg-surface-strong",
        className: "audio-compact",
      },
    ],
    defaultVariants: {
      variant: "default",
      selected: false,
    },
  },
);

const audioMsgInnerVariants = cva(
  "relative flex min-w-0 items-center gap-3 rounded-[64px] bg-tooltip-default-bg py-2 pr-4 pl-2 transition-colors duration-200 group-hover/shell:bg-surface-strong",
  {
    variants: {
      variant: {
        default: "w-full flex-1",
        compact: "w-fit flex-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const audioMsgPlayButtonVariants = cva(
  [
    "size-9 shrink-0 rounded-full border-none p-3 shadow-none",
    "text-tooltip-text transition-[opacity,background-image,background-color] duration-200",
    "hover:opacity-90",
    // Override ghost variant hover:bg-muted (near-white flash on enter/leave).
    "hover:!text-tooltip-text",
  ],
  {
    variants: {
      accent: {
        true: "",
        false: "",
      },
      compact: {
        true: "!bg-brand-primary hover:!bg-brand-primary group-hover/shell:!bg-brand-primary",
        false: "",
      },
    },
    compoundVariants: [
      {
        compact: false,
        accent: true,
        className: "!bg-[image:var(--gradient-rose)] hover:!bg-[image:var(--gradient-rose)]",
      },
      {
        compact: false,
        accent: false,
        className:
          "!bg-surface-strong group-hover/shell:!bg-[image:var(--gradient-rose)] hover:!bg-[image:var(--gradient-rose)]",
      },
    ],
    defaultVariants: {
      accent: false,
      compact: false,
    },
  },
);

export type AudioMsgVariant = NonNullable<VariantProps<typeof audioMsgShellVariants>["variant"]>;

export type AudioMsgProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof audioMsgShellVariants> & {
    label?: string;
    src?: string;
    selected?: boolean;
    defaultSelected?: boolean;
    playLabel?: string;
    pauseLabel?: string;
    dismissLabel?: string;
    /**
     * Draw the placeholder bars instead of the file's real waveform, and play
     * through a plain `<audio>` element on click.
     *
     * Use this for audio served from a bucket that answers without CORS
     * headers: WaveSurfer has to `fetch` and decode the bytes, which such a
     * bucket makes impossible, so the row would spin forever. See
     * {@link useSimpleAudioPlayback}.
     */
    decorativeWaveform?: boolean;
    onPlayingChange?: (playing: boolean) => void;
    onSelectedChange?: (selected: boolean) => void;
    onDismiss?: () => void;
  };

export function AudioMsg({
  variant = "default",
  label = "Audio",
  src,
  selected,
  defaultSelected = false,
  playLabel = "Play audio",
  pauseLabel = "Pause audio",
  dismissLabel = "Dismiss audio",
  decorativeWaveform = false,
  onPlayingChange,
  onSelectedChange,
  onDismiss,
  className,
  onClick,
  ...props
}: AudioMsgProps) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);

  const isSelectedControlled = selected !== undefined;
  const isSelected = isSelectedControlled ? selected : internalSelected;

  const isCompact = variant === "compact";
  const isSelectable = !isCompact;
  const resolvedSelected = isSelectable && isSelected;
  const wavesurferOptions = isCompact
    ? AUDIO_MSG_COMPACT_WAVESURFER_OPTIONS
    : AUDIO_MSG_DEFAULT_WAVESURFER_OPTIONS;

  // Exactly one of the two players is armed: the other is handed no source and
  // stays idle, so neither loads anything nor reports playback.
  const wavesurferPlayback = useAudioCompactPlayback({
    src: decorativeWaveform ? undefined : src,
    onPlayingChange: decorativeWaveform ? undefined : onPlayingChange,
    wavesurferOptions,
    applyWaveformStyles: noopApplyWaveformStyles,
  });
  const simplePlayback = useSimpleAudioPlayback({
    src: decorativeWaveform ? src : undefined,
    onPlayingChange: decorativeWaveform ? onPlayingChange : undefined,
  });

  const { waveformContainerRef } = wavesurferPlayback;
  const isLoading = decorativeWaveform ? simplePlayback.isLoading : wavesurferPlayback.isLoading;
  const isPlaying = decorativeWaveform ? simplePlayback.isPlaying : wavesurferPlayback.isPlaying;
  // Nothing has to load before a decorative row can play, so it is ready the
  // moment it has a source — that is what keeps the play button enabled.
  const isReady = decorativeWaveform ? Boolean(src) : wavesurferPlayback.isReady;
  const togglePlayPause = decorativeWaveform
    ? simplePlayback.togglePlayPause
    : wavesurferPlayback.togglePlayPause;

  const playAccent = isPlaying || (isSelectable && isSelected);
  const actionLabel = isPlaying ? pauseLabel : playLabel;

  const setSelected = React.useCallback(
    (nextSelected: boolean) => {
      if (!isSelectedControlled) {
        setInternalSelected(nextSelected);
      }
      onSelectedChange?.(nextSelected);
    },
    [isSelectedControlled, onSelectedChange],
  );

  const handleShellClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !isSelectable) {
      return;
    }

    const target = event.target as HTMLElement;
    // A real waveform is a seek surface, so a click on it must not also change
    // the selection. Decorative bars seek nothing, so they behave like the rest
    // of the row.
    const inertSlots = decorativeWaveform
      ? '[data-slot="audio-msg-play"], [data-slot="audio-msg-dismiss"]'
      : '[data-slot="audio-msg-play"], [data-slot="audio-msg-waveform"], [data-slot="audio-msg-dismiss"], [data-slot="audio-compact-waveform-canvas"]';

    if (target.closest(inertSlots)) {
      return;
    }

    setSelected(!isSelected);
  };

  const handlePlayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    togglePlayPause();
  };

  const handleWaveformClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!decorativeWaveform) {
      event.stopPropagation();
    }
  };

  const handleDismissClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDismiss?.();
  };

  return (
    <div
      data-slot="audio-msg"
      data-variant={variant}
      data-selected={resolvedSelected ? "true" : "false"}
      data-playing={isPlaying ? "true" : "false"}
      data-loading={isLoading ? "true" : "false"}
      data-ready={isReady ? "true" : "false"}
      role={isSelectable ? "button" : "group"}
      tabIndex={isSelectable ? 0 : undefined}
      aria-pressed={isSelectable ? resolvedSelected : undefined}
      onClick={handleShellClick}
      onKeyDown={
        isSelectable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setSelected(!isSelected);
              }
            }
          : undefined
      }
      className={cn(audioMsgShellVariants({ variant, selected: resolvedSelected }), className)}
      {...props}
    >
      <div className={cn(audioMsgInnerVariants({ variant }))}>
        <Button
          disableActiveEffect
          type="button"
          variant="ghost"
          size="icon-sm"
          data-slot="audio-msg-play"
          aria-label={actionLabel}
          aria-pressed={isPlaying}
          disabled={!src || !isReady}
          onClick={handlePlayClick}
          className={audioMsgPlayButtonVariants({ accent: playAccent, compact: isCompact })}
        >
          {!isReady || isLoading ? (
            <Spinner className="size-6" />
          ) : isPlaying ? (
            <Image
              src="/assets/pause.svg"
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="size-6 object-contain"
            />
          ) : (
            <Image
              src="/assets/play.svg"
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="size-6 object-contain"
            />
          )}
        </Button>

        <span
          data-slot="audio-msg-label"
          className={cn(
            "text-tooltip-text block max-w-[120px] min-w-0 shrink-0 overflow-hidden text-sm leading-5 font-medium text-ellipsis whitespace-nowrap select-none",
            !isCompact && "cursor-pointer",
          )}
        >
          {label}
        </span>

        <div
          data-slot="audio-msg-waveform"
          className={cn("min-w-0", isCompact ? "w-9 shrink-0" : "min-w-[120px] flex-1 pl-4")}
          onClick={handleWaveformClick}
        >
          <AudioCompactWaveform
            containerRef={waveformContainerRef}
            isLoading={isLoading}
            // A decorative row never becomes "ready" as far as the waveform is
            // concerned: the placeholder bars ARE the waveform.
            isReady={decorativeWaveform ? false : isReady}
          />
        </div>

        {isCompact ? (
          <Close
            size={"small"}
            data-slot="audio-msg-dismiss"
            aria-label={dismissLabel}
            className="absolute -top-2 -right-2 size-6"
            onClick={handleDismissClick}
          />
        ) : null}
      </div>
    </div>
  );
}
