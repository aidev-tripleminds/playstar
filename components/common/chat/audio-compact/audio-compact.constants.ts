import type { WaveSurferOptions } from "wavesurfer.js";

export const AUDIO_COMPACT_MAX_WIDTH_PX = 380;

export const AUDIO_COMPACT_WAVEFORM_HEIGHT_PX = 24;

export const AUDIO_COMPACT_WAVEFORM_COLORS = {
  played: "#fafafa",
  unplayed: "rgba(250, 250, 250, 0.6)",
} as const;

/** Deterministic bar heights (0–1) for the loading placeholder waveform. */
export const AUDIO_COMPACT_DUMMY_WAVEFORM_HEIGHTS = [
  0.28, 0.42, 0.65, 0.38, 0.9, 0.55, 0.32, 0.72, 0.48, 0.85, 0.4, 0.58, 0.75, 0.35, 0.62, 0.5, 0.88,
  0.45, 0.3, 0.7, 0.52, 0.8, 0.36, 0.6, 0.44, 0.78, 0.33, 0.68, 0.5, 0.92, 0.4, 0.56, 0.74, 0.34,
  0.64, 0.48, 0.82, 0.38, 0.7, 0.46, 0.58, 0.86, 0.42, 0.66, 0.52, 0.76, 0.36, 0.62, 0.44, 0.8, 0.5,
  0.7, 0.4, 0.88, 0.48, 0.6, 0.34, 0.72, 0.55, 0.78, 0.38, 0.65, 0.46, 0.84, 0.42,
] as const;

/** WaveSurfer clones base-canvas alpha into the progress layer via source-in. */
export const AUDIO_COMPACT_WAVEFORM_BAR_COLOR = AUDIO_COMPACT_WAVEFORM_COLORS.played;

export const AUDIO_COMPACT_WAVEFORM_UNPLAYED_OPACITY = 0.6;

export const AUDIO_COMPACT_WAVESURFER_OPTIONS: Omit<WaveSurferOptions, "container" | "url"> = {
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
  waveColor: AUDIO_COMPACT_WAVEFORM_BAR_COLOR,
  progressColor: AUDIO_COMPACT_WAVEFORM_BAR_COLOR,
};

export const AUDIO_COMPACT_SAMPLE_SRC =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
