import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { Badge as UiBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { STATUS_BADGE_LABELS } from "./status-badge.constants";

const statusBadgeVariants = cva(
  "box-border inline-flex shrink-0 items-center justify-end gap-1 rounded-[99px] border-0 py-1.5 pr-1.5 pl-2 text-xs leading-3 font-normal text-tooltip-text shadow-none",
  {
    variants: {
      status: {
        active: "bg-status-active-bg",
        reviewing: "bg-status-reviewing-bg",
        declined: "bg-status-declined-bg",
      },
    },
    defaultVariants: {
      status: "declined",
    },
  },
);

const statusBadgeDotVariants = cva(
  "size-1.5 shrink-0 rounded-full shadow-[0_0_5px_0_rgba(0,0,0,0.25)]",
  {
    variants: {
      status: {
        active: "bg-status-active-dot",
        reviewing: "bg-status-reviewing-dot",
        declined: "bg-status-declined-dot",
      },
    },
    defaultVariants: {
      status: "declined",
    },
  },
);

export type StatusBadgeProps = VariantProps<typeof statusBadgeVariants> &
  Omit<React.ComponentProps<typeof UiBadge>, "variant"> & {
    label?: string;
    showDot?: boolean;
  };

export function StatusBadge({
  status = "declined",
  label,
  showDot = true,
  className,
  ...props
}: StatusBadgeProps) {
  const resolvedLabel = label ?? STATUS_BADGE_LABELS[status ?? "declined"];

  return (
    <UiBadge
      data-slot="status-badge"
      data-status={status}
      variant="outline"
      role="status"
      aria-label={resolvedLabel}
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    >
      <span data-slot="status-badge-label">{resolvedLabel}</span>
      {showDot ? (
        <span
          aria-hidden
          className={statusBadgeDotVariants({ status })}
          data-slot="status-badge-dot"
        />
      ) : null}
    </UiBadge>
  );
}

export { statusBadgeVariants };
