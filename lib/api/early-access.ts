import { apiFetch, ApiRequestError } from "./client";

/** `POST /api/v1/early-access/premium` 200 (BACK-322). */
export type EarlyAccessPremiumResponse = {
  /** ISO end of the granted premium; null for a membership with no recorded end. */
  premiumUntil: string | null;
  tokenBalance: number;
  tokensCredited: number;
};

/** Backend error code once the admin panel switches the free premium claim off. */
export const EARLY_ACCESS_PREMIUM_DISABLED_CODE = "EARLY_ACCESS_PREMIUM_DISABLED";

/**
 * Claim free early-access premium: 90 days of premium and a wallet topped up
 * to 9999 tokens. Only offered while payments are pre-launch locked.
 */
export function claimEarlyAccessPremium(): Promise<EarlyAccessPremiumResponse> {
  return apiFetch<EarlyAccessPremiumResponse>("/api/v1/early-access/premium", { method: "POST" });
}

export function isEarlyAccessPremiumDisabledError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.code === EARLY_ACCESS_PREMIUM_DISABLED_CODE;
}
