"use client";

import * as React from "react";

import { InfiniteUpsell, type InfiniteUpsellVariant } from "./infinite-upsell";

export type InfiniteUpsellAfterPremiumMonthlyStep = 1 | 2;

export type InfiniteUpsellAfterPremiumMonthlyProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accept the Infinite offer shown on the current step. */
  onContinue?: () => void;
  /** Decline both discounts and leave the upsell. */
  onSkipAll?: () => void;
};

const STEP_VARIANTS: Record<InfiniteUpsellAfterPremiumMonthlyStep, InfiniteUpsellVariant> = {
  1: "infinite-upsell-monthly1",
  2: "infinite-upsell-monthly2",
};

/**
 * Two-step Infinite Plan upsell after a Premium Monthly purchase.
 * Skip on step 1 reveals a deeper discount; Skip on step 2 dismisses.
 */
export function InfiniteUpsellAfterPremiumMonthly({
  open = false,
  onOpenChange,
  onContinue,
  onSkipAll,
}: InfiniteUpsellAfterPremiumMonthlyProps) {
  const [step, setStep] = React.useState<InfiniteUpsellAfterPremiumMonthlyStep>(1);
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(1);
    }
  }

  const closeAndSkip = React.useCallback(() => {
    onSkipAll?.();
    onOpenChange?.(false);
  }, [onOpenChange, onSkipAll]);

  const handleContinue = React.useCallback(() => {
    onContinue?.();
    onOpenChange?.(false);
  }, [onContinue, onOpenChange]);

  const handleSkip = React.useCallback(() => {
    if (step === 1) {
      setStep(2);
      return;
    }

    closeAndSkip();
  }, [closeAndSkip, step]);

  const handleOpenChange = React.useCallback(() => {
    // Overlay / Escape should not skip the offer — user must Continue or Skip.
  }, []);

  const handleHistoryBack = React.useCallback(() => {
    if (step === 1) {
      handleSkip();
      return false;
    }

    closeAndSkip();
    return true;
  }, [closeAndSkip, handleSkip, step]);

  return (
    <InfiniteUpsell
      open={open}
      onOpenChange={handleOpenChange}
      dismissible={false}
      onHistoryBack={handleHistoryBack}
      variant={STEP_VARIANTS[step]}
      onPrimaryAction={handleContinue}
      onSecondaryAction={handleSkip}
    />
  );
}
