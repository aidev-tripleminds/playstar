"use client";

/** Local info snapshot. The visitor IP lookup is not called. */
export function useInfo(_enabled = true) {
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
