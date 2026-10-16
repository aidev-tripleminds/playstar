"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Spinner({ className, style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "relative inline-flex size-8 shrink-0 animate-spin motion-reduce:animate-none",
        className,
      )}
      style={style}
      {...props}
    >
      <span
        aria-hidden
        className="block size-full rounded-full"
        style={{
          background: `
            conic-gradient(
              from 180deg,
              transparent 0deg,
              transparent 40deg,
              rgba(255,255,255,0.18) 90deg,
              rgba(255,255,255,0.45) 140deg,
              #ffffff 180deg,
              rgba(255,255,255,0.65) 210deg,
              rgba(255,255,255,0.28) 250deg,
              rgba(255,255,255,0.12) 290deg,
              transparent 330deg,
              transparent 360deg
            )
          `,
          WebkitMask: "radial-gradient(circle, transparent 56%, black 56%)",
          mask: "radial-gradient(circle, transparent 56%, black 56%)",
        }}
      />
    </div>
  );
}

export { Spinner };
