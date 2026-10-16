"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { showToast } from "@/components/common/general/toast/toast";
import { ME_QUERY_KEY } from "@/hooks/use-me";
import { SUBSCRIPTION_QUERY_KEY } from "@/hooks/use-subscription";
import { claimEarlyAccessPremium, isEarlyAccessPremiumDisabledError } from "@/lib/api/early-access";

import {
  EarlyAccessPremiumDialog,
  type EarlyAccessPremiumDialogVariant,
} from "./early-access-premium-dialog";

export const EARLY_ACCESS_CLAIM_ERROR_TOAST = "Could not upgrade you right now. Please try again.";

export type UseEarlyAccessPremiumClaimOptions = {
  /**
   * Runs when the user takes the CTA of the `granted` dialog. Dismissing it
   * (Escape, outside click, browser Back) only closes it.
   */
  onGrantedContinue?: () => void;
};

/**
 * "Buy" while payments are pre-launch locked (BACK-322): claims free
 * early-access Premium and explains the outcome — granted, or closed by the
 * admin panel's `EARLY_ACCESS_PREMIUM_ENABLED` switch. Render `dialog` once in
 * the calling component.
 */
export function useEarlyAccessPremiumClaim({
  onGrantedContinue,
}: UseEarlyAccessPremiumClaimOptions = {}) {
  const queryClient = useQueryClient();
  const [isClaiming, setIsClaiming] = React.useState(false);
  const inFlightRef = React.useRef(false);
  const [dialogVariant, setDialogVariant] = React.useState<EarlyAccessPremiumDialogVariant | null>(
    null,
  );

  const claim = React.useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsClaiming(true);
    try {
      await claimEarlyAccessPremium();
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY }),
      ]);
      setDialogVariant("granted");
    } catch (error) {
      if (isEarlyAccessPremiumDisabledError(error)) {
        setDialogVariant("closed");
      } else {
        showToast({ type: "error", text: EARLY_ACCESS_CLAIM_ERROR_TOAST, error });
      }
    } finally {
      inFlightRef.current = false;
      setIsClaiming(false);
    }
  }, [queryClient]);

  const dialog = dialogVariant ? (
    <EarlyAccessPremiumDialog
      open
      onOpenChange={(open) => {
        if (!open) setDialogVariant(null);
      }}
      onContinue={dialogVariant === "granted" ? onGrantedContinue : undefined}
      variant={dialogVariant}
    />
  ) : null;

  return { claim, isClaiming, dialog };
}
