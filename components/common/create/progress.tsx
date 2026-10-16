"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type ProgressProps = React.ComponentPropsWithoutRef<"div"> & {
  variant?: "progress" | "disable" | "unvisited";
  asSet?: boolean;
};

function ProgressLine({ variant }: { variant: "progress" | "disable" | "unvisited" }) {
  const filled = variant === "progress";

  return (
    <div
      className={cn(
        "relative h-[3px] w-full overflow-hidden",
        // FRONT-870: a line into a step this run has never opened is Neutral 800.
        // A line between steps already opened stays the lighter grey track.
        variant === "unvisited" ? "bg-surface-strong" : "bg-handle-bg",
      )}
    >
      {/* FRONT-849: the rose fill grows across the track instead of appearing at once. */}
      <div
        data-slot="progress-fill"
        className={cn(
          "h-full bg-[image:var(--gradient-rose)] transition-[width] duration-500 ease-out motion-reduce:transition-none",
          filled ? "w-full" : "w-0",
        )}
      />
    </div>
  );
}

export function Progress({
  variant = "progress",
  asSet = false,
  className,
  ...props
}: ProgressProps) {
  if (asSet) {
    return (
      <div
        className={cn("relative w-full overflow-hidden rounded-[5px] p-5", className)}
        {...props}
      >
        <div className="flex w-full flex-col gap-[22px]">
          <ProgressLine variant="progress" />
          <ProgressLine variant="disable" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <ProgressLine variant={variant} />
    </div>
  );
}
