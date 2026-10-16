import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Badge as UiBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { LIVE_BADGE_DEFAULT_LABEL } from "./live-badge.constants";

const liveBadgeVariants = cva(
  "box-border inline-flex text-[14px] leading-[14px] md:text-[16px] md:leading-[16px]  gap-1 rounded-[99px] text-tooltip-text px-2 py-1.5 shrink-0 items-center justify-center whitespace-nowrap border-0 bg-surface-strong font-semibold shadow-none",
);

const liveBadgeDotVariants = cva("size-1.5 shrink-0 rounded-full bg-status-active-dot", {
  variants: {
    size: {
      medium: "",
      small: "",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export type LiveBadgeProps = VariantProps<typeof liveBadgeVariants> &
  Omit<React.ComponentProps<typeof UiBadge>, "variant"> & {
    label?: string;
    showDot?: boolean;
    dotClassName?: string;
  };

export function LiveBadge({
  label = LIVE_BADGE_DEFAULT_LABEL,
  showDot = true,
  dotClassName,
  className,
  ...props
}: LiveBadgeProps) {
  return (
    <UiBadge
      data-slot="live-badge"
      variant="outline"
      role="status"
      aria-label={label}
      className={cn(liveBadgeVariants(), className)}
      {...props}
    >
      {showDot ? (
        <span
          aria-hidden
          className={cn(liveBadgeDotVariants(), dotClassName)}
          data-slot="live-badge-dot"
        />
      ) : null}
      <span data-slot="live-badge-label">{label}</span>
    </UiBadge>
  );
}

export { liveBadgeVariants };
