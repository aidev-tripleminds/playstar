"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export type Variant = "premium" | "year_prem" | "tokens" | "infinite";

export type ProductThumbnailProps = {
  variant: Variant;
  title: string;
  badge?: string;
  showIcon?: boolean;
  icon?: string | StaticImageData | React.ReactNode;
  className?: string;
};

const variantStyles: Record<Variant, string> = {
  premium: "bg-[var(--premium-thumb)] text-white",
  year_prem: "bg-[var(--premium-thumb)] text-white",
  tokens: "bg-[var(--tokens-thumb)] text-white",
  infinite: "bg-[var(--infinite-thumb)] text-white",
};

const badgeStyles: Record<Variant, string> = {
  premium: "bg-[image:var(--premium-thumb-gradient-pink)] text-white",
  year_prem: "bg-[image:var(--premium-thumb-gradient-pink)] text-white",
  tokens: "bg-[var(--tokens-thumb-button)] text-black",
  infinite: "bg-[var(--infinite-thumb-button)] text-black",
};

export function ProductThumbnail({
  variant,
  title,
  badge,
  showIcon = false,
  icon,
  className,
}: ProductThumbnailProps) {
  return (
    <div
      className={cn(
        "flex h-[84px] w-[84px] min-w-[84px] flex-col items-center justify-center gap-2 rounded-[12px] p-2 shadow-md",
        variantStyles[variant],
        className,
      )}
    >
      {/* Title +  Icon */}
      <div className="flex items-center justify-center gap-1 text-sm leading-[100%] font-bold uppercase">
        {title}

        {showIcon && icon && (
          <>
            {React.isValidElement(icon) ? (
              icon
            ) : (
              <Image src={icon as string | StaticImageData} alt="icon" width={20} height={20} />
            )}
          </>
        )}
      </div>

      {/* Badge */}
      {badge && (
        <div
          className={cn(
            "w-[68px] rounded px-1 py-1 text-center text-xs leading-[12px] font-bold uppercase",
            badgeStyles[variant],
          )}
        >
          {badge}
        </div>
      )}
    </div>
  );
}

//
// ✅ Variant Components (Reusable Anywhere)
//

export const PremiumThumbnail = (props: Omit<ProductThumbnailProps, "variant">) => (
  <ProductThumbnail variant="premium" {...props} />
);

export const YearlyPremiumThumbnail = (props: Omit<ProductThumbnailProps, "variant">) => (
  <ProductThumbnail variant="year_prem" {...props} />
);

export const TokensThumbnail = (props: Omit<ProductThumbnailProps, "variant">) => (
  <ProductThumbnail variant="tokens" {...props} />
);

export const InfiniteThumbnail = (props: Omit<ProductThumbnailProps, "variant">) => (
  <ProductThumbnail variant="infinite" {...props} />
);
