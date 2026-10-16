import type { TokenCardProps, TokenCardVariant } from "@/components/common/token-modals/token-card";

/** Figma Get Tokens modal — seasonal bonus (node 10720-141834, Discount=Yes). */
export const GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_PREFIX = "Bonus ending in:";
export const GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_SECONDS = 59 * 3600;

export const GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_CLASSNAME =
  "h-12 w-full max-w-[280px] [&>div]:flex [&>div]:h-full [&>div]:items-center [&>div]:justify-center [&>div]:p-0 [&>div]:px-4";

export const GET_TOKENS_MODAL_SEASONAL_UPGRADE_LABEL = "Upgrade to Infinite";
/** Figma iconsax-unlimited with Premium/Primary gold gradient (node 4864:49812). */
export const GET_TOKENS_MODAL_SEASONAL_UPGRADE_ICON = "/assets/iconsax-unlimited-gold.svg";

export const GET_TOKENS_MODAL_SEASONAL_CARD_OVERRIDES: Partial<
  Record<TokenCardVariant, Partial<TokenCardProps>>
> = {
  yellow: {
    tokenLabel: "600 TOKENS",
    buyLabel: "Buy for $29.99",
    bonusLabel: "",
  },
  pink: {
    tokenLabel: "1540 TOKENS",
    buyLabel: "Buy for $69.99",
    bonusLabel: "1,400 + 10% BONUS",
  },
  blue: {
    tokenLabel: "3600 TOKENS",
    buyLabel: "Buy for $149.99",
    bonusLabel: "3,000 + 20% BONUS",
  },
};
