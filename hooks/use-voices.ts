"use client";

import type { PublicVoice } from "@/lib/api/types";

export const VOICES_QUERY_KEY = ["voices"] as const;

const EMPTY_VOICES: PublicVoice[] = [];

/** Local voice list. The catalogue API is not called. */
export function useVoices() {
  return {
    data: EMPTY_VOICES,
    isPending: false,
    isError: false,
    error: null,
    refetch: async () => ({ data: EMPTY_VOICES }),
  };
}
