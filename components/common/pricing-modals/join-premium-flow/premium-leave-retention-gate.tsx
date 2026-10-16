"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useMe } from "@/hooks/use-me";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import { isPreLaunchFeatureUnlocked } from "@/lib/pre-launch";
import { ROUTES } from "@/lib/routes";

import { JoinPremiumFlow, type JoinPremiumFlowVariant } from "./join-premium-flow";
import {
  hasPremiumLeaveRetentionBeenConsumed,
  markPremiumLeaveRetentionConsumed,
} from "./premium-leave-retention";

export type PremiumLeaveRetentionStep = 1 | 2 | 3;

export type PremiumLeaveRetentionContextValue = {
  /**
   * Returns `true` when the caller may navigate immediately.
   * Returns `false` when the leave-retention flow was opened and the caller
   * must wait (final skip resumes the pending href; claim stays on /premium).
   */
  requestLeave: (href: string) => boolean;
};

const PremiumLeaveRetentionContext = React.createContext<PremiumLeaveRetentionContextValue | null>(
  null,
);

const STEP_VARIANTS: Record<PremiumLeaveRetentionStep, JoinPremiumFlowVariant> = {
  1: "join-premium-flow--step1",
  2: "join-premium-flow--step2",
  3: "join-premium-flow--step3",
};

function pathnameOnly(href: string): string {
  const withoutHash = href.split("#")[0] ?? href;
  return withoutHash.split("?")[0] ?? withoutHash;
}

function isPremiumPath(path: string): boolean {
  return path === ROUTES.premium || path.startsWith(`${ROUTES.premium}/`);
}

export type PremiumLeaveRetentionProviderProps = {
  children: React.ReactNode;
};

/**
 * Layout-owned leave gate for `/premium`: one pending href + one 3-step
 * JoinPremiumFlow. Click handlers call `requestLeave` before `router.push`.
 */
export function PremiumLeaveRetentionProvider({ children }: PremiumLeaveRetentionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isSessionPending } = useMe();
  const [step, setStep] = React.useState<PremiumLeaveRetentionStep | null>(null);
  const pendingHrefRef = React.useRef<string | null>(null);
  /** Sync flag so double-clicks before re-render cannot open twice / overwrite href. */
  const isFlowOpenRef = React.useRef(false);
  /** Mirrors `step` so Skip handlers never read a stale render closure. */
  const stepRef = React.useRef<PremiumLeaveRetentionStep | null>(null);

  const closeFlow = React.useCallback(() => {
    isFlowOpenRef.current = false;
    stepRef.current = null;
    pendingHrefRef.current = null;
    setStep(null);
  }, []);

  const consumeAndClose = React.useCallback(() => {
    markPremiumLeaveRetentionConsumed();
    closeFlow();
  }, [closeFlow]);

  const requestLeave = React.useCallback(
    (href: string): boolean => {
      // Already showing a step — ignore duplicate clicks.
      if (isFlowOpenRef.current) {
        return false;
      }

      if (!isPremiumPath(pathname)) {
        return true;
      }

      // Auth-gated shell only — visitor never saw PremiumView, so no retention.
      if (isSessionPending || !isLoggedIn) {
        return true;
      }

      if (isPremiumPath(pathnameOnly(href))) {
        return true;
      }

      // Pre-launch (BACK-322): the retention offers are discounted checkouts,
      // which do not exist until payments open.
      if (!isPreLaunchFeatureUnlocked("payments")) {
        return true;
      }

      if (hasPremiumLeaveRetentionBeenConsumed()) {
        return true;
      }

      isFlowOpenRef.current = true;
      pendingHrefRef.current = href;
      stepRef.current = 1;
      setStep(1);
      return false;
    },
    [isLoggedIn, isSessionPending, pathname],
  );

  const handlePrimaryAction = React.useCallback(() => {
    // Claim discount: consume for this session and stay on /premium.
    consumeAndClose();
  }, [consumeAndClose]);

  const handleSecondaryAction = React.useCallback(() => {
    const current = stepRef.current;
    if (current === null) {
      return;
    }

    if (current < 3) {
      const next = (current + 1) as PremiumLeaveRetentionStep;
      stepRef.current = next;
      setStep(next);
      return;
    }

    const destination = pendingHrefRef.current;
    markPremiumLeaveRetentionConsumed();
    isFlowOpenRef.current = false;
    stepRef.current = null;
    pendingHrefRef.current = null;
    setStep(null);

    if (destination) {
      // Dialog close dismisses a synthetic history entry via history.back().
      // That would rewind over router.push — clear markers first (same pattern
      // as password-changed / reset-password).
      releaseModalHistoryForNavigation();
      router.push(destination);
    }
  }, [router]);

  const handleOpenChange = React.useCallback((open: boolean) => {
    // Block Escape / overlay dismiss — user must Skip or Claim.
    if (!open) {
      return;
    }
  }, []);

  /**
   * Browser Back advances Skip (and re-traps history while steps remain).
   * Final Skip navigates away; returning `true` lets the history helper close.
   */
  const handleHistoryBack = React.useCallback(() => {
    if (stepRef.current === null) {
      return true;
    }
    handleSecondaryAction();
    return stepRef.current === null;
  }, [handleSecondaryAction]);

  const value = React.useMemo(
    () => ({
      requestLeave,
    }),
    [requestLeave],
  );

  const open = step !== null;
  const variant = step !== null ? STEP_VARIANTS[step] : STEP_VARIANTS[1];

  return (
    <PremiumLeaveRetentionContext.Provider value={value}>
      {children}
      <JoinPremiumFlow
        open={open}
        onOpenChange={handleOpenChange}
        dismissible={false}
        onHistoryBack={handleHistoryBack}
        variant={variant}
        onPrimaryAction={handlePrimaryAction}
        onSecondaryAction={handleSecondaryAction}
      />
    </PremiumLeaveRetentionContext.Provider>
  );
}

const OUTSIDE_PROVIDER_FALLBACK: PremiumLeaveRetentionContextValue = {
  // Shared chrome (`ModalNavVariation` via `AppHeader`) also mounts in the
  // funnel layout, which has no leave-retention flow. Allow navigation.
  requestLeave: () => true,
};

export function usePremiumLeaveRetention(): PremiumLeaveRetentionContextValue {
  return React.useContext(PremiumLeaveRetentionContext) ?? OUTSIDE_PROVIDER_FALLBACK;
}
