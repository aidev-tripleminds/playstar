"use client";

import * as React from "react";

import { formatCents } from "@/lib/money";
import { cn } from "@/lib/utils";

import { Badge } from "../../general/badge/badge";
import {
  ProductThumbnail,
  type Variant as ThumbnailVariant,
} from "../product-thumbnail/product-thumbnail";

type Variant = "default" | "discount";

export const PRODUCT_CARD_FRAME_CLASSNAME = cn(
  "rounded-[20px] border border-transparent p-3",
  "bg-tooltip-default-bg",
  "[background-image:linear-gradient(var(--tooltip-default-bg),var(--tooltip-default-bg)),var(--card-border)]",
  "[background-clip:padding-box,border-box] [background-origin:border-box]",
);

export type ProductCardProps = {
  variant?: Variant;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  discountLabel?: string;
  badge?: string;
  duration?: string;
  thumbnailVariant?: ThumbnailVariant;
  showThumbnailIcon?: boolean;
  thumbnailIcon?: string;
  /** When false, render the row without card chrome (for grouped carts). */
  framed?: boolean;
  className?: string;
};

export type ProductCardGroupProps = {
  children: React.ReactNode;
  totalCents: number;
  currency: string;
  totalLabel?: string;
  className?: string;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  variant = "default",
  title,
  subtitle,
  price,
  originalPrice,
  currency,
  discountLabel,
  badge = "PREMIUM",
  duration = "1 MONTH",
  thumbnailVariant = "premium",
  showThumbnailIcon = false,
  thumbnailIcon = "/assets/spice-coin.png",
  framed = true,
  className,
}) => {
  const isDiscount = variant === "discount";

  return (
    <div
      data-testid="product-card"
      className={cn(
        "text-tooltip-text flex items-center gap-[10px]",
        framed && PRODUCT_CARD_FRAME_CLASSNAME,
        className,
      )}
    >
      <ProductThumbnail
        variant={thumbnailVariant}
        title={duration}
        badge={badge}
        showIcon={showThumbnailIcon}
        icon={thumbnailIcon}
      />
      <div className="flex w-full flex-col justify-between self-stretch py-1">
        <div className="flex items-start gap-2 self-stretch">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-base leading-[100%] font-semibold">{title}</p>
            {subtitle && (
              <p className="text-xs leading-[100%] font-normal text-[var(--select-muted-text)]">
                {subtitle}
              </p>
            )}
          </div>
          {isDiscount && discountLabel && (
            <Badge
              type="rose"
              size="medium"
              className="w-fit shrink-0"
              text={discountLabel}
              showIcon={false}
            />
          )}
        </div>
        <div className="flex items-end justify-end gap-2">
          {isDiscount && originalPrice != null && (
            <span className="relative text-base leading-[100%] font-medium text-[var(--select-muted-text)]">
              {formatCents(originalPrice, currency)}
              <span className="bg-brand-primary absolute top-1/2 right-0 left-0 h-px -rotate-[15deg]" />
            </span>
          )}
          <span className="text-[20px] leading-[100%] font-semibold text-[var(--select-text)]">
            {formatCents(price, currency)}
          </span>
        </div>
      </div>
    </div>
  );
};

export function ProductCardGroup({
  children,
  totalCents,
  currency,
  totalLabel = "Total due today",
  className,
}: ProductCardGroupProps) {
  return (
    <div
      data-testid="product-card-group"
      className={cn(
        "text-tooltip-text flex w-full flex-col gap-2.5",
        PRODUCT_CARD_FRAME_CLASSNAME,
        className,
      )}
    >
      {children}
      <div className="h-px w-full bg-[#262626]" role="separator" />
      <div className="flex items-center justify-between gap-2 py-1">
        <p className="text-base leading-[100%] font-semibold">{totalLabel}</p>
        <p className="text-[20px] leading-[100%] font-semibold text-[var(--select-text)]">
          {formatCents(totalCents, currency)}
        </p>
      </div>
    </div>
  );
}
