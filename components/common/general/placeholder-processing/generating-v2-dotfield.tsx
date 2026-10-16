"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  decodeGeneratingV2Frames,
  GENERATING_V2_BACKGROUND,
  GENERATING_V2_COLS,
  GENERATING_V2_DURATION_MS,
  GENERATING_V2_FRAME_COUNT,
  GENERATING_V2_HEIGHT,
  GENERATING_V2_OPACITY_MAX,
  GENERATING_V2_OPACITY_MIN,
  GENERATING_V2_ORIGIN_X,
  GENERATING_V2_ORIGIN_Y,
  GENERATING_V2_PITCH,
  GENERATING_V2_R_MAX,
  GENERATING_V2_R_MIN,
  GENERATING_V2_ROWS,
  GENERATING_V2_WIDTH,
} from "./generating-v2-dotfield.constants";

const GENERATING_V2_PIXELS = decodeGeneratingV2Frames();
const GENERATING_V2_DOT_COUNT = GENERATING_V2_COLS * GENERATING_V2_ROWS;

function readBrightness(frameIndex: number, dotIndex: number): number {
  return GENERATING_V2_PIXELS[frameIndex * GENERATING_V2_DOT_COUNT + dotIndex]! / 255;
}

export type GeneratingV2DotfieldProps = {
  className?: string;
};

export function GeneratingV2Dotfield({ className }: GeneratingV2DotfieldProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      return;
    }

    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const startedAt = performance.now();
    let frameId = 0;

    const sizeCanvas = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssWidth = canvas.clientWidth || GENERATING_V2_WIDTH;
      const cssHeight = canvas.clientHeight || GENERATING_V2_HEIGHT;
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (now: number) => {
      const cssWidth = canvas.clientWidth || GENERATING_V2_WIDTH;
      const cssHeight = canvas.clientHeight || GENERATING_V2_HEIGHT;
      const scale = Math.max(cssWidth / GENERATING_V2_WIDTH, cssHeight / GENERATING_V2_HEIGHT);
      const offsetX = (cssWidth - GENERATING_V2_WIDTH * scale) / 2;
      const offsetY = (cssHeight - GENERATING_V2_HEIGHT * scale) / 2;
      const reducedMotion = Boolean(media?.matches);
      const progress = reducedMotion
        ? 0
        : ((now - startedAt) % GENERATING_V2_DURATION_MS) / GENERATING_V2_DURATION_MS;
      const floatIndex = progress * GENERATING_V2_FRAME_COUNT;
      const frameA = Math.floor(floatIndex) % GENERATING_V2_FRAME_COUNT;
      const frameB = (frameA + 1) % GENERATING_V2_FRAME_COUNT;
      const mix = floatIndex - Math.floor(floatIndex);

      ctx.fillStyle = GENERATING_V2_BACKGROUND;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      for (let row = 0; row < GENERATING_V2_ROWS; row += 1) {
        const y = offsetY + (GENERATING_V2_ORIGIN_Y + row * GENERATING_V2_PITCH) * scale;
        for (let col = 0; col < GENERATING_V2_COLS; col += 1) {
          const dotIndex = row * GENERATING_V2_COLS + col;
          const brightness =
            readBrightness(frameA, dotIndex) * (1 - mix) + readBrightness(frameB, dotIndex) * mix;
          const radius =
            (GENERATING_V2_R_MIN + brightness * (GENERATING_V2_R_MAX - GENERATING_V2_R_MIN)) *
            scale;
          const opacity =
            GENERATING_V2_OPACITY_MIN +
            brightness * (GENERATING_V2_OPACITY_MAX - GENERATING_V2_OPACITY_MIN);
          const x = offsetX + (GENERATING_V2_ORIGIN_X + col * GENERATING_V2_PITCH) * scale;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${opacity})`;
          ctx.fill();
        }
      }

      if (!reducedMotion) {
        frameId = window.requestAnimationFrame(paint);
      }
    };

    sizeCanvas();
    frameId = window.requestAnimationFrame(paint);

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            sizeCanvas();
            if (media?.matches) {
              paint(startedAt);
            }
          });
    observer?.observe(canvas);

    const onMotionChange = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(paint);
    };
    media?.addEventListener("change", onMotionChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      media?.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-slot="generating-v2-dotfield"
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
