import type { TokenCardProps, TokenCardVariant } from "@/components/common/token-modals/token-card";

/** Figma Get Tokens modal — discount variant (node 1117-15138). */
export const GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_PREFIX = "Sale ending in:";
export const GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_SECONDS = 59 * 3600;

export const GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_CLASSNAME =
  "h-12  w-full max-w-[280px] [&>div]:flex [&>div]:h-full [&>div]:items-center [&>div]:justify-center [&>div]:p-0 [&>div]:px-4";

export const GET_TOKENS_MODAL_DISCOUNT_CARD_OVERRIDES: Partial<
  Record<TokenCardVariant, Partial<TokenCardProps>>
> = {
  pink: {
    tokenLabel: "4,300 TOKENS",
    bonusLabel: (
      <>
        3,500 + <span className="text-brand-primary line-through">525</span> 800 BONUS
      </>
    ),
  },
  blue: {
    tokenLabel: "7,000 TOKENS",
    bonusTagClassName: "box-content",
    bonusLabel: (
      <>
        5,000 + <span className="text-brand-primary line-through">1,250</span> 2000 BONUS
      </>
    ),
  },
};
