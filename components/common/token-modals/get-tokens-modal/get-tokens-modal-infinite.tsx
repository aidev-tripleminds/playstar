"use client";

import { GetTokensModalShell, type GetTokensModalShellProps } from "./components";
import { GET_TOKENS_MODAL_INFINITE_CARD_OVERRIDES } from "./get-tokens-modal-infinite.constants";

export type GetTokensModalInfiniteProps = Omit<
  GetTokensModalShellProps,
  | "banner"
  | "cardOverrides"
  | "data-slot"
  | "showUpgrade"
  | "showFreeTokens"
  | "freeTokensLabel"
  | "freeTokensRightIconSrc"
  | "onGetFreeTokens"
>;

/** Get Tokens modal when the user already has Infinite — no discount, no upgrade CTA. */
export function GetTokensModalInfinite(props: GetTokensModalInfiniteProps) {
  return (
    <GetTokensModalShell
      {...props}
      data-slot="get-tokens-modal-infinite"
      showUpgrade={false}
      cardOverrides={GET_TOKENS_MODAL_INFINITE_CARD_OVERRIDES}
    />
  );
}
