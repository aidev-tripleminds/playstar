import type { TokenCardProps, TokenCardVariant } from "@/components/common/token-modals/token-card";

import { GET_TOKENS_MODAL_ICON } from "./get-tokens-modal.constants";

/** Figma Get Tokens modal — out of tokens (10720-141155 desktop, 10720-141158 mobile). */
export const GET_TOKENS_MODAL_OUT_OF_TOKENS_TITLE = "No Tokens Left? Get More!";

export const GET_TOKENS_MODAL_OUT_OF_TOKENS_UPGRADE_LABEL = "Upgrade to Infinite";
/** Figma iconsax-unlimited with Premium/Primary gold gradient (node 4864:49812). */
export const GET_TOKENS_MODAL_OUT_OF_TOKENS_UPGRADE_ICON = "/assets/iconsax-unlimited-gold.svg";

/** Figma 10720-141155 / 10720-141158 — rose CTA next to Upgrade to Infinite. */
export const GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_LABEL = "Earn 100 Free Tokens";
export const GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_ICON = GET_TOKENS_MODAL_ICON;

/** Desktop: row, hug. Mobile: stacked, full width (Figma layout_OWNM3K / layout_H982IB). */
export const GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTIONS_CLASS =
  "flex w-full flex-col items-stretch gap-2 max-md:px-4 md:flex-row md:items-center md:justify-center";
export const GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTION_BUTTON_CLASS = "w-full md:w-auto";

export const GET_TOKENS_MODAL_OUT_OF_TOKENS_CARD_OVERRIDES: Partial<
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
