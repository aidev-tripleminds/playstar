"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { formatCountdownClock, useCountdown } from "../../../../hooks/use-countdown";

export type CountdownProps = Omit<React.ComponentProps<"div">, "children"> & {
  prefix?: string;
  initialSeconds?: number;
};

export function Countdown({
  prefix = "Sale ending in:",
  initialSeconds = 3540, // 59:00 = 59 * 60
  className,
  ...props
}: CountdownProps) {
  const { totalSeconds } = useCountdown({
    initialMs: initialSeconds * 1000,
    intervalMs: 1000,
  });

  const formattedTime = formatCountdownClock(totalSeconds);

  return (
    <div
      style={{ backgroundColor: "var(--countdown-bg)" }}
      className={cn(
        "box-border w-[280px] rounded-full bg-[linear-gradient(180deg,var(--color-countdown-border-start),var(--color-countdown-border-end))] p-px",
        className,
      )}
      {...props}
    >
      <div className="bg-countdown-bg text-countdown-text flex items-center justify-center rounded-full p-3">
        <span className="text-modal-text text-base leading-6">
          {prefix}{" "}
          <span className="text-tooltip-text leading-[28px] font-semibold">{formattedTime}</span>
        </span>
      </div>
    </div>
  );
}
