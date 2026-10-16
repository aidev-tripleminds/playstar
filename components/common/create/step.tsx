"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type StepProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export function Step({ className, children, type = "button", ...props }: StepProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-[50px] bg-[image:var(--gradient-rose)] p-[6px]",
        "text-tooltip-text font-[Onest,sans-serif] font-medium",
        "transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
