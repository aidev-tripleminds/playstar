"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

const stateVariants = cva("relative inline-flex items-center justify-center rounded-full border", {
  variants: {
    status: {
      success: "border-state-success-border bg-state-success-bg",
      error: "border-state-error-border bg-state-error-bg",
    },
  },
  defaultVariants: {
    status: "success",
  },
});

export type StateProps = VariantProps<typeof stateVariants> &
  Omit<React.ComponentProps<"span">, "children">;

export function State({ status = "success", className, ...props }: StateProps) {
  return (
    <span className={cn(stateVariants({ status }), "h-[58px] w-[58px] p-4", className)} {...props}>
      {/* Inner Circle */}
      <span className={cn("relative flex h-[26px] w-[26px] items-center justify-center")}>
        {status === "success" ? (
          <span className="relative h-[2em] w-[2em]">
            <Image src="/assets/tick.svg" alt="success" fill className="object-contain" />
          </span>
        ) : (
          <span className="relative h-[2em] w-[2em]">
            <Image src="/assets/cross.svg" alt="error" fill className="object-contain" />
          </span>
        )}
      </span>
    </span>
  );
}
