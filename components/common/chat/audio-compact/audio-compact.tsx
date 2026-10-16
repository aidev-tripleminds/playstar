"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAudioCompactPlayback } from "@/hooks/use-audio-compact-playback";
import { cn } from "@/lib/utils";

import { AUDIO_COMPACT_MAX_WIDTH_PX } from "./audio-compact.constants";
import { AudioCompactWaveform } from "./components/audio-compact-waveform";

export type AudioCompactProps = Omit<React.ComponentProps<"div">, "children"> & {
  src?: string;
  playLabel?: string;
  pauseLabel?: string;
  onPlayingChange?: (playing: boolean) => void;
};

export function AudioCompact({
  src,
  playLabel = "Play audio",
  pauseLabel = "Pause audio",
  onPlayingChange,
  className,
  ...props
}: AudioCompactProps) {
  const { waveformContainerRef, isLoading, isReady, isPlaying, togglePlayPause } =
    useAudioCompactPlayback({
      src,
      onPlayingChange,
    });

  const resolvedActionLabel = isPlaying ? pauseLabel : playLabel;

  return (
    <div
      data-slot="audio-compact"
      data-playing={isPlaying ? "true" : "false"}
      data-loading={isLoading ? "true" : "false"}
      data-ready={isReady ? "true" : "false"}
      className={cn(
        "flex w-full max-w-[380px] min-w-[240px] items-center gap-2 rounded-3xl bg-[image:var(--gradient-rose)] py-2 pr-3 pl-3",
        className,
      )}
      style={{ maxWidth: AUDIO_COMPACT_MAX_WIDTH_PX }}
      {...props}
    >
      <Button
        disableActiveEffect
        type="button"
        variant="ghost"
        size="icon-sm"
        data-slot="audio-compact-play"
        aria-label={resolvedActionLabel}
        aria-pressed={isPlaying}
        disabled={!src || !isReady}
        onClick={togglePlayPause}
        className={cn(
          "text-tooltip-text size-6 shrink-0 cursor-pointer border-none bg-transparent p-0 shadow-none",
          "hover:bg-transparent hover:opacity-90 disabled:opacity-100",
        )}
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
      <AudioCompactWaveform
        containerRef={waveformContainerRef}
        isLoading={isLoading}
        isReady={isReady}
      />
    </div>
  );
}
