export type TokenPurchaseReason = "buy" | "insufficient";

export type TokenPurchaseDestination =
  | "membership"
  | "get-tokens"
  | "get-tokens-infinite"
  | "out-of-tokens";

/**
 * Where to send a user who wants tokens.
 *
 * Free users cannot buy token packs without a subscription — they get the
 * Get Premium modal. Paid users (Premium / Infinite) buy packs in-app; the
 * out-of-tokens modal is used when they have none left, or when an action
 * was refused for insufficient balance.
 */
export function resolveTokenPurchaseDestination({
  isPremium,
  isInfinitePlan,
  tokenBalance,
  reason,
}: {
  isPremium: boolean;
  isInfinitePlan: boolean;
  tokenBalance: number | undefined;
  reason: TokenPurchaseReason;
}): TokenPurchaseDestination {
  if (!isPremium) {
    return "membership";
  }

  const isOutOfTokens =
    reason === "insufficient" || (tokenBalance !== undefined && tokenBalance <= 0);

  if (isOutOfTokens) {
    return "out-of-tokens";
  }

  return isInfinitePlan ? "get-tokens-infinite" : "get-tokens";
}
