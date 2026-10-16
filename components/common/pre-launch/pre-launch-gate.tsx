"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { AGE_WARNING_COOKIE_NAME } from "@/components/common/general/age-warning/age-warning";
import { useMe } from "@/hooks/use-me";
import { readCookie, subscribeToCookieKey } from "@/lib/browser-cookie";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import {
  IS_PRE_LAUNCH_LOCKED,
  isPreLaunchLockedRoute,
  PRE_LAUNCH_FALLBACK_ROUTE,
  PRE_LAUNCH_UNLOCKED_FEATURES,
  type PreLaunchFeature,
} from "@/lib/pre-launch";
import { ROUTES } from "@/lib/routes";

import { PreLaunchNotice } from "./pre-launch-notice";
import { hasSeenPreLaunchNotice, markPreLaunchNoticeSeen } from "./pre-launch-notice-session";

function subscribeToAgeConsent(onStoreChange: () => void) {
  return subscribeToCookieKey(AGE_WARNING_COOKIE_NAME, onStoreChange);
}

function hasAgeConsent() {
  return readCookie(AGE_WARNING_COOKIE_NAME) != null;
}

/**
 * Whether the 18+ gate is out of the way.
 *
 * Both dialogs live in the same layout, so a signed-in user arriving on a fresh
 * browser would otherwise get the age gate and this notice at once — two
 * stacked modals fighting over focus, one of which refuses to close. The server
 * snapshot is `true` (same trick `AgeWarning`'s own `useConsentPhase` uses) so
 * nothing about the gate depends on a cookie the server cannot read.
 */
function useAgeConsentSettled(): boolean {
  return React.useSyncExternalStore(subscribeToAgeConsent, hasAgeConsent, () => true);
}

export type PreLaunchGateContextValue = {
  /**
   * True only when the build is locked AND the visitor is signed in. Logged-out
   * visitors are never locked — the public pages are the reason we deploy.
   */
  isLocked: boolean;
  /**
   * Call at the top of any handler that starts a product feature.
   * Returns `true` when the lock swallowed the interaction (the notice is now
   * open and the caller must stop), `false` when the caller may proceed.
   *
   * Pass the feature the handler belongs to — or several, any of which lets
   * it through — so it proceeds once unlocked
   * (`NEXT_PUBLIC_PRE_LAUNCH_UNLOCKED_FEATURES`); without one the handler stays
   * blocked until the lock itself is lifted.
   */
  blockIfLocked: (feature?: PreLaunchFeature | readonly PreLaunchFeature[]) => boolean;
  /** Opens the notice without gating anything. */
  showNotice: () => void;
};

const PreLaunchGateContext = React.createContext<PreLaunchGateContextValue | null>(null);

export type PreLaunchGateProviderProps = {
  children: React.ReactNode;
  /**
   * Whether a signed-in user standing on a locked route is sent to Explore.
   *
   * The funnel opts out: it is served on its own host (the `beforeFiles` host
   * rewrite in `next.config.ts`), where `/explore` is not the destination the
   * visitor came for and `FunnelSessionHandoff` is mid-flight carrying their
   * session to the real site. There, showing the notice is the whole gate.
   */
  redirectLockedRoutes?: boolean;
};

/**
 * Enforces the pre-launch lock for signed-in users: keeps them off the product
 * routes, and gives every "start a feature" handler one call to defer to.
 *
 * Deliberately a no-op when {@link IS_PRE_LAUNCH_LOCKED} is false, which is the
 * default — an unlocked build pays for nothing but this provider's render.
 */
export function PreLaunchGateProvider({
  children,
  redirectLockedRoutes = true,
}: PreLaunchGateProviderProps) {
  const { isLoggedIn, isSessionPending } = useMe();
  const pathname = usePathname();
  const router = useRouter();
  const [noticeOpen, setNoticeOpen] = React.useState(false);

  // `isSessionPending` stays true through hydration (see useMe), so this never
  // locks a page on the server render and unlocks it on the client.
  const isLocked = IS_PRE_LAUNCH_LOCKED && !isSessionPending && isLoggedIn;

  const showNotice = React.useCallback(() => {
    setNoticeOpen(true);
  }, []);

  const continueToCreate = React.useCallback(() => {
    // Explore-only still locks the girlfriend wizard. Pushing it is replaced
    // with Explore and this notice opens again, so Start Creating loops.
    if (!PRE_LAUNCH_UNLOCKED_FEATURES.has("create")) {
      return;
    }
    releaseModalHistoryForNavigation();
    router.push(ROUTES.createAiGirlfriend);
  }, [router]);

  const blockIfLocked = React.useCallback(
    (feature?: PreLaunchFeature | readonly PreLaunchFeature[]): boolean => {
      const features: readonly PreLaunchFeature[] =
        feature === undefined ? [] : typeof feature === "string" ? [feature] : feature;
      if (!isLocked || features.some((name) => PRE_LAUNCH_UNLOCKED_FEATURES.has(name))) {
        return false;
      }
      showNotice();
      return true;
    },
    [isLocked, showNotice],
  );

  const isOnLockedRoute = isLocked && isPreLaunchLockedRoute(pathname);
  const isAgeConsentSettled = useAgeConsentSettled();

  // Bounce off product routes reached by deep link, bookmark or a link we did
  // not intercept. `replace` so Back does not walk straight back into them.
  React.useEffect(() => {
    if (!isOnLockedRoute || !redirectLockedRoutes) {
      return;
    }
    router.replace(PRE_LAUNCH_FALLBACK_ROUTE);
  }, [isOnLockedRoute, redirectLockedRoutes, router]);

  /**
   * Two triggers, one dialog: landing on a locked route always explains itself
   * (keyed by path, so each attempt re-opens it), and otherwise a signed-in
   * session gets the welcome once.
   *
   * `null` while unlocked — including every server render and the hydration
   * pass, where `isSessionPending` holds `isLocked` false — so the notice can
   * never open out of a render the server did not produce.
   */
  const autoOpenTrigger =
    !isLocked || !isAgeConsentSettled ? null : isOnLockedRoute ? `route:${pathname}` : "welcome";
  const [handledTrigger, setHandledTrigger] = React.useState<string | null>(null);

  // Adjusting state during render rather than in an effect — the trigger is
  // derived from props/state, so an effect would only add a wasted pass (and
  // `react-hooks/set-state-in-effect` rightly rejects it).
  if (autoOpenTrigger !== handledTrigger) {
    setHandledTrigger(autoOpenTrigger);
    if (autoOpenTrigger && (autoOpenTrigger !== "welcome" || !hasSeenPreLaunchNotice())) {
      setNoticeOpen(true);
    }
  }

  // Sync the "already welcomed" marker OUT to session storage — the one thing
  // an effect is actually for. Keeps the write off the render path, so a
  // StrictMode double-render cannot burn the welcome before it is shown.
  React.useEffect(() => {
    if (noticeOpen) {
      markPreLaunchNoticeSeen();
    }
  }, [noticeOpen]);

  const value = React.useMemo<PreLaunchGateContextValue>(
    () => ({ isLocked, blockIfLocked, showNotice }),
    [isLocked, blockIfLocked, showNotice],
  );

  return (
    <PreLaunchGateContext.Provider value={value}>
      {children}
      {IS_PRE_LAUNCH_LOCKED ? (
        <PreLaunchNotice
          open={noticeOpen}
          onOpenChange={setNoticeOpen}
          onContinue={continueToCreate}
        />
      ) : null}
    </PreLaunchGateContext.Provider>
  );
}

/**
 * Unlocked fallback for isolated mounts (Storybook, unit tests) that are not
 * wrapped in the provider — mirrors `useAuthGate`. Production always mounts the
 * provider from `MainLayoutShell` and the funnel layout.
 */
const UNPROVIDED_FALLBACK: PreLaunchGateContextValue = {
  isLocked: false,
  blockIfLocked: () => false,
  showNotice: () => {},
};

export function usePreLaunchGate(): PreLaunchGateContextValue {
  return React.useContext(PreLaunchGateContext) ?? UNPROVIDED_FALLBACK;
}
