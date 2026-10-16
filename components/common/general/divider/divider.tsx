import * as React from "react";

import { cn } from "@/lib/utils";

export type DividerProps = React.ComponentProps<"div"> & {
  label?: string;
};

export function Divider({ label = "OR", className, ...props }: DividerProps) {
  return (
    <div
      data-slot="divider"
      className={cn(
        /* min-w: shrink-wrapped parents (e.g. Storybook centered) otherwise flex-1 lines collapse to 0 */
        "flex h-[18px] w-full min-w-[200px] items-center gap-4 text-left",
        className,
      )}
      {...props}
    >
      <div
        data-slot="divider-line-left"
        className="h-px min-w-0 flex-1"
        style={{
          background: "var(--separator-gradient-left)",
        }}
      />

      <span
        data-slot="divider-label"
        className="text-divider-label text-[12px] leading-[18px] font-medium"
      >
        {label}
      </span>

      <div
        data-slot="divider-line-right"
        className="h-px min-w-0 flex-1"
        style={{
          background: "var(--separator-gradient-right)",
        }}
      />
    </div>
  );
}
