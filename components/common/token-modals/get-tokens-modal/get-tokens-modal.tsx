"use client";

import * as React from "react";

import { Countdown } from "@/components/common/general/countdown/countdown";

import { GetTokensModalShell, type GetTokensModalShellProps } from "./components";
import { GET_TOKENS_MODAL_BANNER_CLASS } from "./get-tokens-modal.constants";
import {
  GET_TOKENS_MODAL_SEASONAL_CARD_OVERRIDES,
  GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_CLASSNAME,
  GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_PREFIX,
  GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_SECONDS,
  GET_TOKENS_MODAL_SEASONAL_UPGRADE_ICON,
  GET_TOKENS_MODAL_SEASONAL_UPGRADE_LABEL,
} from "./get-tokens-modal-seasonal.constants";

export type GetTokensModalProps = Omit<
  GetTokensModalShellProps,
  | "banner"
  | "cardOverrides"
  | "data-slot"
  | "showFreeTokens"
  | "freeTokensLabel"
  | "freeTokensRightIconSrc"
  | "onGetFreeTokens"
> & {
  /** When true, shows seasonal bonus countdown + bonus pack labels (Figma 10720-141834). */
  isSeasonal?: boolean;
};

export function GetTokensModal({
  isSeasonal = true,
  upgradeLabel,
  upgradeLeftIconSrc,
  ...props
}: GetTokensModalProps) {
  if (!isSeasonal) {
    return (
      <GetTokensModalShell
        {...props}
        data-slot="get-tokens-modal"
        upgradeLabel={upgradeLabel}
        upgradeLeftIconSrc={upgradeLeftIconSrc}
      />
    );
  }

  return (
    <GetTokensModalShell
      {...props}
      data-slot="get-tokens-modal-seasonal"
      banner={
        <div className={GET_TOKENS_MODAL_BANNER_CLASS}>
          <Countdown
            prefix={GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_PREFIX}
            initialSeconds={GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_SECONDS}
            className={GET_TOKENS_MODAL_SEASONAL_COUNTDOWN_CLASSNAME}
          />
        </div>
      }
      cardOverrides={GET_TOKENS_MODAL_SEASONAL_CARD_OVERRIDES}
      upgradeLabel={upgradeLabel ?? GET_TOKENS_MODAL_SEASONAL_UPGRADE_LABEL}
      upgradeLeftIconSrc={upgradeLeftIconSrc ?? GET_TOKENS_MODAL_SEASONAL_UPGRADE_ICON}
    />
  );
}
