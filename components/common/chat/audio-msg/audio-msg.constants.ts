import type { WaveSurferOptions } from "wavesurfer.js";

import { AUDIO_COMPACT_WAVEFORM_HEIGHT_PX } from "../audio-compact/audio-compact.constants";

export const AUDIO_MSG_WAVEFORM_COLORS = {
  played: "#fafafa",
  unplayed: "#a3a3a3",
  unplayedCompact: "#e5e5e5",
} as const;

const BASE_WAVESURFER_OPTIONS = {
  height: AUDIO_COMPACT_WAVEFORM_HEIGHT_PX,
  barWidth: 2,
  barGap: 2,
  barRadius: 50,
  barMinHeight: 2,
  normalize: true,
  fillParent: true,
  interact: true,
  dragToSeek: true,
  autoScroll: false,
  autoCenter: false,
  cursorWidth: 0,
  hideScrollbar: true,
} as const;

function createAudioMsgWavesurferOptions(
  waveColor: string,
  progressColor: string,
): Omit<WaveSurferOptions, "container" | "url"> {
  return {
    ...BASE_WAVESURFER_OPTIONS,
    waveColor,
    progressColor,
  };
}

export const AUDIO_MSG_DEFAULT_WAVESURFER_OPTIONS = createAudioMsgWavesurferOptions(
  AUDIO_MSG_WAVEFORM_COLORS.unplayed,
  AUDIO_MSG_WAVEFORM_COLORS.played,
);

export const AUDIO_MSG_COMPACT_WAVESURFER_OPTIONS = createAudioMsgWavesurferOptions(
  AUDIO_MSG_WAVEFORM_COLORS.unplayedCompact,
  AUDIO_MSG_WAVEFORM_COLORS.unplayedCompact,
);

/**
 * Story/demo sample. Served from `public/` on purpose: wavesurfer fetches the
 * whole file to decode the waveform, so a third-party hotlink breaks the demo
 * the moment that host adds CORS/hotlink protection or goes down.
 */
export const AUDIO_MSG_SAMPLE_MP3_SRC = "/assets/sounds/file_audio.wav";

// /** Relative bar heights (px) for the default waveform silhouette. */
// export const AUDIO_MSG_DEFAULT_WAVEFORM_HEIGHTS = [
//   16, 12, 8, 14, 18, 10, 6, 12, 20, 14, 8, 10, 16, 20, 12, 8, 14, 18, 10, 16, 8, 20, 14, 10, 12,
//   18, 10, 16, 20, 12, 8, 14, 10, 16, 20, 12, 8, 14, 18, 10, 16, 12, 8, 14, 18, 10, 6, 12, 20, 14,
//   8, 10, 16, 20, 12, 8, 14, 18, 10, 16, 8, 20, 14, 10, 12,
// ] as const;

// export const AUDIO_MSG_DEFAULT_BAR_COUNT = AUDIO_MSG_DEFAULT_WAVEFORM_HEIGHTS.length;

// /** Shorter waveform for the compact variant. */
// export const AUDIO_MSG_COMPACT_WAVEFORM_HEIGHTS = [
//   16, 12, 8, 14, 18, 10, 6, 12, 20, 14, 8, 10, 16, 20, 12, 8, 14, 18, 10, 16, 8, 20, 14, 10,
// ] as const;

// export const AUDIO_MSG_COMPACT_BAR_COUNT = AUDIO_MSG_COMPACT_WAVEFORM_HEIGHTS.length;

// export const AUDIO_MSG_PLAYED_BAR_OPACITY = 1;
// export const AUDIO_MSG_REMAINING_BAR_OPACITY = 0.6;

// export function getAudioMsgBarAnimationTiming(barIndex: number) {
//   return {
//     delayMs: (barIndex % 13) * 35,
//     durationMs: 700 + (barIndex % 5) * 90,
//   };
// }

// export function getAudioMsgBarOpacity(barIndex: number, progress: number, barCount: number) {
//   if (progress <= 0) {
//     return AUDIO_MSG_PLAYED_BAR_OPACITY;
//   }

//   const playedBars = Math.floor(progress * barCount);
//   return barIndex < playedBars
//     ? AUDIO_MSG_PLAYED_BAR_OPACITY
//     : AUDIO_MSG_REMAINING_BAR_OPACITY;
// }

// Heights derived 1-to-1 from Figma CSS classes:
//   "stretch" bars use "100%" (align-self:stretch in a 20px h-5 flex row = 20px)
//   Numeric bars use exact px values from Figma

// Default waveform — 40 bars, pattern read from Figma rectangleParent TSX sequence
export const AUDIO_MSG_DEFAULT_WAVEFORM_HEIGHTS: (string | number)[] = [
  "100%",
  12,
  14,
  18,
  12,
  16,
  18,
  10,
  12,
  4,
  8,
  12,
  14,
  18,
  12,
  16,
  18,
  10,
  12,
  4,
  "100%",
  12,
  14,
  18,
  12,
  16,
  18,
  10,
  12,
  "100%",
  12,
  14,
  18,
  12,
  16,
  18,
  10,
  12,
  4,
  8,
];

export const AUDIO_MSG_DEFAULT_BAR_COUNT = AUDIO_MSG_DEFAULT_WAVEFORM_HEIGHTS.length;

// Compact waveform — 20 bars
export const AUDIO_MSG_COMPACT_WAVEFORM_HEIGHTS: (string | number)[] = [
  "100%",
  12,
  14,
  18,
  12,
  16,
  18,
  10,
  12,
  4,
  8,
  12,
  14,
  18,
  12,
  16,
  18,
  10,
  12,
  "100%",
];

export const AUDIO_MSG_COMPACT_BAR_COUNT = AUDIO_MSG_COMPACT_WAVEFORM_HEIGHTS.length;
