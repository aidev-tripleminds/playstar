"use client";

import "../audio-compact-waveform.css";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  AUDIO_COMPACT_DUMMY_WAVEFORM_HEIGHTS,
  AUDIO_COMPACT_WAVEFORM_COLORS,
  AUDIO_COMPACT_WAVEFORM_HEIGHT_PX,
  AUDIO_COMPACT_WAVEFORM_UNPLAYED_OPACITY,
} from "../audio-compact.constants";

export type AudioCompactWaveformProps = {
  containerRef: React.Ref<HTMLDivElement>;
  isLoading: boolean;
  isReady: boolean;
  className?: string;
};

function AudioCompactDummyWaveform() {
  return (
    <div
      data-slot="audio-compact-waveform-dummy"
      className="pointer-events-none absolute inset-0 flex items-center gap-0.5 overflow-hidden"
      aria-hidden
    >
      {AUDIO_COMPACT_DUMMY_WAVEFORM_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className="w-0.5 shrink-0 rounded-full"
          style={{
            height: `${Math.max(height * AUDIO_COMPACT_WAVEFORM_HEIGHT_PX, 2)}px`,
            backgroundColor: AUDIO_COMPACT_WAVEFORM_COLORS.played,
            opacity: AUDIO_COMPACT_WAVEFORM_UNPLAYED_OPACITY,
          }}
        />
      ))}
    </div>
  );
}

export function AudioCompactWaveform({
  containerRef,
  isLoading,
  isReady,
  className,
}: AudioCompactWaveformProps) {
  const showDummyWaveform = Boolean(!isReady);

  return (
    <div
      data-slot="audio-compact-waveform"
      data-loading={isLoading && !isReady ? "true" : "false"}
      data-ready={isReady ? "true" : "false"}
      className={cn("relative min-w-[36px] flex-1 basis-0", className)}
      style={{ height: AUDIO_COMPACT_WAVEFORM_HEIGHT_PX }}
    >
      {showDummyWaveform ? <AudioCompactDummyWaveform /> : null}
      <div
        ref={containerRef}
        data-slot="audio-compact-waveform-canvas"
        className={cn(
          "block w-full cursor-pointer",
          showDummyWaveform && "pointer-events-none opacity-0",
        )}
        style={
          {
            height: AUDIO_COMPACT_WAVEFORM_HEIGHT_PX,
            "--audio-compact-waveform-unplayed-opacity": AUDIO_COMPACT_WAVEFORM_UNPLAYED_OPACITY,
          } as React.CSSProperties
        }
        aria-hidden={!isReady}
      />
    </div>
  );
}
