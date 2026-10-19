"use client";

import type { GenerateOptionsResponse } from "@/lib/api/types";

export const GENERATE_OPTIONS_QUERY_KEY = ["generate-options"] as const;

export const EMPTY_GENERATE_OPTIONS: GenerateOptionsResponse = {
  actions: { image: [], video: [] },
  clothing: [],
  locations: [],
};

/** Local picker lists. The generate page does not request `/api/v1/generate/options`. */
export function useGenerateOptions() {
  return {
    data: EMPTY_GENERATE_OPTIONS,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: true,
    isFetched: true,
    status: "success" as const,
    refetch: async () => ({ data: EMPTY_GENERATE_OPTIONS }),
  };
}
