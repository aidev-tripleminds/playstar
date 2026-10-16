"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const chatHistoryVariants = cva(
  [
    "flex w-full cursor-pointer flex-col items-start gap-1.5 rounded-xl p-3 text-left",
    "transition-colors focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      state: {
        default: "bg-transparent",
        focus: "bg-surface-strong-hover",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export type ChatHistoryState = "default" | "focus";

export type ChatHistoryProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof chatHistoryVariants> & {
    title?: string;
    timestamp?: string;
    preview?: string;
  };

export function ChatHistory({
  state = "default",
  title = "Lorem ipsum conversation name",
  timestamp = "1 day ago",
  preview = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  className,
  type = "button",
  "aria-label": ariaLabel,
  ...props
}: ChatHistoryProps) {
  const resolvedState = state ?? "default";

  return (
    <button
      type={type}
      data-slot="chat-history"
      data-state={resolvedState}
      aria-label={ariaLabel ?? title}
      aria-current={resolvedState === "focus" ? "true" : undefined}
      className={cn(chatHistoryVariants({ state: resolvedState }), className)}
      {...props}
    >
      <div className="flex w-full min-w-0 items-start gap-1">
        <span className="text-tooltip-text min-w-0 flex-1 text-sm leading-5 font-medium">
          {title}
        </span>
        <span className="text-tooltip-text shrink-0 text-right text-sm leading-5 font-medium">
          {timestamp}
        </span>
      </div>
      <p className="text-divider-label w-full truncate text-sm leading-4 font-normal">{preview}</p>
    </button>
  );
}
