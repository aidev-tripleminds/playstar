"use client";

export const CATALOG_QUERY_KEY = ["pricing-catalog"] as const;

/** Local pricing list. The catalog API is not called. */
export function useCatalog({ enabled: _enabled = true }: { enabled?: boolean } = {}) {
  return {
    data: undefined,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: true,
    isFetched: true,
    status: "success" as const,
    refetch: async () => ({ data: undefined }),
  };
}
