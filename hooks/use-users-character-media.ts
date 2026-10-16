"use client";

import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteCharacterMedia,
  fetchUsersCharacterMedia,
  USERS_CHARACTER_MEDIA_PAGE_SIZE,
} from "@/lib/api/character-media";
import { isUnauthorizedError } from "@/lib/api/client";
import type { UsersCharacterMediaQuery, UsersCharacterMediaResponse } from "@/lib/api/types";

import { useMe } from "./use-me";

export const USERS_CHARACTER_MEDIA_QUERY_KEY = ["users-character-media"] as const;

export { USERS_CHARACTER_MEDIA_PAGE_SIZE };

function usersCharacterMediaQueryKey(limit: number) {
  return [...USERS_CHARACTER_MEDIA_QUERY_KEY, { limit }] as const;
}

function nextUsersCharacterMediaCursor(page: UsersCharacterMediaResponse): string | undefined {
  if (!page.has_more || !page.next_cursor) return undefined;
  return page.next_cursor;
}

/**
 * The logged-in user's generated character media, newest first, loaded in
 * `USERS_CHARACTER_MEDIA_PAGE_SIZE` pages. Pass the previous page's
 * `next_cursor` via `fetchNextPage`.
 *
 * Presigned display URLs expire, so results are kept short-lived rather than
 * cached forever — a long-open tab would otherwise render dead image links.
 */
export function useUsersCharacterMedia(query: Omit<UsersCharacterMediaQuery, "cursor"> = {}) {
  const { isLoggedIn } = useMe();
  const limit = query.limit ?? USERS_CHARACTER_MEDIA_PAGE_SIZE;

  return useInfiniteQuery({
    queryKey: usersCharacterMediaQueryKey(limit),
    queryFn: ({ pageParam, signal }) =>
      fetchUsersCharacterMedia(
        {
          limit,
          ...(pageParam ? { cursor: pageParam } : {}),
        },
        { signal },
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: nextUsersCharacterMediaCursor,
    enabled: isLoggedIn,
    staleTime: 60_000,
    retry: (failureCount, error) => !isUnauthorizedError(error) && failureCount < 1,
  });
}

function removeDeletedMediaFromInfinitePages(
  current: InfiniteData<UsersCharacterMediaResponse> | undefined,
  deletedIds: Set<string>,
): InfiniteData<UsersCharacterMediaResponse> | undefined {
  if (!current?.pages) return current;

  let changed = false;
  const pages = current.pages.map((page) => {
    const media = page.media.filter((item) => !deletedIds.has(item.id));
    if (media.length === page.media.length) return page;
    changed = true;
    return { ...page, media };
  });

  if (!changed) return current;
  return { ...current, pages };
}

/**
 * Delete one or more of the caller's generated media rows in a single request.
 * On success, drops them from every cached get-users-character-media query so
 * the gallery updates without a refetch.
 */
export function useDeleteCharacterMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ characterMediaIds }: { characterMediaIds: string[] }) => {
      if (characterMediaIds.length === 1) {
        return deleteCharacterMedia({ character_media_id: characterMediaIds[0] });
      }

      return deleteCharacterMedia({ character_media_ids: characterMediaIds });
    },
    onSuccess: (_response, { characterMediaIds }) => {
      const deletedIds = new Set(characterMediaIds);

      queryClient.setQueriesData<InfiniteData<UsersCharacterMediaResponse>>(
        { queryKey: USERS_CHARACTER_MEDIA_QUERY_KEY },
        (current: InfiniteData<UsersCharacterMediaResponse> | undefined) =>
          removeDeletedMediaFromInfinitePages(current, deletedIds),
      );
    },
  });
}
