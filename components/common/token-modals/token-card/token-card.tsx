"use client";

import type { StaticImageData } from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import {
  TokenCardAmountHeader,
  TokenCardBonusTag,
  TokenCardBuyButton,
  TokenCardHeroImage,
} from "./components";
import {
  TOKEN_CARD_GRADIENT_VARS,
  TOKEN_CARD_HEIGHT_PX,
  TOKEN_CARD_VARIANT_PRESETS,
  TOKEN_CARD_WIDTH_PX,
  type TokenCardVariant,
} from "./token-card.constants";

export type TokenCardProps = {
  variant: TokenCardVariant;
  tokenLabel?: string;
  buyLabel?: string;
  bonusLabel?: React.ReactNode;
  bonusTagClassName?: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  imageClassName?: string;
  className?: string;
  buyButtonProps?: Omit<React.ComponentProps<typeof TokenCardBuyButton>, "label">;
};

export function TokenCard({
  variant,
  tokenLabel,
  buyLabel,
  bonusLabel,
  bonusTagClassName,
  imageSrc,
  imageAlt,
  imageClassName,
  className,
  buyButtonProps,
}: TokenCardProps) {
  const preset = TOKEN_CARD_VARIANT_PRESETS[variant];

  return (
    <article
      data-slot="token-card"
      data-variant={variant}
      className={cn("relative isolate shrink-0 overflow-visible rounded-[28px]", className)}
      style={{
        width: TOKEN_CARD_WIDTH_PX,
        height: TOKEN_CARD_HEIGHT_PX,
        backgroundImage: TOKEN_CARD_GRADIENT_VARS[variant],
      }}
    >
      {(bonusLabel ?? preset.bonusLabel) ? (
        <TokenCardBonusTag
          label={bonusLabel ?? preset.bonusLabel!}
          className={cn(
            "absolute top-0 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2",
            bonusTagClassName,
          )}
        />
      ) : null}

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[26px]">
        <TokenCardHeroImage
          src={imageSrc ?? preset.imageSrc}
          alt={imageAlt ?? preset.imageAlt}
          imageClassName={imageClassName ?? preset.heroImageClassName}
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
          <TokenCardAmountHeader label={tokenLabel ?? preset.tokenLabel} variant={variant} />

          <TokenCardBuyButton label={buyLabel ?? preset.buyLabel} {...buyButtonProps} />
        </div>
      </div>
    </article>
  );
}
