"use client";

import * as React from "react";

import { useUpgradeLeaveRetention } from "@/components/common/pricing-modals/infinite-upsell/upgrade-leave-retention-gate";
import { usePremiumLeaveRetention } from "@/components/common/pricing-modals/join-premium-flow/premium-leave-retention-gate";

/**
 * Composes /premium and /upgrade leave gates. Each no-ops when the user is
 * not on its page, so nav chrome can call this once.
 */
export function useLeaveRetention() {
  const { requestLeave: requestPremiumLeave } = usePremiumLeaveRetention();
  const { requestLeave: requestUpgradeLeave } = useUpgradeLeaveRetention();

  const requestLeave = React.useCallback(
    (href: string) => requestUpgradeLeave(href) && requestPremiumLeave(href),
    [requestPremiumLeave, requestUpgradeLeave],
  );

  return { requestLeave };
}
