import type { CatalogPrice } from "@/lib/api/pricing";
import { annualSavingsPercent, formatCents } from "@/lib/money";

export function catalogIntervalPrices(prices: CatalogPrice[] | undefined) {
  return {
    yearly: prices?.find((price) => price.interval === "yearly"),
    monthly: prices?.find((price) => price.interval === "monthly"),
  };
}

export type CatalogPriceTabCopy = {
  price: string;
  originalPrice: string;
  badgeLabel?: string;
  showBadge: boolean;
  bonusLabel: string;
  showBonus: boolean;
};

export const EMPTY_CATALOG_PRICE_TAB_COPY: CatalogPriceTabCopy = {
  price: "",
  originalPrice: "",
  showBadge: false,
  bonusLabel: "",
  showBonus: false,
};

export function catalogYearlyDiscount(
  yearly: CatalogPrice | undefined,
  monthly: CatalogPrice | undefined,
): number {
  if (!yearly || !monthly) return 0;
  return annualSavingsPercent(yearly.priceCents, monthly.priceCents);
}

export function catalogPriceTabCopy({
  price,
  monthlyPrice,
  yearlyDiscount,
  signupBonusTokens = 0,
  currency,
  usesMonthlyYearlyOffers,
  promoDiscountLabel,
}: {
  price: CatalogPrice;
  monthlyPrice?: CatalogPrice;
  yearlyDiscount: number;
  signupBonusTokens?: number;
  currency: string;
  usesMonthlyYearlyOffers: boolean;
  promoDiscountLabel?: string | null;
}): CatalogPriceTabCopy {
  const isYearlyOffer = usesMonthlyYearlyOffers && price.interval === "yearly";

  return {
    price: formatCents(price.priceCents / (isYearlyOffer ? 12 : 1), currency),
    originalPrice: isYearlyOffer
      ? monthlyPrice && yearlyDiscount > 0
        ? formatCents(monthlyPrice.priceCents, currency)
        : ""
      : price.compareAtCents == null
        ? ""
        : formatCents(price.compareAtCents, currency),
    badgeLabel: usesMonthlyYearlyOffers ? `-${yearlyDiscount}%` : (promoDiscountLabel ?? undefined),
    showBadge: usesMonthlyYearlyOffers
      ? isYearlyOffer && yearlyDiscount > 0
      : Boolean(price.promoSlug && promoDiscountLabel),
    bonusLabel: `+${signupBonusTokens} free tokens`,
    showBonus: isYearlyOffer && signupBonusTokens > 0,
  };
}
