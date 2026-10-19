"use client";

import type { MyCharactersQuery, MyCharactersResponse } from "@/lib/api/types";

export const MY_CHARACTERS_QUERY_KEY = ["my-characters"] as const;

const EMPTY_CHARACTERS: MyCharactersResponse = {
  items: [],
  page: 1,
  per_page: 0,
  total: 0,
};

/** Local character list. The account character API is not called. */
export function useMyCharacters(_query: MyCharactersQuery = {}) {
  return {
    data: EMPTY_CHARACTERS,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: true,
    isFetched: true,
    status: "success" as const,
    refetch: async () => ({ data: EMPTY_CHARACTERS }),
  };
}

export function useInvalidateMyCharacters() {
  return () => Promise.resolve();
}

export function useSetCharacterProfilePicture() {
  return {
    isPending: false,
    mutate: () => {},
    mutateAsync: async () => ({ ok: true }),
  };
}

export function useDeleteCharacter() {
  return {
    isPending: false,
    mutate: () => {},
    mutateAsync: async () => ({ ok: true }),
  };
}
