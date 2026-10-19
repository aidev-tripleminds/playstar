"use client";

import type { QueryClient } from "@tanstack/react-query";

import type { ExploreFilters, ExploreInitialData } from "@/lib/api/explore";

const idle = {
  data: undefined,
  error: null,
  isError: false,
  isPending: false,
  isLoading: false,
  isSuccess: true,
  isFetched: true,
  status: "success" as const,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: async () => ({ data: undefined }),
  refetch: async () => ({ data: undefined }),
};

export function invalidateExploreRelationship(
  _queryClient: QueryClient,
  _relationship: "following" | "saved",
) {}

export function useExploreOptions(
  _filters: ExploreFilters,
  _enabled: boolean,
  _initial?: ExploreInitialData,
) {
  return idle;
}

export function useExploreFeed(
  _filters: ExploreFilters,
  _enabled: boolean,
  _initial?: ExploreInitialData,
) {
  return idle;
}

export function useExploreCategories(_enabled = true, _initial?: ExploreInitialData) {
  return idle;
}
