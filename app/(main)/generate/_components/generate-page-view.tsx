"use client";

import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { useMe } from "@/hooks/use-me";
import { isPreLaunchFeatureUnlocked } from "@/lib/pre-launch";

import { GenerateView } from "../v2/_components/generate-view";
import type { GenerateSectionTabId } from "../v2/_lib/types";

export type GeneratePageViewProps = {
  /** Real auth state resolved server-side (see `app/(main)/generate/page.tsx`). */
  initialIsLoggedIn: boolean;
  /** Character selected by the `?character=<Character.id>` entry point. */
  initialCharacterId?: string;
  /** Gallery the workspace opens on — set by `/generate-image` / `/generate-video`. */
  initialSectionTabId?: GenerateSectionTabId;
};

/**
 * `/generate` renders the v2 workspace. The first client render keeps using
 * `initialIsLoggedIn` until `useMe()` finishes resolving.
 */

export function GeneratePageView({
  initialIsLoggedIn,
  initialCharacterId,
  initialSectionTabId,
}: GeneratePageViewProps) {
  const { isLoggedIn: clientIsLoggedIn, isSessionPending } = useMe();
  const isHydrated = useIsHydrated();
  const isLoggedIn = isHydrated && !isSessionPending ? clientIsLoggedIn : initialIsLoggedIn;

  const videoEnabled = !isLoggedIn || isPreLaunchFeatureUnlocked("generate");
  const templatesEnabled = !isLoggedIn || isPreLaunchFeatureUnlocked("templates");

  return (
    <GenerateView
      initialCharacterId={initialCharacterId}
      initialSectionTabId={initialSectionTabId}
      videoEnabled={videoEnabled}
      templatesEnabled={templatesEnabled}
    />
  );
}
