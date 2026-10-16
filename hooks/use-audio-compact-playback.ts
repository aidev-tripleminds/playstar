"use client";

import * as React from "react";
import WaveSurfer, { type WaveSurferOptions } from "wavesurfer.js";

import { AUDIO_COMPACT_WAVESURFER_OPTIONS } from "@/components/common/chat/audio-compact/audio-compact.constants";
import { applyAudioCompactWaveformStyles } from "@/components/common/chat/audio-compact/utils/apply-audio-compact-waveform-styles";
import { resolveAudioMimeType } from "@/components/common/chat/audio-compact/utils/resolve-audio-mime-type";

type UseAudioCompactPlaybackOptions = {
  src?: string;
  onPlayingChange?: (playing: boolean) => void;
  wavesurferOptions?: Omit<WaveSurferOptions, "container" | "url">;
  applyWaveformStyles?: (container: HTMLElement | null | undefined) => void;
};

type PlaybackState = {
  isLoading: boolean;
  isReady: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
};

type UseAudioCompactPlaybackResult = PlaybackState & {
  waveformContainerRef: React.RefCallback<HTMLDivElement>;
  togglePlayPause: () => void;
};

const IDLE_PLAYBACK_STATE: PlaybackState = {
  isLoading: false,
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

const LOADING_PLAYBACK_STATE: PlaybackState = {
  isLoading: true,
  isReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
};

export function useAudioCompactPlayback({
  src,
  onPlayingChange,
  wavesurferOptions = AUDIO_COMPACT_WAVESURFER_OPTIONS,
  applyWaveformStyles = applyAudioCompactWaveformStyles,
}: UseAudioCompactPlaybackOptions): UseAudioCompactPlaybackResult {
  const wavesurferRef = React.useRef<WaveSurfer | null>(null);
  const onPlayingChangeRef = React.useRef(onPlayingChange);
  const [waveformContainer, setWaveformContainer] = React.useState<HTMLDivElement | null>(null);
  const [playbackState, setPlaybackState] = React.useState<PlaybackState>(IDLE_PLAYBACK_STATE);

  const isInactive = !src || !waveformContainer;
  const resolvedPlaybackState = isInactive ? IDLE_PLAYBACK_STATE : playbackState;

  const waveformContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    setWaveformContainer(node);
  }, []);

  React.useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange;
  }, [onPlayingChange]);

  React.useEffect(() => {
    if (!src || !waveformContainer) {
      return;
    }

    let isDisposed = false;
    let wavesurfer: WaveSurfer | null = null;

    const handleLoading = () => {
      if (!isDisposed) {
        setPlaybackState((current) => ({
          ...current,
          isLoading: true,
          isReady: false,
        }));
      }
    };

    const syncWaveformStyles = () => {
      applyWaveformStyles(waveformContainer);
    };

    const syncWaveformProgress = () => {
      if (!wavesurfer || isDisposed) {
        return;
      }

      const duration = wavesurfer.getDuration();

      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }

      syncWaveformStyles();

      wavesurfer
        .getRenderer()
        .renderProgress(wavesurfer.getCurrentTime() / duration, wavesurfer.isPlaying());
    };

    const handleReady = (readyDuration: number) => {
      if (!isDisposed) {
        setPlaybackState((current) => ({
          ...current,
          isLoading: false,
          isReady: true,
          duration: readyDuration,
        }));
        window.requestAnimationFrame(() => {
          syncWaveformProgress();
        });
      }
    };

    const handlePlay = () => {
      if (!isDisposed) {
        setPlaybackState((current) => ({
          ...current,
          isPlaying: true,
        }));
        onPlayingChangeRef.current?.(true);
      }
    };

    const handlePause = () => {
      if (!isDisposed) {
        setPlaybackState((current) => ({
          ...current,
          isPlaying: false,
        }));
        onPlayingChangeRef.current?.(false);
      }
    };

    const handleTimeUpdate = (time: number) => {
      if (!isDisposed) {
        setPlaybackState((current) => ({
          ...current,
          currentTime: time,
        }));
        syncWaveformProgress();
      }
    };

    const handleInteraction = (newTime: number) => {
      if (!isDisposed) {
        setPlaybackState((current) => ({
          ...current,
          currentTime: newTime,
        }));
        syncWaveformProgress();
      }
    };

    const handleError = () => {
      if (!isDisposed) {
        setPlaybackState(IDLE_PLAYBACK_STATE);
        onPlayingChangeRef.current?.(false);
      }
    };

    const initWaveSurfer = () => {
      if (isDisposed || wavesurferRef.current) {
        return;
      }

      const blobMimeType = resolveAudioMimeType(src);

      wavesurfer = WaveSurfer.create({
        container: waveformContainer,
        ...wavesurferOptions,
        ...(blobMimeType ? { blobMimeType } : {}),
      });

      wavesurferRef.current = wavesurfer;
      syncWaveformStyles();

      wavesurfer.on("load", handleLoading);
      wavesurfer.on("loading", handleLoading);
      wavesurfer.on("ready", handleReady);
      wavesurfer.on("redrawcomplete", syncWaveformProgress);
      wavesurfer.on("play", handlePlay);
      wavesurfer.on("pause", () => {
        handlePause();
        syncWaveformProgress();
      });
      wavesurfer.on("finish", () => {
        handlePause();
        syncWaveformProgress();
      });
      wavesurfer.on("timeupdate", handleTimeUpdate);
      wavesurfer.on("audioprocess", handleTimeUpdate);
      wavesurfer.on("interaction", handleInteraction);
      wavesurfer.on("seeking", handleTimeUpdate);
      wavesurfer.on("error", handleError);

      setPlaybackState(LOADING_PLAYBACK_STATE);

      void wavesurfer.load(src).catch(handleError);
    };

    const frameId = window.requestAnimationFrame(() => {
      if (!isDisposed) {
        initWaveSurfer();
      }
    });

    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(frameId);
      wavesurfer?.destroy();
      wavesurferRef.current = null;
    };
  }, [applyWaveformStyles, src, waveformContainer, wavesurferOptions]);

  const togglePlayPause = React.useCallback(() => {
    const wavesurfer = wavesurferRef.current;

    if (!wavesurfer || !resolvedPlaybackState.isReady) {
      return;
    }

    void wavesurfer.playPause();
  }, [resolvedPlaybackState.isReady]);

  return {
    waveformContainerRef,
    ...resolvedPlaybackState,
    togglePlayPause,
  };
}
