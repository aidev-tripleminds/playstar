"use client";

import { useServerSwitch } from "./use-server-switch";

export const MEDIA_SAVED_QUERY_KEY = ["media-saved"] as const;

/** Local save switch. Nothing is read from or written to a media API. */
export function useMediaSaved(mediaId: string | undefined) {
  return useServerSwitch({
    id: mediaId,
    serverValue: false,
    send: async () => {},
  });
}
