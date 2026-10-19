"use client";

export const SUBSCRIPTION_QUERY_KEY = ["subscription"] as const;

/** No subscription request. Premium state stays local. */
export function useSubscription() {
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
