"use client";

import type { UsersCharacterMediaQuery } from "@/lib/api/types";

export const USERS_CHARACTER_MEDIA_QUERY_KEY = ["users-character-media"] as const;

export const USERS_CHARACTER_MEDIA_PAGE_SIZE = 24;

const EMPTY_MEDIA = {
  data: undefined,
  isPending: false,
  hasNextPage: false,
  isFetchingNextPage: false,
  isFetchNextPageError: false,
  fetchNextPage: async () => ({ data: undefined }),
  refetch: async () => ({ data: undefined }),
};

/** Local gallery. Generated media stays in the session instead of a backend list. */
export function useUsersCharacterMedia(_query: Omit<UsersCharacterMediaQuery, "cursor"> = {}) {
  return EMPTY_MEDIA;
}

/** Deletes stay on the page. Nothing is sent to the backend. */
export function useDeleteCharacterMedia() {
  return {
    isPending: false,
    mutate: () => {},
    mutateAsync: async () => ({ ok: true }),
  };
}
