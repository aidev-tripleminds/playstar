"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { isUnauthorizedError } from "@/lib/api/client";
import { fetchMe } from "@/lib/api/me";
import { useSession } from "@/lib/auth/auth-client";

import { useIsHydrated } from "./use-is-hydrated";

export const ME_QUERY_KEY = ["me"] as const;

/**
 * Billing snapshot for the logged-in user (coin balance + premium flag).
 * Disabled while logged out — `/api/v1/me` requires a session.
 */
export function useMe() {
  const { data: session, isPending, refetch: refetchSession } = useSession();
  const isHydrated = useIsHydrated();

  // Better Auth can resolve a cached session synchronously, so the first client
  // render would otherwise report "logged in" against server HTML that rendered
  // "logged out" — a hydration mismatch for every caller that branches on this.
  // Holding the pending state through hydration keeps the two renders identical.
  const isSessionPending = !isHydrated || isPending;
  const isLoggedIn = isHydrated && Boolean(session?.user);

  const query = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: isLoggedIn,
    // A 401 means the session just ended (e.g. logout race) — retrying is noise.
    retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 1,
  });

  const subscriptionPlanName = query.data?.subscription_plan_name ?? "";
  const plan = query.data?.plan ?? null;

  return {
    ...query,
    isLoggedIn,
    isSessionPending,
    session,
    /** Re-read the session from the server — e.g. after a request revealed it changed. */
    refetchSession,
    isPremium: query.data?.has_active_subscription ?? false,
    subscriptionPlanName,
    plan,
    interval: query.data?.interval ?? null,
    nextTier: query.data?.nextTier ?? null,
    isPremiumPlan: plan === "premium",
    isInfinitePlan: plan === "infinite",
    /**
     * Whether `isPremium` is an answer rather than a default. It is `false`
     * while the session or `/me` is still in flight, so callers that would
     * otherwise act on "not premium" (e.g. stripping custom traits from a paid
     * request) must wait for this.
     *
     * A failed `/me` must NOT count as resolved: `isFetched` flips true even on
     * error while `query.data` stays absent, which would make a premium user
     * look free and silently strip their paid customizations. Require a real
     * success (or logged-out) instead — callers can surface `isPremiumError`.
     */
    isPremiumResolved: !isSessionPending && (!isLoggedIn || query.isSuccess),
    isPremiumError: isLoggedIn && query.isError,
    tokenBalance: query.data?.token_balance,
    subscriptionExpiresAt: query.data?.subscription_expires_at ?? null,
  };
}

/** Invalidate the billing snapshot (e.g. after a create or generate debits coins). */
export function useInvalidateMe() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
    [queryClient],
  );
}
