"use client";

import * as React from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type ToggleProps = React.ComponentProps<typeof Switch>;

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <Switch
      className={cn(
        "h-5! w-[38px]! overflow-hidden rounded-full border-none",
        "data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-border-muted",
        "**:data-[slot=switch-thumb]:size-4",
        "**:data-[slot=switch-thumb]:rounded-full",
        "**:data-[slot=switch-thumb]:bg-text-inverse",
        "**:data-[slot=switch-thumb]:shadow-(--toggle-thumb-shadow)",
        "**:data-[slot=switch-thumb]:transition-transform",
        "**:data-[slot=switch-thumb]:data-[state=unchecked]:translate-x-[2px]",
        "**:data-[slot=switch-thumb]:data-[state=checked]:translate-x-[20px]",

        className,
      )}
      {...props}
    />
  );
}
