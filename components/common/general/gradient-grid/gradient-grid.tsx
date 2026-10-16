"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

export const GRADIENT_GRID_DEFAULT_MIN_OPACITY = 0.45;
export const GRADIENT_GRID_DEFAULT_MAX_OPACITY = 0.8;

export const GRADIENT_GRID_DEFAULT_RADIAL = "var(--gradient-pink-radial)";

export type GradientGridProps = {
  className?: string;
  showGrid?: boolean;
  /** CSS background for the radial bloom layer. */
  radialGradient?: string;
  /** Radial bloom opacity (0–1). */
  minOpacity?: number;
  /** Grid overlay opacity (0–1). */
  maxOpacity?: number;
};

export function GradientGrid({
  className,
  showGrid = true,
  radialGradient = GRADIENT_GRID_DEFAULT_RADIAL,
  minOpacity = GRADIENT_GRID_DEFAULT_MIN_OPACITY,
  maxOpacity = GRADIENT_GRID_DEFAULT_MAX_OPACITY,
}: GradientGridProps) {
  return (
    <div className={cn("relative h-[705px] w-full overflow-hidden", className)}>
      <div
        data-slot="gradient-grid-bloom"
        className="absolute inset-0 [border-radius:50%]"
        style={{
          // `backgroundImage` (not the `background` shorthand) so Safari/iOS
          // resolves CSS-variable gradients. `50%` radius instead of
          // `rounded-full` (`infinity`) so WebKit does not drop the bloom clip.
          backgroundImage: radialGradient,
          opacity: minOpacity,
        }}
      />
      {showGrid ? (
        <div
          className="absolute top-[10.21%] right-0 bottom-[10.21%] left-0 overflow-hidden mix-blend-overlay"
          style={{ opacity: maxOpacity }}
        >
          <Image
            src="/assets/gradient-net.svg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="max-h-full max-w-full object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}
