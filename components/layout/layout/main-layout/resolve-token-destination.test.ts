import { describe, expect, it } from "vitest";

import { resolveTokenPurchaseDestination } from "./resolve-token-destination";

describe("resolveTokenPurchaseDestination", () => {
  it("sends free users to membership for both buy and insufficient-token actions", () => {
    expect(
      resolveTokenPurchaseDestination({
        isPremium: false,
        isInfinitePlan: false,
        tokenBalance: 0,
        reason: "buy",
      }),
    ).toBe("membership");
    expect(
      resolveTokenPurchaseDestination({
        isPremium: false,
        isInfinitePlan: false,
        tokenBalance: 5,
        reason: "insufficient",
      }),
    ).toBe("membership");
  });

  it("opens Get Tokens for Premium users who still have a balance", () => {
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: false,
        tokenBalance: 20,
        reason: "buy",
      }),
    ).toBe("get-tokens");
  });

  it("opens Infinite Get Tokens for Infinite users who still have a balance", () => {
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: true,
        tokenBalance: 20,
        reason: "buy",
      }),
    ).toBe("get-tokens-infinite");
  });

  it("opens the out-of-tokens modal when a paid user has no tokens left", () => {
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: false,
        tokenBalance: 0,
        reason: "buy",
      }),
    ).toBe("out-of-tokens");
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: true,
        tokenBalance: 0,
        reason: "buy",
      }),
    ).toBe("out-of-tokens");
  });

  it("opens the out-of-tokens modal when a paid action is refused for insufficient tokens", () => {
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: false,
        tokenBalance: 5,
        reason: "insufficient",
      }),
    ).toBe("out-of-tokens");
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: true,
        tokenBalance: 5,
        reason: "insufficient",
      }),
    ).toBe("out-of-tokens");
  });

  it("does not treat an unknown balance as out of tokens on a buy click", () => {
    expect(
      resolveTokenPurchaseDestination({
        isPremium: true,
        isInfinitePlan: false,
        tokenBalance: undefined,
        reason: "buy",
      }),
    ).toBe("get-tokens");
  });
});
