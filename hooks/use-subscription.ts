"use client";

import { useQuery } from "@tanstack/react-query";

import { isUnauthorizedError } from "@/lib/api/client";
import { fetchSubscription } from "@/lib/api/subscription";
import { useSession } from "@/lib/auth/auth-client";

import { useIsHydrated } from "./use-is-hydrated";

export const SUBSCRIPTION_QUERY_KEY = ["subscription"] as const;

export function useSubscription() {
  const { data: session } = useSession();
  const isHydrated = useIsHydrated();
  return useQuery({
    queryKey: [...SUBSCRIPTION_QUERY_KEY, session?.user.id],
    queryFn: fetchSubscription,
    enabled: isHydrated && Boolean(session?.user),
    retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 1,
  });
}
