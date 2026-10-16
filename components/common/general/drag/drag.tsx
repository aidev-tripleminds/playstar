import * as React from "react";

import { cn } from "@/lib/utils";

/** Figma `24001:171639` — 4×2 dots, 8px apart, radius 2, on a 28×12 frame. */
const DRAG_DOTS = [
  [2, 2],
  [10, 2],
  [18, 2],
  [26, 2],
  [2, 10],
  [10, 10],
  [18, 10],
  [26, 10],
] as const;

export type DragProps = React.ComponentProps<"svg">;

export function Drag({ className, "aria-label": ariaLabel, ...props }: DragProps) {
  const labelled = Boolean(ariaLabel);

  return (
    <svg
      data-slot="drag"
      width={28}
      height={12}
      viewBox="0 0 28 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={ariaLabel}
      className={cn("text-divider-label h-3 w-7 shrink-0", className)}
      {...props}
    >
      {DRAG_DOTS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={2} fill="currentColor" />
      ))}
    </svg>
  );
}
