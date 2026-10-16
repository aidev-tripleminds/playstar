"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import { useExploreHandoff } from "@/components/pages/explore/explore-handoff";
import { useSignupCtaBonusLabel } from "@/hooks/use-signup-cta-bonus";
import { setSignupSource } from "@/lib/prismic/cta";
import { ROUTES } from "@/lib/routes";

export type TryFreeCta = {
  /**
   * Where the CTA should navigate, or `undefined` when it is an action rather
   * than a link. Only set for a logged-in visitor; callers apply an editor's
   * own `cta_link` in preference to this.
   */
  href: string | undefined;
  /** Opens signup. Only meaningful when `href` is undefined. */
  onClick: () => Promise<void>;
  /** The "+N" pill, resolved from backend config. */
  bonusLabel: string;
};

/**
 * The one behaviour every CMS-authored "Try for free" CTA shares (BACK-149).
 *
 * The action is FIXED rather than editor-authored: with no `cta_link` the CTA
 * opens the signup modal, and a logged-in visitor goes to /explore instead.
 * Editors keep the label; they do not get to point the primary conversion
 * button somewhere that breaks the funnel. An editor who genuinely needs a
 * link still fills `cta_link`, which wins over everything here.
 *
 * The logged-in case is a real `href` rather than a router push so the CTA
 * stays a link when it behaves like one — middle-click and "open in new tab"
 * work. A visitor who authenticates through the modal is routed to the same
 * destination by the gate's success callback.
 *
 * `requireAuth` comes from the layout-owned `AuthGateProvider`
 * (`MainLayoutShell`), which already wraps every route the slice zone renders
 * on — so this mounts no modal of its own.
 *
 * `isLoggedIn` is false during SSR by design (see `useMe`), so the server
 * always renders the signup variant — which is also what a crawler should see
 * on these SEO pages.
 */
export function useTryFreeCta(signupSource?: string): TryFreeCta {
  const { requireAuth, isLoggedIn } = useAuthGate();
  const router = useRouter();
  const destination = useExploreHandoff() ?? ROUTES.explore;
  const bonusLabel = useSignupCtaBonusLabel();
  const requireAuthRef = React.useRef(requireAuth);
  React.useEffect(() => {
    requireAuthRef.current = requireAuth;
  }, [requireAuth]);

  const openExplore = React.useCallback(() => {
    router.push(destination);
  }, [router, destination]);

  const onClick = React.useCallback(async () => {
    if (signupSource) {
      try {
        await setSignupSource();
      } catch {
        // Attribution must settle before signup can race ahead, but this
        // optional bonus endpoint must never prevent signup itself. No report
        // here: `fetchBackend` reports a network or proxy failure, and the
        // backend logs and reports its own answer.
      }
    }
    const canContinue = requireAuthRef.current({
      preferModal: "signup",
      onSuccess: openExplore,
      verifyEmailReturnTo: destination,
    });
    if (canContinue) openExplore();
  }, [openExplore, signupSource, destination]);

  // /explore is the agreed destination for now (BACK-149) — deliberately
  // simple, and expected to change once there is a better answer for an
  // authenticated visitor landing on an SEO page.
  return { href: isLoggedIn ? destination : undefined, onClick, bonusLabel };
}
