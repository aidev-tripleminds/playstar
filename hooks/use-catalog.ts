"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPricingCatalog, type PricingCatalog } from "@/lib/api/pricing";

export const CATALOG_QUERY_KEY = ["pricing-catalog"] as const;

export function useCatalog({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<PricingCatalog>({
    queryKey: CATALOG_QUERY_KEY,
    queryFn: fetchPricingCatalog,
    enabled,
  });
}
