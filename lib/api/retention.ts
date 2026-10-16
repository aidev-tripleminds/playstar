import { apiFetch } from "./client";

export type CancellationReason = {
  code: string;
  label: string;
  sortOrder: number;
};

export type RetentionOffer = {
  id: string;
  trigger: "cancel" | "delete_account";
  step: number;
  planPriceId: string;
  planCode: string;
  interval: "monthly" | "quarterly" | "yearly";
  currency: string;
  dealPriceCents: number;
  compareAtCents: number | null;
  dealCycles: number | null;
  renewalPriceCents: number | null;
  periodLabel: string;
  thenLabel: string | null;
  badgeText: string | null;
  headline: string | null;
  perks: unknown;
  acceptLabel: string;
  declineLabel: string;
  imageAssetKey: string | null;
};

export type CancellationStepResponse = {
  flowId: string;
  offer: RetentionOffer | null;
  outcome: string;
};

export type AcceptRetentionOfferResponse = {
  flowId: string;
  acceptedOfferId: string;
  planPriceId: string | null;
  dealPriceCents: number;
  dealCyclesRemaining: number | null;
  dealRenewalPriceCents: number | null;
  chargedCents: 0;
  effectiveAt: string | null;
};

export type ConfirmCancellationResponse = {
  flowId: string;
  outcome: "cancelled";
  effect: "immediate" | "period_end";
  accessUntil: string | null;
};

export async function fetchCancellationReasons(): Promise<CancellationReason[]> {
  const reasons = await apiFetch<CancellationReason[]>("/api/v1/subscription/cancel/reasons");
  return [...reasons].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function startCancellation(input: {
  reasonCode: string;
  note?: string;
}): Promise<CancellationStepResponse> {
  return apiFetch<CancellationStepResponse>("/api/v1/subscription/cancel/start", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function declineRetentionOffer(input: {
  flowId: string;
  offerId: string;
}): Promise<CancellationStepResponse> {
  return apiFetch<CancellationStepResponse>("/api/v1/subscription/cancel/decline-offer", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function acceptRetentionOffer(input: {
  flowId: string;
  offerId: string;
}): Promise<AcceptRetentionOfferResponse> {
  return apiFetch<AcceptRetentionOfferResponse>("/api/v1/subscription/cancel/accept-offer", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function confirmCancellation(flowId: string): Promise<ConfirmCancellationResponse> {
  return apiFetch<ConfirmCancellationResponse>("/api/v1/subscription/cancel/confirm", {
    method: "POST",
    body: JSON.stringify({ flowId }),
  });
}
