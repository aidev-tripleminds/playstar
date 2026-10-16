"use client";

import * as React from "react";

import {
  Tooltip as UiTooltip,
  TooltipContent as UiTooltipContent,
  TooltipProvider as UiTooltipProvider,
  TooltipTrigger as UiTooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type TooltipProps = {
  children: React.ReactNode;
  text?: string;
  variant?: "default" | "left";
  align?: React.ComponentProps<typeof UiTooltipContent>["align"];
  delayDuration?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Tooltip({
  children,
  text = "Explorer",
  variant = "default",
  align = "center",
  delayDuration = 0,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) {
  return (
    <UiTooltipProvider delayDuration={delayDuration} disableHoverableContent>
      <UiTooltip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <UiTooltipTrigger asChild>{children}</UiTooltipTrigger>
        <UiTooltipContent
          side={variant === "default" ? "top" : "right"}
          align={align}
          sideOffset={8}
          showArrow={false}
          className={cn(
            "text-tooltip-text shadow-badge font-sans text-xs leading-4",
            variant === "default" &&
              "border-tooltip-left-bg bg-tooltip-default-bg rounded-md border px-2 py-1",
            variant === "left" &&
              "bg-tooltip-left-bg before:border-r-tooltip-left-bg relative rounded-lg border-0 p-2 before:absolute before:top-1/2 before:right-full before:h-0 before:w-0 before:-translate-y-1/2 before:border-y-[5px] before:border-r-[5px] before:border-y-transparent before:content-['']",
          )}
        >
          {text}
        </UiTooltipContent>
      </UiTooltip>
    </UiTooltipProvider>
  );
}
