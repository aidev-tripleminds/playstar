"use client";

import * as React from "react";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { isInstalledApp } from "@/lib/is-installed-app";

import {
  isEarnFreeTokensPending,
  isEarnFreeTokensRedeemed,
  markEarnFreeTokensPending,
  markEarnFreeTokensRedeemed,
} from "./earn-free-tokens-storage";
import { scheduleModalHandoff } from "./schedule-modal-handoff";

export type UseEarnFreeTokensFlowOptions = {
  /** Called when the user taps “Get the App” — should open the OS install modal. */
  onOpenInstallApp?: () => void;
};

export function useEarnFreeTokensFlow({ onOpenInstallApp }: UseEarnFreeTokensFlowOptions = {}) {
  const isDesktop = useIsDesktop();
  const isHydrated = useIsHydrated();
  const [offerOpen, setOfferOpen] = React.useState(false);
  const [redeemOpen, setRedeemOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [didAutoOpenRedeem, setDidAutoOpenRedeem] = React.useState(false);

  if (isHydrated && !isDesktop && !didAutoOpenRedeem) {
    setDidAutoOpenRedeem(true);
    if (isInstalledApp() && isEarnFreeTokensPending() && !isEarnFreeTokensRedeemed()) {
      setRedeemOpen(true);
    }
  }

  const start = React.useCallback(() => {
    if (isDesktop) {
      return;
    }

    if (isEarnFreeTokensRedeemed()) {
      return;
    }

    if (isInstalledApp()) {
      markEarnFreeTokensPending();
      setRedeemOpen(true);
      return;
    }

    setOfferOpen(true);
  }, [isDesktop]);

  const handleGetTheApp = React.useCallback(() => {
    markEarnFreeTokensPending();
    setOfferOpen(false);
    scheduleModalHandoff(() => {
      onOpenInstallApp?.();
    });
  }, [onOpenInstallApp]);

  const showSuccess = React.useCallback(() => {
    setRedeemOpen(false);
    scheduleModalHandoff(() => {
      setSuccessOpen(true);
    });
  }, []);

  const handleSuccessClose = React.useCallback(() => {
    markEarnFreeTokensRedeemed();
    setSuccessOpen(false);
  }, []);

  return {
    offerOpen,
    setOfferOpen,
    redeemOpen,
    setRedeemOpen,
    successOpen,
    setSuccessOpen,
    start,
    handleGetTheApp,
    showSuccess,
    handleSuccessClose,
  };
}
