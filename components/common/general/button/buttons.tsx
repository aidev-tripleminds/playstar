import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Button styles
const atomButtonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer rounded-[64px]  font-medium whitespace-nowrap transition-[color,background-color,background-image,opacity,transform,box-shadow,border-color] duration-300 ease-out disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 group",
  {
    variants: {
      variant: {
        rose: "bg-[image:var(--gradient-rose)] text-text-inverse hover:bg-[image:var(--gradient-rose-hover)]",
        "rose-disabled":
          "bg-[image:var(--gradient-rose-disabled)] text-rose-disabled-text hover:bg-[image:var(--gradient-rose-disabled)] disabled:opacity-100",
        "premium-full":
          "text-text-inverse [background:var(--gradient-premium-full),var(--premium-surface)]",
        premium:
          "bg-transparent pre-txt text-[var(--premium-accent)] hover:bg-[image:var(--gradient-premium-20)]",
        "premium-10":
          "bg-transparent pre-txt text-[var(--premium-accent)] [background-image:var(--gradient-premium-10)] hover:[background-image:var(--gradient-premium-20)]",
        "premium-20":
          "bg-transparent pre-txt text-[var(--premium-accent)] [background-image:var(--gradient-premium-20)]",
        neutral: "bg-tooltip-default-bg text-text-inverse hover:bg-surface-strong",
        neutral2: "bg-tooltip-default-bg text-text-inverse",
        "neutral-hover": "bg-surface-strong text-text-inverse",
        "neutral-border": "border! border-border-strong! bg-tooltip-default-bg text-text-inverse",
        transparent: "bg-transparent text-text-inverse",
        "light-grey":
          "bg-[linear-gradient(180deg,var(--color-bank-gradient-start),var(--color-bank-gradient-mid),var(--color-bank-gradient-end))] text-bank-foreground bg-white",
      },

      size: {
        "btn-l": "h-12! gap-2 px-4! py-3! text-base! leading-[24px]!",
        "btn-m": "h-11! w-[148px] gap-1.5 px-4! py-3! text-sm! leading-[20px]!",
        "btn-s": "h-9!  gap-1.5 px-3! py-2! text-sm! leading-[20px]!",
        "btn-xs": "h-6! w-[100px] gap-1 px-2! py-1! text-[12px]! leading-[16px]!",
      },

      leftIcon: {
        true: "",
        false: "",
      },

      rightIcon: {
        true: "",
        false: "",
      },
    },

    defaultVariants: {
      variant: "rose",
      size: "btn-m",
      leftIcon: true,
      rightIcon: true,
    },
  },
);

// Icon wrapper
const iconWrapperVariants = cva("inline-flex shrink-0 items-center justify-center", {
  variants: {
    size: {
      "btn-l": "text-[24px] font-medium",
      "btn-m": "text-[20px] font-medium",
      "btn-s": "text-[20px]",
      "btn-xs": "text-[16px]",
    },
  },
  defaultVariants: {
    size: "btn-m",
  },
});

export type ButtonVariant = NonNullable<VariantProps<typeof atomButtonVariants>["variant"]>;

export type AtomButtonsProps = Omit<React.ComponentProps<typeof ShadcnButton>, "size" | "variant"> &
  VariantProps<typeof atomButtonVariants> & {
    label?: string;
    leftIconSrc?: string;
    rightIconSrc?: string;
    leftIconNode?: React.ReactNode;
    rightIconNode?: React.ReactNode;
    leftIconSizeClassName?: string;
    rightIconSizeClassName?: string;
    iconSrc?: string;
    children?: React.ReactNode;
  };

export function Buttons({
  variant = "rose",
  size = "btn-m",
  leftIcon = true,
  rightIcon = true,
  label = "Click me",
  leftIconSrc,
  rightIconSrc,
  leftIconNode,
  rightIconNode,
  leftIconSizeClassName,
  rightIconSizeClassName,
  iconSrc,
  className,
  children,
  ...props
}: AtomButtonsProps) {
  const isPremiumVariant =
    variant === "premium" || variant === "premium-10" || variant === "premium-20";

  const isLightGrey = variant === "light-grey";

  const defaultIcon =
    iconSrc ??
    (isPremiumVariant
      ? "/assets/question.svg"
      : isLightGrey
        ? "/assets/icon-black.svg"
        : "/assets/circle_help.svg");

  const resolvedLeftIcon = leftIconSrc ?? defaultIcon;
  const resolvedRightIcon = rightIconSrc ?? defaultIcon;

  return (
    <ShadcnButton
      className={cn(atomButtonVariants({ variant, size, leftIcon, rightIcon }), className)}
      {...props}
    >
      {/* Left Icon */}
      {leftIconNode ? (
        <span className={cn(iconWrapperVariants({ size }))} aria-hidden>
          {leftIconNode}
        </span>
      ) : leftIcon ? (
        <span className={cn(iconWrapperVariants({ size }))} aria-hidden>
          <span className={cn("relative inline-block h-[1em] w-[1em]", leftIconSizeClassName)}>
            <Image src={resolvedLeftIcon} alt="" fill className="object-contain" />
          </span>
        </span>
      ) : null}

      {/* Label */}
      {isPremiumVariant ? (
        <span className="text-[var(--premium-accent)]">{label}</span>
      ) : (
        <span>{label}</span>
      )}

      {children}

      {/* Right Icon */}
      {rightIconNode ? (
        <span className={cn(iconWrapperVariants({ size }))} aria-hidden>
          {rightIconNode}
        </span>
      ) : rightIcon ? (
        <span className={cn(iconWrapperVariants({ size }))} aria-hidden>
          <span className={cn("relative inline-block h-[1em] w-[1em]", rightIconSizeClassName)}>
            <Image src={resolvedRightIcon} alt="" fill className="object-contain" />
          </span>
        </span>
      ) : null}
    </ShadcnButton>
  );
}
