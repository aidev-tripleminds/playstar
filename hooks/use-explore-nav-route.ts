"use client";

import { type AppRoute, exploreNavRoute, ROUTES } from "@/lib/routes";

import { useMe } from "./use-me";

/**
 * The destination of every "Explore" menu entry, for this visitor.
 *
 * Anonymous visitors go to `/` rather than `/explore` — see
 * {@link exploreNavRoute}. While the session is still resolving this reports
 * the logged-out answer, which is the same thing `useMe` does; a signed-in
 * visitor who clicks in that window lands on `/` and is redirected straight
 * back to `/explore`, so the worst case is the round trip this exists to
 * avoid, never a wrong page.
 */
export function useExploreNavRoute(): AppRoute {
  const { isLoggedIn } = useMe();
  return exploreNavRoute(isLoggedIn);
}

/** Rewrites an `/explore` href for this visitor; leaves every other href alone. */
export function useExploreAwareHref(): (href: string | undefined) => string | undefined {
  const exploreRoute = useExploreNavRoute();
  return (href) => (href === ROUTES.explore ? exploreRoute : href);
}
