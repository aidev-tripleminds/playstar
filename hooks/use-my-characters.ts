"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteCharacter,
  fetchMyCharacters,
  setCharacterProfilePicture,
} from "@/lib/api/characters";
import { isUnauthorizedError } from "@/lib/api/client";
import type { MyCharactersQuery, MyCharactersResponse } from "@/lib/api/types";

import { useMe } from "./use-me";

export const MY_CHARACTERS_QUERY_KEY = ["my-characters"] as const;

/**
 * The backend's `per_page` ceiling. Requested explicitly because the default is
 * 20, and this page renders one flat grid with no pagination — anything past
 * the first page would simply be invisible. TODO(WHI-20): replace with real
 * pagination once a user can plausibly own more than this.
 */
const MY_CHARACTERS_PAGE_SIZE = 100;

/**
 * The logged-in user's own characters ("My AIs"), filtered server-side.
 *
 * The response carries presigned S3 image URLs that expire, so results are
 * deliberately short-lived rather than kept fresh forever — a long-open tab
 * would otherwise end up rendering dead image links.
 */
export function useMyCharacters(query: MyCharactersQuery = {}) {
  const { isLoggedIn } = useMe();
  const resolvedQuery: MyCharactersQuery = { per_page: MY_CHARACTERS_PAGE_SIZE, ...query };

  return useQuery<MyCharactersResponse>({
    queryKey: [...MY_CHARACTERS_QUERY_KEY, resolvedQuery],
    queryFn: () => fetchMyCharacters(resolvedQuery),
    enabled: isLoggedIn,
    // Comfortably inside the presigned-URL lifetime. Note this is per query
    // key, so it does NOT coalesce distinct filter/search combinations —
    // callers must debounce free-text input themselves.
    staleTime: 60_000,
    // A 401 means the session just ended — retrying is noise.
    retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 1,
    // Keep the previous page visible while the next filter combination loads,
    // so the grid does not flash its empty state between keystrokes.
    placeholderData: (previous) => previous,
  });
}

/** Invalidate the character list (e.g. after a create adds one). */
export function useInvalidateMyCharacters() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: MY_CHARACTERS_QUERY_KEY });
}

/**
 * Set one of the caller's generated images as that character's profile
 * picture. On success, refreshes every cached "my characters" query so My AIs
 * and preview model slots pick up the new thumbnail.
 */
export function useSetCharacterProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ characterMediaId }: { characterMediaId: string }) =>
      setCharacterProfilePicture({ character_media_id: characterMediaId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MY_CHARACTERS_QUERY_KEY });
    },
  });
}

/**
 * Delete one of the caller's own characters. On success, drops it from every
 * cached "my characters" query directly (rather than invalidating and
 * refetching) so the grid updates without a reload or a network round trip.
 */
export function useDeleteCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ characterId, deleteMedia }: { characterId: string; deleteMedia: boolean }) =>
      deleteCharacter(characterId, deleteMedia),
    onSuccess: (_response, { characterId }) => {
      queryClient.setQueriesData<MyCharactersResponse>(
        { queryKey: MY_CHARACTERS_QUERY_KEY },
        (current) => {
          if (!current) return current;

          const items = current.items.filter((item) => item.id !== characterId);
          // The key prefix matches EVERY cached filter/search combination, and
          // most of them never held this character. Only the ones that actually
          // lost a row may decrement their total — otherwise each cached filter
          // drifts one lower per delete.
          if (items.length === current.items.length) return current;

          return { ...current, items, total: Math.max(0, current.total - 1) };
        },
      );
    },
  });
}
