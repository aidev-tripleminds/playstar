"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { TOKEN_CARD_HEADER_TEXT_CLASS, type TokenCardVariant } from "../token-card.constants";

export type TokenCardAmountHeaderProps = React.ComponentProps<"div"> & {
  label: string;
  variant: TokenCardVariant;
};

export function TokenCardAmountHeader({
  label,
  variant,
  className,
  ...props
}: TokenCardAmountHeaderProps) {
  return (
    <div
      data-slot="token-card-amount-header"
      data-variant={variant}
      className={cn(
        "inline-flex w-full items-center justify-center rounded-[16px] bg-white/25 px-4 py-2 backdrop-blur-[20px]",
        "text-center text-[18px] leading-[22px] font-bold tracking-[0.02em] uppercase",
        "md:text-[20px] md:leading-[28px] lg:text-[24px]",
        TOKEN_CARD_HEADER_TEXT_CLASS[variant],
        className,
      )}
      {...props}
    >
      {label}
    </div>
  );
}
