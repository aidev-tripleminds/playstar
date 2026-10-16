"use client";

import * as React from "react";

import { Checkbox as CheckboxPrimitive } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { checkboxAppearanceClassName } from "./checkbox-appearance";

export type CheckboxProps = Omit<
  React.ComponentProps<typeof CheckboxPrimitive>,
  "className" | "onCheckedChange"
> & {
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive
      className={cn(
        checkboxAppearanceClassName,
        "size-5 [&_[data-slot=checkbox-indicator]>svg]:size-4",
        className,
      )}
      onCheckedChange={(checked) => onCheckedChange?.(checked === true)}
      {...props}
    />
  );
}
