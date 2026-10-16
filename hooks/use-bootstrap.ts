"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchBootstrap } from "@/lib/api/bootstrap";

export const BOOTSTRAP_QUERY_KEY = ["bootstrap"] as const;

/**
 * Per-brand runtime config. Unauthenticated and effectively static for the life
 * of the tab — the backend only changes it on its own restart — so it is cached
 * indefinitely rather than refetched on every mount of an auth modal.
 */
export function useBootstrap() {
  return useQuery({
    queryKey: BOOTSTRAP_QUERY_KEY,
    queryFn: fetchBootstrap,
    staleTime: Infinity,
    // A brand with no Google client is the ordinary case, not an error worth
    // retrying: the payload still arrives, just with `auth.google: null`. This
    // retry budget is for a genuinely failed request, and one attempt is enough
    // — the only cost of giving up is a hidden button on a page nobody is
    // blocked on.
    retry: 1,
  });
}

/**
 * The provider id to sign in with, or null when this brand cannot complete a
 * Google sign-in (no client configured, or bootstrap has not answered yet).
 * Callers treat null as "do not offer the button" — never as "try anyway",
 * which would send the user to an endpoint that answers "provider not found".
 */
export function useGoogleProviderId(): string | null {
  const { data } = useBootstrap();
  return data?.auth?.google?.providerId ?? null;
}
