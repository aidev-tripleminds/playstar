import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const radioIndicatorVariants = cva(
  "size-2 shrink-0 rounded-full shadow-[0_0_6px_rgba(0,0,0,0.8)]",
  {
    variants: {
      checked: {
        true: "bg-[image:var(--gradient-rose)]",
        false: "bg-[image:var(--slider-thumb-gradient)]",
      },
    },
    defaultVariants: {
      checked: false,
    },
  },
);

export type RadioIndicatorProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof radioIndicatorVariants> & {
    checked?: boolean;
  };

/** Decorative radio dot from Figma `RadioIndicator` (2899:78753). */
export function RadioIndicator({ checked = false, className, ...props }: RadioIndicatorProps) {
  const resolvedChecked = checked ?? false;

  return (
    <span
      role="presentation"
      aria-hidden
      data-slot="radio-indicator"
      data-checked={resolvedChecked || undefined}
      className={cn(radioIndicatorVariants({ checked: resolvedChecked }), className)}
      {...props}
    />
  );
}
