import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Badge as UiBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Badge styles
const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium ",
  {
    variants: {
      type: {
        rose: "bg-[image:var(--gradient-rose)] text-text-inverse shadow-badge",
        neutral: "border border-border-muted bg-surface-strong text-text-inverse shadow-badge",
        grey: "bg-[linear-gradient(180deg,var(--color-bank-gradient-start),var(--color-bank-gradient-mid),var(--color-bank-gradient-end))] text-bank-foreground shadow-badge",
        empty: "border-0 bg-transparent shadow-none text-text-inverse",
      },

      size: {
        xl: "px-2 py-1 gap-1 text-[16px]! leading-[16px]! rounded-[28px]",
        large: "px-2 py-1 gap-[3px] text-[14px]! leading-[14px]! rounded-[28px]",
        medium: "px-[6px] py-1 gap-[2px] text-[12px]! leading-[12px]! rounded-[28px]",
        small: "px-[6px] py-1 gap-[2px] text-[10px]! leading-[9px]! rounded-[28px]",
      },
    },

    defaultVariants: {
      type: "rose",
      size: "medium",
    },
  },
);

const coinVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      xl: "",
      large: "",
      medium: "",
      small: "",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

export type BadgeProps = VariantProps<typeof badgeVariants> &
  Omit<React.ComponentProps<typeof UiBadge>, "variant" | "color"> & {
    text?: React.ReactNode;
    showIcon?: boolean;
    showText?: boolean;
    iconSrc?: string;
    imageClassName?: string;
    textClassName?: string;
  };

export function Badge({
  type = "rose",
  size = "medium",
  text = "New",
  showIcon = true,
  showText = true,
  iconSrc = "/assets/spice-coin.png",
  className,
  imageClassName,
  textClassName,
  ...props
}: BadgeProps) {
  return (
    <UiBadge variant="outline" className={cn(badgeVariants({ type, size }), className)} {...props}>
      {/* Text */}
      {showText && <span className={textClassName}> {text}</span>}

      {/* Icon */}
      {showIcon && (
        <span className={cn(coinVariants({ size }))} aria-hidden>
          <span className={cn("relative inline-block h-[1em] w-[1em]", imageClassName)}>
            <Image src={iconSrc} alt="" fill className="object-contain" />
          </span>
        </span>
      )}
    </UiBadge>
  );
}
