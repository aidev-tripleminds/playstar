"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { checkCharacterMediaSaved, setCharacterMediaSaved } from "@/lib/api/character-media";

import { invalidateExploreRelationship } from "./use-explore";
import { useMe } from "./use-me";
import { useServerSwitch } from "./use-server-switch";

export const MEDIA_SAVED_QUERY_KEY = ["media-saved"] as const;

/**
 * Save switch for one media item: `on` is whether the viewer saved it, and
 * `toggle` saves or unsaves it. Undefined `mediaId` (a slide that is not a
 * stored media row): never saved, and `toggle` does nothing.
 */
export function useMediaSaved(mediaId: string | undefined) {
  const { isLoggedIn } = useMe();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: [...MEDIA_SAVED_QUERY_KEY, mediaId],
    queryFn: async () => {
      const { items } = await checkCharacterMediaSaved([mediaId!]);
      return items[0]?.saved ?? false;
    },
    enabled: isLoggedIn && mediaId !== undefined,
  });
  const send = useCallback(
    async (id: string, next: boolean) => {
      const key = [...MEDIA_SAVED_QUERY_KEY, id];
      await setCharacterMediaSaved(id, next);
      // A read that started before the write would land after it with the old state.
      await queryClient.cancelQueries({ queryKey: key });
      queryClient.setQueryData(key, next);
      invalidateExploreRelationship(queryClient, "saved");
    },
    [queryClient],
  );
  return useServerSwitch({ id: mediaId, serverValue: query.data, send });
}
