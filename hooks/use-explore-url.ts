"use client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useExploreSearchParams } from "@/hooks/use-explore-location";
import type { ExploreFilters } from "@/lib/api/explore";
import {
  EXPLORE_FILTER_KEYS,
  exploreSearchParams,
  parseExploreFilters,
} from "@/lib/explore/filters";

export function useExploreUrl(initialQuery = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useExploreSearchParams();
  const raw = searchParams?.toString() ?? initialQuery;
  const params = new URLSearchParams(raw);
  const filters = parseExploreFilters(
    EXPLORE_FILTER_KEYS.some((key) => params.has(key)) ? params : new URLSearchParams(initialQuery),
  );
  const current = useRef({ filters, raw, pathname });
  useEffect(() => {
    current.current = { filters, raw, pathname };
  }, [filters, raw, pathname]);
  const pendingSearch = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // This is uncommitted input text only. Applied filters always come from URL;
  // the buffer lets typing remain responsive while replace is debounced.
  const source = `${raw}|${filters.search ?? ""}`;
  const [draft, setDraft] = useState({ source, value: filters.search ?? "" });
  if (draft.source !== source) setDraft({ source, value: filters.search ?? "" });
  const searchDraft = draft.source === source ? draft.value : (filters.search ?? "");
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    pendingSearch.current = null;
  }, [raw, filters.search]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const update = useCallback(
    (patch: Partial<ExploreFilters>, mode: "push" | "replace" = "push") => {
      const state = current.current;
      if (timer.current) clearTimeout(timer.current);
      const next = {
        ...state.filters,
        ...(pendingSearch.current !== null
          ? { search: pendingSearch.current.trim().slice(0, 200) || undefined }
          : {}),
        ...patch,
      };
      router[mode](
        `${state.pathname}?${exploreSearchParams(next, new URLSearchParams(state.raw))}`,
        { scroll: false },
      );
    },
    [router],
  );
  const setSearch = useCallback(
    (value: string) => {
      pendingSearch.current = value;
      setDraft({ source, value });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => update({ search: value.trim().slice(0, 200) || undefined }, "replace"),
        300,
      );
    },
    [update, source],
  );
  return {
    filters,
    update,
    searchDraft,
    setSearch,
    hasUrlFilters: EXPLORE_FILTER_KEYS.some((key) => params.has(key)),
  };
}
