"use client";

import { GetTokensModalShell, type GetTokensModalShellProps } from "./components";
import {
  GET_TOKENS_MODAL_OUT_OF_TOKENS_CARD_OVERRIDES,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_ICON,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_LABEL,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_TITLE,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_UPGRADE_ICON,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_UPGRADE_LABEL,
} from "./get-tokens-modal-out-of-tokens.constants";

export type GetTokensModalOutOfTokensProps = Omit<
  GetTokensModalShellProps,
  "banner" | "cardOverrides" | "data-slot" | "showFreeTokens"
>;

/** Get Tokens modal when the user has no tokens left — packs, Upgrade to Infinite, and Earn 100 Free Tokens. */
export function GetTokensModalOutOfTokens({
  title = GET_TOKENS_MODAL_OUT_OF_TOKENS_TITLE,
  upgradeLabel = GET_TOKENS_MODAL_OUT_OF_TOKENS_UPGRADE_LABEL,
  upgradeLeftIconSrc = GET_TOKENS_MODAL_OUT_OF_TOKENS_UPGRADE_ICON,
  freeTokensLabel = GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_LABEL,
  freeTokensRightIconSrc = GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_ICON,
  ...props
}: GetTokensModalOutOfTokensProps) {
  return (
    <GetTokensModalShell
      {...props}
      data-slot="get-tokens-modal-out-of-tokens"
      title={title}
      cardOverrides={GET_TOKENS_MODAL_OUT_OF_TOKENS_CARD_OVERRIDES}
      upgradeLabel={upgradeLabel}
      upgradeLeftIconSrc={upgradeLeftIconSrc}
      showFreeTokens
      freeTokensLabel={freeTokensLabel}
      freeTokensRightIconSrc={freeTokensRightIconSrc}
    />
  );
}
