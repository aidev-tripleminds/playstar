"use client";

import * as React from "react";

type UseSimpleAudioPlaybackOptions = {
  src?: string;
  onPlayingChange?: (playing: boolean) => void;
};

type UseSimpleAudioPlaybackResult = {
  isLoading: boolean;
  isPlaying: boolean;
  togglePlayPause: () => void;
};

/**
 * Play a remote audio file through a plain `<audio>` element, created on the
 * first play and never before.
 *
 * The reason this exists next to {@link useAudioCompactPlayback}: drawing a
 * real waveform means fetching and decoding the bytes, and a cross-origin
 * `fetch` needs the bucket to answer with CORS headers. Our media bucket is
 * public but sends none, so every waveform against it fails — a 200 response
 * the browser then discards, leaving the row spinning forever. An `<audio>`
 * element with no `crossOrigin` attribute is a plain media load, not a CORS
 * request, so it plays from exactly the same URL that `fetch` cannot read.
 *
 * `preload="none"` keeps that true of the network too: nothing is requested
 * until the user actually clicks play.
 */
export function useSimpleAudioPlayback({
  src,
  onPlayingChange,
}: UseSimpleAudioPlaybackOptions): UseSimpleAudioPlaybackResult {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const onPlayingChangeRef = React.useRef(onPlayingChange);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    onPlayingChangeRef.current = onPlayingChange;
  }, [onPlayingChange]);

  // A new source is a new sample: drop the old one's playback state in the
  // same render rather than letting a stale "playing" flash through. React's
  // sanctioned adjust-state-during-render pattern.
  const [lastSrc, setLastSrc] = React.useState(src);
  if (lastSrc !== src) {
    setLastSrc(src);
    setIsPlaying(false);
    setIsLoading(false);
  }

  // An element that outlives its source keeps playing (and keeps its buffer),
  // so tear it down on unmount and whenever the source changes.
  React.useEffect(() => {
    return () => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      audio.pause();
      audio.removeAttribute("src");
      audioRef.current = null;
    };
  }, [src]);

  const togglePlayPause = React.useCallback(() => {
    if (!src) {
      return;
    }

    let audio = audioRef.current;

    if (!audio) {
      audio = new Audio(src);
      audio.preload = "none";

      audio.addEventListener("playing", () => {
        setIsLoading(false);
        setIsPlaying(true);
        onPlayingChangeRef.current?.(true);
      });

      const stop = () => {
        setIsLoading(false);
        setIsPlaying(false);
        onPlayingChangeRef.current?.(false);
      };

      audio.addEventListener("pause", stop);
      audio.addEventListener("ended", stop);
      audio.addEventListener("error", stop);

      audioRef.current = audio;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setIsLoading(true);
    void Promise.resolve(audio.play()).catch(() => {
      setIsLoading(false);
      setIsPlaying(false);
      onPlayingChangeRef.current?.(false);
    });
  }, [src]);

  return { isLoading, isPlaying, togglePlayPause };
}
