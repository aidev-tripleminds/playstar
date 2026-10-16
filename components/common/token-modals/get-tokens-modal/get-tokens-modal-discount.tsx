"use client";

import * as React from "react";

import { Countdown } from "@/components/common/general/countdown/countdown";

import { GetTokensModalShell, type GetTokensModalShellProps } from "./components";
import { GET_TOKENS_MODAL_BANNER_CLASS } from "./get-tokens-modal.constants";
import {
  GET_TOKENS_MODAL_DISCOUNT_CARD_OVERRIDES,
  GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_CLASSNAME,
  GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_PREFIX,
  GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_SECONDS,
} from "./get-tokens-modal-discount.constants";

export type GetTokensModalDiscountProps = Omit<
  GetTokensModalShellProps,
  | "banner"
  | "cardOverrides"
  | "data-slot"
  | "showFreeTokens"
  | "freeTokensLabel"
  | "freeTokensRightIconSrc"
  | "onGetFreeTokens"
> & {
  showCountdown?: boolean;
  countdown?: React.ReactNode;
};

export function GetTokensModalDiscount({
  showCountdown = true,
  countdown,
  ...props
}: GetTokensModalDiscountProps) {
  return (
    <GetTokensModalShell
      {...props}
      data-slot="get-tokens-modal-discount"
      banner={
        showCountdown
          ? (countdown ?? (
              <div className={GET_TOKENS_MODAL_BANNER_CLASS}>
                <Countdown
                  prefix={GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_PREFIX}
                  initialSeconds={GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_SECONDS}
                  className={GET_TOKENS_MODAL_DISCOUNT_COUNTDOWN_CLASSNAME}
                />
              </div>
            ))
          : null
      }
      cardOverrides={GET_TOKENS_MODAL_DISCOUNT_CARD_OVERRIDES}
    />
  );
}
