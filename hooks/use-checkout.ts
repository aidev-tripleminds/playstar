"use client";

import { useMutation } from "@tanstack/react-query";
import * as React from "react";

import { ApiRequestError } from "@/lib/api/client";
import { type CheckoutResponse, createCheckout } from "@/lib/api/payments";

const STORAGE_PREFIX = "membership-checkout:idempotency:";

function storageKey(planPriceId: string): string {
  return `${STORAGE_PREFIX}${planPriceId}`;
}

export function readCheckoutKey(planPriceId: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(storageKey(planPriceId));
}

export function createCheckoutKey(planPriceId: string): string {
  const key = crypto.randomUUID();
  if (typeof window !== "undefined") sessionStorage.setItem(storageKey(planPriceId), key);
  return key;
}

export function clearCheckoutKey(planPriceId: string): void {
  if (typeof window !== "undefined") sessionStorage.removeItem(storageKey(planPriceId));
}

export function useCheckout(planPriceId: string | null) {
  const previousProductRef = React.useRef<string | null>(null);
  const keyRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!planPriceId) {
      previousProductRef.current = null;
      keyRef.current = null;
      return;
    }

    const changedProduct =
      previousProductRef.current !== null && previousProductRef.current !== planPriceId;
    previousProductRef.current = planPriceId;
    if (changedProduct) clearCheckoutKey(planPriceId);
    keyRef.current = readCheckoutKey(planPriceId) ?? createCheckoutKey(planPriceId);
  }, [planPriceId]);

  const mutation = useMutation({
    mutationFn: ({ token, idempotencyKey }: { token: string; idempotencyKey: string }) =>
      createCheckout({ planPriceId: planPriceId!, idempotencyKey, paymentInput: { token } }),
    retry: false,
  });

  const submit = React.useCallback(
    async (token: string): Promise<CheckoutResponse> => {
      if (!planPriceId) throw new Error("A plan price must be selected before checkout");
      const idempotencyKey =
        keyRef.current ?? readCheckoutKey(planPriceId) ?? createCheckoutKey(planPriceId);
      keyRef.current = idempotencyKey;

      try {
        const result = await mutation.mutateAsync({ token, idempotencyKey });
        if (result.status === "succeeded" || result.status === "failed") {
          clearCheckoutKey(planPriceId);
          keyRef.current = null;
        }
        return result;
      } catch (error) {
        if (error instanceof ApiRequestError && error.code === "IDEMPOTENCY_KEY_REUSE") {
          clearCheckoutKey(planPriceId);
          keyRef.current = createCheckoutKey(planPriceId);
        }
        throw error;
      }
    },
    [mutation, planPriceId],
  );

  return { ...mutation, submit };
}
