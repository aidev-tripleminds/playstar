"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useMe } from "@/hooks/use-me";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import { buildPostUpgradeDestination, HEAR_ABOUT_US_ORDER_PARAM, ROUTES } from "@/lib/routes";

import { InfiniteUpsellAfterPremiumMonthly } from "./infinite-upsell-after-premium-monthly";
import {
  hasUpgradeLeaveRetentionBeenConsumed,
  markUpgradeLeaveRetentionConsumed,
} from "./upgrade-leave-retention";

export type UpgradeLeaveRetentionContextValue = {
  /**
   * Returns `true` when the caller may navigate immediately.
   * Returns `false` when the leave-retention flow was opened and the caller
   * must wait (final skip continues the original post-purchase destination;
   * Continue stays on /upgrade).
   */
  requestLeave: (href: string) => boolean;
};

const UpgradeLeaveRetentionContext = React.createContext<UpgradeLeaveRetentionContextValue | null>(
  null,
);

function pathnameOnly(href: string): string {
  const withoutHash = href.split("#")[0] ?? href;
  return withoutHash.split("?")[0] ?? withoutHash;
}

function isUpgradePath(path: string): boolean {
  return path === ROUTES.upgrade || path.startsWith(`${ROUTES.upgrade}/`);
}

function surveyOrderFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(HEAR_ABOUT_US_ORDER_PARAM);
}

export type UpgradeLeaveRetentionProviderProps = {
  children: React.ReactNode;
};

/**
 * Layout-owned leave gate for `/upgrade`: the two-step Infinite upsell.
 * Click handlers call `requestLeave` before `router.push`. Final skip sends
 * the user to the post-purchase destination they would have hit before this page.
 */
export function UpgradeLeaveRetentionProvider({ children }: UpgradeLeaveRetentionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isSessionPending } = useMe();
  const [open, setOpen] = React.useState(false);
  const isFlowOpenRef = React.useRef(false);

  const closeFlow = React.useCallback(() => {
    isFlowOpenRef.current = false;
    setOpen(false);
  }, []);

  const consumeAndClose = React.useCallback(() => {
    markUpgradeLeaveRetentionConsumed();
    closeFlow();
  }, [closeFlow]);

  const requestLeave = React.useCallback(
    (href: string): boolean => {
      if (isFlowOpenRef.current) {
        return false;
      }

      if (!isUpgradePath(pathname)) {
        return true;
      }

      if (isSessionPending || !isLoggedIn) {
        return true;
      }

      if (isUpgradePath(pathnameOnly(href))) {
        return true;
      }

      if (hasUpgradeLeaveRetentionBeenConsumed()) {
        return true;
      }

      isFlowOpenRef.current = true;
      setOpen(true);
      return false;
    },
    [isLoggedIn, isSessionPending, pathname],
  );

  const handleContinue = React.useCallback(() => {
    consumeAndClose();
  }, [consumeAndClose]);

  const handleSkipAll = React.useCallback(() => {
    markUpgradeLeaveRetentionConsumed();
    isFlowOpenRef.current = false;
    setOpen(false);

    releaseModalHistoryForNavigation();
    router.replace(buildPostUpgradeDestination(surveyOrderFromLocation()));
  }, [router]);

  const value = React.useMemo(
    () => ({
      requestLeave,
    }),
    [requestLeave],
  );

  return (
    <UpgradeLeaveRetentionContext.Provider value={value}>
      {children}
      <InfiniteUpsellAfterPremiumMonthly
        open={open}
        onContinue={handleContinue}
        onSkipAll={handleSkipAll}
      />
    </UpgradeLeaveRetentionContext.Provider>
  );
}

const OUTSIDE_PROVIDER_FALLBACK: UpgradeLeaveRetentionContextValue = {
  requestLeave: () => true,
};

export function useUpgradeLeaveRetention(): UpgradeLeaveRetentionContextValue {
  return React.useContext(UpgradeLeaveRetentionContext) ?? OUTSIDE_PROVIDER_FALLBACK;
}
