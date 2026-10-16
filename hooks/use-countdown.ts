"use client";

import * as React from "react";

export type UseCountdownOptions = {
  initialMs: number;
  intervalMs?: number;
};

export type CountdownParts = {
  minutes: number;
  seconds: number;
  centiseconds: number;
  totalSeconds: number;
  remainingMs: number;
  isComplete: boolean;
};

export function resolveCountdownInitialMs(
  units: readonly { value: number }[],
  fallbackMs = 0,
): number {
  const [minutes, seconds, centiseconds] = units;

  if (!minutes && !seconds && !centiseconds) {
    return fallbackMs;
  }

  return (minutes.value * 60 + seconds.value) * 1000 + centiseconds.value * 10;
}

export function getCountdownParts(remainingMs: number): CountdownParts {
  const safeRemainingMs = Math.max(0, remainingMs);
  const totalSeconds = Math.floor(safeRemainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((safeRemainingMs % 1000) / 20);

  return {
    minutes,
    seconds,
    centiseconds,
    totalSeconds,
    remainingMs: safeRemainingMs,
    isComplete: safeRemainingMs <= 0,
  };
}

export function formatCountdownClock(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  if (safeSeconds >= 3600) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${String(Math.floor(safeSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function useCountdown({
  initialMs,
  intervalMs = 1000,
}: UseCountdownOptions): CountdownParts {
  const [remainingMs, setRemainingMs] = React.useState(() => Math.max(0, initialMs));
  const [prevInitialMs, setPrevInitialMs] = React.useState(initialMs);

  if (initialMs !== prevInitialMs) {
    setPrevInitialMs(initialMs);
    setRemainingMs(Math.max(0, initialMs));
  }

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingMs((current) => Math.max(0, current - intervalMs));
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [initialMs, intervalMs]);

  return getCountdownParts(remainingMs);
}
