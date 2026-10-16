"use client";

import { useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import type { MeResponse } from "@/lib/api/types";
import { subscribeToWalletEvents } from "@/lib/api/wallet-events";

import { ME_QUERY_KEY } from "./use-me";
import { SUBSCRIPTION_QUERY_KEY } from "./use-subscription";

export function useWalletStream(isLoggedIn: boolean) {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!isLoggedIn) return;

    const subscription = subscribeToWalletEvents({
      onWalletUpdate: async (event) => {
        await queryClient.cancelQueries({ queryKey: ME_QUERY_KEY });
        if (typeof event.tokenBalance === "number") {
          queryClient.setQueryData<MeResponse>(ME_QUERY_KEY, (current) =>
            current ? { ...current, token_balance: event.tokenBalance! } : current,
          );
        } else {
          // No balance was included, so the request below is the update path.
        }
        void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      },
      onSubscriptionUpdate: () => {
        void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
        void queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_QUERY_KEY });
      },
    });

    return subscription.unsubscribe;
  }, [isLoggedIn, queryClient]);
}
