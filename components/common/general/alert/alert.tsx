import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export type AlertProps = Omit<React.ComponentProps<"div">, "children"> & {
  text?: React.ReactNode;
  type?: "alert" | "neutral";
  showIcon?: boolean;
  iconSrc?: string;
  iconAlt?: string;
};

const borderVariants: Record<NonNullable<AlertProps["type"]>, string> = {
  alert:
    "bg-[linear-gradient(180deg,var(--color-countdown-border-start),var(--color-countdown-border-end))]",
  neutral:
    "bg-[linear-gradient(180deg,var(--color-alert-border-start),var(--color-alert-border-end))]",
};

export function Alert({
  text = "Lorem ipsum dolorem nevada litera victo eratum et geniase heretis octum citeas.",
  type = "alert",
  showIcon = true,
  iconSrc = "/assets/alert-icon.svg",
  iconAlt = "Alert icon",
  className,
  ...props
}: AlertProps) {
  return (
    <div
      style={{ backgroundColor: "var(--countdown-bg)" }}
      className={cn("w-full rounded-2xl p-px", borderVariants[type], className)}
      {...props}
    >
      <div className="bg-countdown-bg flex items-start gap-3 rounded-2xl p-3">
        {showIcon && (
          <Image src={iconSrc} alt={iconAlt} width={20} height={20} className="mt-px shrink-0" />
        )}
        <p className="text-tooltip-text text-sm leading-5 font-normal">{text}</p>
      </div>
    </div>
  );
}
