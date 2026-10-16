"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";

import type { CreatorSize } from "./creator.constants";

export function useCreatorSize(size?: CreatorSize): CreatorSize {
  const isDesktop = useIsDesktop(768);
  return size ?? (isDesktop ? "desktop" : "mobile");
}
