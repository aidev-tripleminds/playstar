"use client";

export const ME_QUERY_KEY = ["me"] as const;

/**
 * Local demo session. The app does not call `/api/v1/me` or the auth session.
 */
export function useMe() {
  return {
    data: undefined,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: true,
    isFetched: true,
    status: "success" as const,
    fetchStatus: "idle" as const,
    refetch: async () => ({ data: undefined }),
    isLoggedIn: false,
    isSessionPending: false,
    session: null,
    refetchSession: async () => {},
    isPremium: false,
    subscriptionPlanName: "",
    plan: null,
    interval: null,
    nextTier: null,
    isPremiumPlan: false,
    isInfinitePlan: false,
    isPremiumResolved: true,
    isPremiumError: false,
    tokenBalance: undefined,
    subscriptionExpiresAt: null,
  };
}

/** No billing snapshot to refresh. */
export function useInvalidateMe() {
  return () => Promise.resolve();
}
