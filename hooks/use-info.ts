"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchInfo } from "@/lib/api/info";

/** Fetch on mount/focus so returning visitors can pick up an IP change. */
export function useInfo(enabled = true) {
  return useQuery({
    queryKey: ["info"],
    queryFn: fetchInfo,
    enabled,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
    retry: 1,
  });
}
