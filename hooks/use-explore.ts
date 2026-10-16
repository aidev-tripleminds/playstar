"use client";

import { type QueryClient, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  type ExploreFilters,
  type ExploreInitialData,
  fetchExploreCategories,
  fetchExploreFeed,
  fetchExploreOptions,
} from "@/lib/api/explore";
import { exploreSearchParams } from "@/lib/explore/filters";

import { useMe } from "./use-me";

/**
 * Mark the Explore views that list a relationship (`following` characters,
 * `saved` media) stale after the viewer changed one, so they refetch
 * when next shown: the feed is otherwise cached forever.
 */
export function invalidateExploreRelationship(
  queryClient: QueryClient,
  relationship: "following" | "saved",
) {
  void queryClient.invalidateQueries({
    queryKey: ["explore-feed"],
    predicate: (query) =>
      (query.queryKey[2] as ExploreFilters | undefined)?.[relationship] === "true",
  });
  // The relationship chip on the category row counts these items too.
  void queryClient.invalidateQueries({ queryKey: ["explore-categories"] });
}

export function useExploreOptions(
  filters: ExploreFilters,
  enabled: boolean,
  initial?: ExploreInitialData,
) {
  const query = { type: filters.type, gender: filters.gender, style: filters.style };
  return useQuery({
    queryKey: ["explore-options", query],
    initialData:
      initial &&
      exploreSearchParams(filters).toString() === exploreSearchParams(initial.filters).toString()
        ? initial.options
        : undefined,
    queryFn: () => fetchExploreOptions(query),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}
export function useExploreFeed(
  filters: ExploreFilters,
  enabled: boolean,
  initial?: ExploreInitialData,
) {
  const { session, isSessionPending } = useMe();
  const actorId = isSessionPending ? undefined : session?.user.id;
  return useInfiniteQuery({
    queryKey: ["explore-feed", actorId ?? "guest", filters],
    queryFn: ({ pageParam }) => fetchExploreFeed({ ...filters, cursor: pageParam, limit: 30 }),
    initialPageParam: undefined as string | undefined,
    initialData:
      initial &&
      !actorId &&
      exploreSearchParams(filters).toString() === exploreSearchParams(initial.filters).toString()
        ? { pages: [initial.page], pageParams: [undefined] }
        : undefined,
    // A final page has items and a null cursor; has_more is the contract.
    getNextPageParam: (page) => (page.has_more ? (page.next_cursor ?? undefined) : undefined),
    // A server order rebuilt after expiry may repeat a few cards: keep the first.
    select: (data) => {
      const seen = new Set<string>();
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          }),
        })),
      };
    },
    enabled: enabled && !isSessionPending,
    // Pages on screen never reload underneath the user: not on tab focus, and
    // not when Better Auth's focus refetch briefly marks a guest session pending
    // (which switches this query off and on). The grid changes on a new filter,
    // a new sort or a reload.
    staleTime: Infinity,
    retry: false,
  });
}
export function useExploreCategories(
  filters: ExploreFilters,
  enabled: boolean,
  initial?: ExploreInitialData,
) {
  const { session, isSessionPending } = useMe();
  const query = {
    type: filters.type,
    gender: filters.gender,
    style: filters.style,
    age: filters.age,
  };
  const actorId = !isSessionPending && session?.user.id;
  const initialCategories =
    initial &&
    query.type === initial.filters.type &&
    query.gender === initial.filters.gender &&
    query.style === initial.filters.style &&
    query.age === initial.filters.age
      ? initial.categories
      : undefined;
  return useQuery({
    queryKey: ["explore-categories", actorId || "guest", query],
    initialData: !actorId ? initialCategories : undefined,
    // Keep the public row visible while personalized suggestions load.
    placeholderData: initialCategories,
    queryFn: () => fetchExploreCategories(query),
    enabled: enabled && !isSessionPending,
    staleTime: 30_000,
    retry: false,
  });
}
