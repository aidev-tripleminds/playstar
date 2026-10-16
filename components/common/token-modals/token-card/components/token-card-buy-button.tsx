"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

export type TokenCardBuyButtonProps = Omit<React.ComponentProps<"button">, "children"> & {
  label: string;
};

export function TokenCardBuyButton({
  label,
  className,
  type = "button",
  ...props
}: TokenCardBuyButtonProps) {
  return (
    <Buttons
      type={type}
      size="btn-l"
      label={label}
      variant="neutral"
      leftIcon={false}
      rightIcon={false}
      className={cn("buy-btn text-amber-rich max-h-[44px] text-[14px]!", className)}
      {...props}
    />
  );
}
