"use client";

import * as React from "react";

export type MainNavContextValue = {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  closeMobileSidebar: () => void;
  /** Temporarily gives a nested CMS hero the same header/sidebar chrome as an Explore page. */
  registerPageHero?: () => () => void;

  /** Layout root. Bottom nav portals here so it stacks under the mobile sidebar. */
  layoutElement?: HTMLElement | null;
  bottomNavVisible?: boolean;
  setBottomNavVisible?: (visible: boolean) => void;
  topNavVisible?: boolean;
  setTopNavVisible?: (visible: boolean) => void;
  /**
   * Layout-owned Premium / Get Tokens routing (auth-gated).
   * Free → `/premium`. Premium / Infinite → Get Tokens modal.
   */
  requestPremium?: () => void;
  /**
   * Insufficient tokens for a paid action.
   * Free → Get Premium modal. Premium / Infinite → out-of-tokens modal.
   */
  requestOutOfTokens?: () => void;
  /** Blurred-media "Subscribe now": opens the Get Premium modal (auth-gated). */
  requestMembership?: () => void;
  /** Blurred-media "Verify Age": opens the Go.cam verify-age modal (auth-gated). */
  requestAgeVerification?: () => void;
};

export const MainNavContext = React.createContext<MainNavContextValue | null>(null);

export function useMainNavContext() {
  return React.useContext(MainNavContext);
}

/** Registers a nested full-bleed hero with the app chrome for as long as it is mounted. */
export function useMainLayoutPageHero(enabled: boolean) {
  const registerPageHero = useMainNavContext()?.registerPageHero;

  React.useLayoutEffect(() => {
    if (!enabled) return;
    return registerPageHero?.();
  }, [enabled, registerPageHero]);
}
