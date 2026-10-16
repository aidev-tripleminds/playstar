"use client";

import { useQuery } from "@tanstack/react-query";

import { isClientErrorResponse } from "@/lib/api/client";
import { fetchGenerateOptions } from "@/lib/api/generate-options";
import type { GenerateOptionsResponse } from "@/lib/api/types";

export const GENERATE_OPTIONS_QUERY_KEY = ["generate-options"] as const;

/**
 * What the pickers show while the request is pending or after it failed: no
 * options. The rest of the generate page does not depend on them.
 */
export const EMPTY_GENERATE_OPTIONS: GenerateOptionsResponse = {
  actions: { image: [], video: [] },
  clothing: [],
  locations: [],
};

/**
 * The generate-form options for the requesting brand.
 *
 * The lists are admin-edited and the backend caches them for five minutes, so
 * a shorter `staleTime` would not show an edit any sooner.
 */
export function useGenerateOptions() {
  return useQuery({
    queryKey: GENERATE_OPTIONS_QUERY_KEY,
    queryFn: fetchGenerateOptions,
    staleTime: 5 * 60_000,
    // A 4xx is a contract problem; retrying cannot fix it. A transient 5xx or
    // network failure gets one retry.
    retry: (failureCount, error) => !isClientErrorResponse(error) && failureCount < 1,
  });
}
