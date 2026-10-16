import { apiFetch } from "./client";

export type CatalogPromo = {
  slug: string;
  badgeText: string | null;
  headline: string | null;
  ctaLabel: string | null;
  discountLabel: string | null;
  assetTag: string | null;
  endsAt: string;
};

export type CatalogPrice = {
  id: string;
  interval: "monthly" | "quarterly" | "yearly";
  priceCents: number;
  compareAtCents: number | null;
  coinGrant: number;
  promoSlug: string | null;
};

export type CatalogPlan = {
  code: string;
  name: string;
  tierRank: number;
  monthlyTokenGrant: number;
  signupBonusTokens?: number;
  perks: unknown;
  prices: CatalogPrice[];
};

export type CatalogCoinPack = {
  id: string;
  name: string;
  coins: number;
  priceCents: number;
  compareAtCents: number | null;
};

export type PricingCatalog = {
  brand: { slug: string } | null;
  currency: string;
  promo: CatalogPromo | null;
  actionPrices: Record<string, number>;
  plans: CatalogPlan[];
  coinPacks: CatalogCoinPack[];
};

export function fetchPricingCatalog(): Promise<PricingCatalog> {
  return apiFetch<PricingCatalog>("/api/v1/pricing/catalog");
}
