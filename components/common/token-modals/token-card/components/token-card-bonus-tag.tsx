"use client";

import * as React from "react";

import { Badge, type BadgeProps } from "@/components/common/general/badge/badge";
import { cn } from "@/lib/utils";

export type TokenCardBonusTagProps = Omit<BadgeProps, "text"> & {
  label: React.ReactNode;
};

const bonusTagClassName = cn(
  "inline-flex max-w-[calc(100%-2rem)] items-center justify-center rounded-full border-0 bg-amber-col px-3 py-1 shadow-none",
  "text-center text-[16px]! leading-[16px]! font-bold tracking-[0.02em] uppercase",
  "[&>span]:text-[16px]! [&>span]:leading-[16px]! [&>span]:font-bold [&>span]:tracking-[0.02em] [&>span]:text-dialog-bg [&>span]:uppercase",
);

export function TokenCardBonusTag({
  label,
  className,
  type = "empty",
  size = "small",
  showIcon = false,
  ...props
}: TokenCardBonusTagProps) {
  return (
    <Badge
      data-slot="token-card-bonus-tag"
      type={type}
      size={size}
      text={label}
      showIcon={showIcon}
      className={cn(bonusTagClassName, "bg-[image:var(--gradient-token-text)]", className)}
      {...props}
    />
  );
}
