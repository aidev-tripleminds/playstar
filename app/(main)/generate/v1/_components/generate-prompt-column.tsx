"use client";

import type { ComponentProps, Ref } from "react";

import { PromptboxHybrid } from "@/components/common/generate/promptbox-hybrid";
import { cn } from "@/lib/utils";

import { GENERATE_DESKTOP_BREAKPOINT, GENERATE_LEFT_COLUMN_CLASS } from "../_lib/constants";

type GeneratePromptColumnProps = ComponentProps<typeof PromptboxHybrid> & {
  promptboxRef?: Ref<HTMLDivElement>;
  columnClassName?: string;
};

export function GeneratePromptColumn({
  promptboxRef,
  className,
  columnClassName,
  ...promptboxProps
}: GeneratePromptColumnProps) {
  return (
    <div
      ref={promptboxRef}
      className={cn(
        GENERATE_LEFT_COLUMN_CLASS,
        "scrollbar-hidden min-[768px]:flex min-[768px]:h-full min-[768px]:min-h-0 min-[768px]:flex-col min-[768px]:overflow-hidden",
        columnClassName,
      )}
    >
      <PromptboxHybrid
        {...promptboxProps}
        desktopBreakpoint={GENERATE_DESKTOP_BREAKPOINT}
        className={cn("w-full", className)}
      />
    </div>
  );
}
