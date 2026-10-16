"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export const PROMPT_CHATBAR_LAYER_Z = {
  behind: "z-[-2]",
  grid: "z-[-3]",
  shell: "z-0",
} as const;

type PromptChatbarSlideSectionProps = {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  layer?: keyof typeof PROMPT_CHATBAR_LAYER_Z;
  "data-slot"?: string;
};

export function PromptChatbarSlideSection({
  show,
  children,
  className,
  contentClassName,
  layer,
  "data-slot": dataSlot,
}: PromptChatbarSlideSectionProps) {
  return (
    <div
      data-slot={dataSlot}
      className={cn(
        "relative grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none",
        layer ? PROMPT_CHATBAR_LAYER_Z[layer] : undefined,
        show ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      aria-hidden={!show}
    >
      <div
        className={cn(
          "min-h-0 overflow-hidden transition-[opacity,transform] duration-300 ease-in-out motion-reduce:transition-none",
          show
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
