import { apiFetch } from "./client";

export type CheckoutBody = {
  planPriceId: string;
  idempotencyKey: string;
  paymentInput: { token: string };
};

export type CheckoutResponse = {
  status: "succeeded" | "failed" | "requires_action" | "outcome_unknown";
  attemptId: string;
  orderId: string | null;
  failureCode: string | null;
  nextAction: Record<string, unknown> | null;
  amountCents: number;
  currency: string;
  coinsGranted: number;
  coinBalance: number | null;
  subscription: {
    planCode: string;
    interval: "monthly" | "quarterly" | "yearly";
    currentPeriodEnd: string;
    creditCents: number;
    bonusDays: number;
  } | null;
};

export function createCheckout(body: CheckoutBody): Promise<CheckoutResponse> {
  return apiFetch<CheckoutResponse>("/api/v1/payments/checkout", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
