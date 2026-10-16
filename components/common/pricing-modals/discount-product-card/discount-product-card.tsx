"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "../../general/badge/badge";

export type DiscountProductCardProperty = "gold" | "red";

export type DiscountProductCardProps = {
  property?: DiscountProductCardProperty;
  planName?: string;
  tokenLabel?: string;
  discountLabel?: string;
  originalPrice?: string;
  discountedPrice?: string;
  className?: string;
};

const propertyDefaults: Record<
  DiscountProductCardProperty,
  Pick<DiscountProductCardProps, "originalPrice" | "discountedPrice">
> = {
  gold: {
    originalPrice: "$119.99",
    discountedPrice: "$0.00",
  },
  red: {
    originalPrice: "$239.99",
    discountedPrice: "$59.99",
  },
};

const propertyStyles: Record<DiscountProductCardProperty, React.CSSProperties> = {
  gold: {
    border: "2px solid transparent",
    color: "#121212",
    background: "var(--gradient-light-yellow-bg)",
  },

  red: {
    border: "2px solid var(--brand-primary)",
    backgroundColor: "var(--dialog-bg)",
    color: "var(--colors-rose-50)",
  },
};

export function DiscountProductCard({
  property = "gold",
  planName = "Infinite Plan",
  tokenLabel,
  discountLabel = "-75%",
  originalPrice,
  discountedPrice,
  className,
}: DiscountProductCardProps) {
  const defaults = propertyDefaults[property];
  const styles = propertyStyles[property];

  const resolvedOriginalPrice = originalPrice ?? defaults.originalPrice;

  const resolvedDiscountedPrice = discountedPrice ?? defaults.discountedPrice;

  return (
    <div
      data-testid="discount-product-card"
      data-property={property}
      style={styles}
      className={cn(
        "flex w-full flex-col gap-[10px] rounded-[1rem] p-4 md:min-w-[252px]",
        className,
      )}
    >
      {/* {tokenLabel && (
        <div className="flex items-center gap-2">
          <span className="relative inline-block h-5 w-5 shrink-0">
            <Image
              src="/assets/spice-coin.png"
              alt=""
              fill
              className="object-contain"
            />
          </span>
          <span className="text-sm leading-[142.857%] font-medium text-[var(--colors-rose-50)]">
            {tokenLabel}
          </span>
        </div>
      )} */}

      <div className="flex items-start justify-between gap-2">
        <span className="text-[18px] leading-[100%] font-normal text-[var(--colors-rose-50)]">
          {planName}
        </span>

        <Badge
          type="rose"
          size="medium"
          text={discountLabel}
          showIcon={false}
          className="shrink-0"
        />
      </div>

      <div className="flex items-end gap-2">
        <span className="relative text-[22px] leading-[100%] font-medium text-[var(--modal-text)]">
          {resolvedOriginalPrice}

          <span
            className={cn(
              "absolute top-1/2 right-0 left-0 h-[2px] w-full -rotate-[18deg] bg-[var(--brand-primary)]",
            )}
          />
        </span>

        <span className="text-tokens-gradient text-[22px] leading-[100%] font-semibold">
          {resolvedDiscountedPrice}
        </span>
      </div>
    </div>
  );
}
