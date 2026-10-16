import type { TokenCardProps, TokenCardVariant } from "@/components/common/token-modals/token-card";

/** Figma Get Tokens modal — infinite plan (node 10720-142519, Discount=No, no upgrade). */
export const GET_TOKENS_MODAL_INFINITE_CARD_OVERRIDES: Partial<
  Record<TokenCardVariant, Partial<TokenCardProps>>
> = {
  yellow: {
    tokenLabel: "600 TOKENS",
    buyLabel: "Buy for $29.99",
    bonusLabel: "",
  },
  pink: {
    tokenLabel: "1400 TOKENS",
    buyLabel: "Buy for $69.99",
    bonusLabel: "",
  },
  blue: {
    tokenLabel: "3000 TOKENS",
    buyLabel: "Buy for $149.99",
    bonusLabel: "",
  },
};
