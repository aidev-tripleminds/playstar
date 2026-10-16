"use client";

import * as Sentry from "@sentry/nextjs";
import { useQuery } from "@tanstack/react-query";

import { isClientErrorResponse } from "@/lib/api/client";
import type { PublicVoice } from "@/lib/api/types";
import { fetchVoices } from "@/lib/api/voices";

export const VOICES_QUERY_KEY = ["voices"] as const;

/** The backend's `limit` ceiling. */
const VOICES_PAGE_SIZE = 200;

/**
 * How many pages we are willing to walk. A curated catalogue is expected to be
 * tens of rows, so this is a runaway guard, not a product limit — but it IS a
 * silent truncation, so it warns rather than trimming quietly.
 */
const VOICES_MAX_PAGES = 5;

/**
 * Fetch the whole catalogue, following the keyset cursor to the end.
 *
 * Deliberately unfiltered. Filtering server-side would give each gender/search
 * combination its own cache entry AND — the real problem — would make id →
 * voice lookup partial: the edit flow has to render the name of the voice a
 * character already has, which may sit outside the pool currently on screen.
 * One complete list resolves every id and lets the picker filter in memory.
 */
async function fetchVoiceCatalogue(): Promise<PublicVoice[]> {
  const items: PublicVoice[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < VOICES_MAX_PAGES; page += 1) {
    const response = await fetchVoices({ limit: VOICES_PAGE_SIZE, cursor });
    items.push(...response.items);

    if (!response.has_more || !response.next_cursor) {
      return items;
    }

    cursor = response.next_cursor;
  }

  Sentry.captureMessage(
    `Voice catalogue exceeded ${VOICES_MAX_PAGES * VOICES_PAGE_SIZE} entries; the picker is showing a truncated list.`,
    "warning",
  );
  return items;
}

/**
 * The full voice catalogue for the requesting brand.
 *
 * Long `staleTime`: the catalogue is admin-curated and changes on the order of
 * weeks, and the response carries stable public URLs (unlike the presigned
 * image URLs `useMyCharacters` has to keep short-lived).
 */
export function useVoices() {
  return useQuery({
    queryKey: VOICES_QUERY_KEY,
    queryFn: fetchVoiceCatalogue,
    staleTime: 30 * 60_000,
    // A 4xx here is a contract problem (or an unresolvable brand) — retrying
    // cannot fix it. Transient 5xx/network failures still get one retry.
    retry: (failureCount, error) => !isClientErrorResponse(error) && failureCount < 1,
  });
}

/**
 * Voices matching `gender`, in catalogue order (the backend sorts for the
 * picker: the default voice first, then the most used, then alphabetically).
 *
 * `gender` is a filter over `"female" | "male"` — the ONLY two values the
 * catalogue holds. A Trans character has no pool of its own: the caller picks
 * which one to show (see `voiceGenderForCharacterGender`). Passing anything
 * else here yields an empty list rather than everything, because a silently
 * unfiltered picker is worse than a visibly empty one.
 */
export function filterVoices(voices: readonly PublicVoice[], gender: string): PublicVoice[] {
  return voices.filter((voice) => voice.gender === gender);
}

/** The primary subtag of a BCP-47 tag: "en-US" → "en", "en" → "en". */
function primaryLanguageSubtag(language: string): string {
  return language.trim().toLowerCase().split("-")[0] ?? "";
}

/**
 * Whether a voice speaks `language`, compared on the primary subtag alone.
 *
 * The catalogue mixes tag shapes ("en", "en-US", "it-IT"), and a UI language of
 * "en" means English however the row spells it — an exact match would hide
 * every "en-US" voice from an English UI.
 */
export function matchesVoiceLanguage(voiceLanguage: string, language: string): boolean {
  return primaryLanguageSubtag(voiceLanguage) === primaryLanguageSubtag(language);
}

/**
 * The voices a character may be given: its gender pool, narrowed to the UI
 * language.
 *
 * Falls back to the whole gender pool when that language has no voice at all.
 * A brand whose catalogue does not cover the UI language is a configuration
 * problem, but an empty picker turns it into a character with no voice — the
 * one outcome the flow must not produce.
 */
export function selectableVoices(
  voices: readonly PublicVoice[],
  gender: string,
  language: string,
): PublicVoice[] {
  const pool = filterVoices(voices, gender);
  const inLanguage = pool.filter((voice) => matchesVoiceLanguage(voice.language, language));

  return inLanguage.length > 0 ? inLanguage : pool;
}

/**
 * The voice to pre-select from `pool`: the one the admin marked default, else
 * the first — the catalogue lists the most used voices first, so a gender +
 * language with no default yet starts on its most used voice.
 */
export function defaultVoice(pool: readonly PublicVoice[]): PublicVoice | undefined {
  return pool.find((voice) => voice.is_default) ?? pool[0];
}

/** Resolve a stored `voice_id` to its catalogue row, or `undefined` if it is unknown/not yet loaded. */
export function findVoiceById(
  voices: readonly PublicVoice[],
  voiceId: string,
): PublicVoice | undefined {
  return voiceId ? voices.find((voice) => voice.id === voiceId) : undefined;
}
