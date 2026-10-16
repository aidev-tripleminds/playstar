"use client";

import Image from "next/image";
import * as React from "react";

import { SETTINGS_MODAL_OVERLAY_CLASS } from "@/app/(main)/settings/_lib/constants";
import { Buttons } from "@/components/common/general/button/buttons";
import { Divider } from "@/components/common/general/divider/divider";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import {
  TokenCardCarousel,
  type TokenCardCarouselProps,
  type TokenCardProps,
  type TokenCardVariant,
} from "@/components/common/token-modals/token-card";
import { cn } from "@/lib/utils";

import {
  GET_TOKENS_MODAL_CAROUSEL_CLASS,
  GET_TOKENS_MODAL_CONTENT_CLASS,
  GET_TOKENS_MODAL_DIVIDER_CLASS,
  GET_TOKENS_MODAL_FOOTER_ICON,
  GET_TOKENS_MODAL_FOOTER_TEXT,
  GET_TOKENS_MODAL_HEADER_CLASS,
  GET_TOKENS_MODAL_ICON,
  GET_TOKENS_MODAL_INNER_CLASS,
  GET_TOKENS_MODAL_TITLE,
  GET_TOKENS_MODAL_UPGRADE_BUTTON_CLASS,
  GET_TOKENS_MODAL_UPGRADE_LABEL,
} from "../get-tokens-modal.constants";
import {
  GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTION_BUTTON_CLASS,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTIONS_CLASS,
  GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_LABEL,
} from "../get-tokens-modal-out-of-tokens.constants";

export type GetTokensModalShellProps = TokenCardCarouselProps & {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  showMobileHandle?: boolean;
  showFooter?: boolean;
  showUpgrade?: boolean;
  upgradeLabel?: string;
  upgradeLeftIconSrc?: string;
  /** Out-of-tokens only — Figma 10720-141155 / 10720-141158 “Earn 100 Free Tokens”. */
  showFreeTokens?: boolean;
  freeTokensLabel?: string;
  freeTokensRightIconSrc?: string;
  onGetFreeTokens?: () => void;
  closeLabel?: string;
  onClose?: () => void;
  onUpgrade?: () => void;
  contentClassName?: string;
  banner?: React.ReactNode;
  cardOverrides?: Partial<Record<TokenCardVariant, Partial<TokenCardProps>>>;
  "data-slot"?: string;
};

export function useGetTokensModalState({
  open,
  defaultOpen = true,
  onOpenChange,
  onClose,
}: Pick<GetTokensModalShellProps, "open" | "defaultOpen" | "onOpenChange" | "onClose">) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [delayElapsed, setDelayElapsed] = React.useState(false);

  const handleClose = React.useCallback(() => {
    onClose?.();
    if (!isControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  }, [isControlled, onClose, onOpenChange]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const dialogOpen = isControlled ? open : internalOpen;

  if (!dialogOpen && delayElapsed) {
    setDelayElapsed(false);
  }

  React.useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setDelayElapsed(true);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [dialogOpen]);

  const carouselReady = dialogOpen && delayElapsed;

  return {
    dialogOpen,
    carouselReady,
    handleClose,
    handleOpenChange,
  };
}

export function GetTokensModalShell({
  trigger,
  open,
  defaultOpen = true,
  onOpenChange,
  title = GET_TOKENS_MODAL_TITLE,
  titleIconSrc = GET_TOKENS_MODAL_ICON,
  showMobileHandle = true,
  showFooter = true,
  showUpgrade = true,
  upgradeLabel = GET_TOKENS_MODAL_UPGRADE_LABEL,
  upgradeLeftIconSrc = "/assets/crown-filled.svg",
  showFreeTokens = false,
  freeTokensLabel = GET_TOKENS_MODAL_OUT_OF_TOKENS_FREE_TOKENS_LABEL,
  freeTokensRightIconSrc = GET_TOKENS_MODAL_ICON,
  onGetFreeTokens,
  closeLabel = "Close",
  onClose,
  onUpgrade,
  contentClassName,
  className,
  banner,
  cardOverrides,
  "data-slot": dataSlot = "get-tokens-modal",
  ...carouselProps
}: GetTokensModalShellProps) {
  const { dialogOpen, carouselReady, handleClose, handleOpenChange } = useGetTokensModalState({
    open,
    defaultOpen,
    onOpenChange,
    onClose,
  });

  return (
    <ModalLayout
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      headerClassName={GET_TOKENS_MODAL_HEADER_CLASS}
      className={cn(GET_TOKENS_MODAL_CONTENT_CLASS, contentClassName)}
      overlayClassName={SETTINGS_MODAL_OVERLAY_CLASS}
    >
      <div className={GET_TOKENS_MODAL_INNER_CLASS} data-slot={dataSlot}>
        {banner}

        {carouselReady ? (
          <div className={GET_TOKENS_MODAL_CAROUSEL_CLASS}>
            <TokenCardCarousel
              active={dialogOpen}
              {...carouselProps}
              autoScrollIntervalMs={0}
              cardOverrides={cardOverrides}
              className={cn("w-full", className)}
            />
          </div>
        ) : null}

        {showFooter ? (
          <p className="text-modal-text flex items-center justify-center gap-1.5 px-0 text-center text-[16px] leading-5">
            <span className="relative inline-block h-4 w-4 shrink-0">
              <Image src={GET_TOKENS_MODAL_FOOTER_ICON} alt="" fill className="object-contain" />
            </span>
            {GET_TOKENS_MODAL_FOOTER_TEXT}
          </p>
        ) : null}

        {showUpgrade || showFreeTokens ? (
          <>
            <Divider label="OR" className={GET_TOKENS_MODAL_DIVIDER_CLASS} />
            {showFreeTokens ? (
              <div className={GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTIONS_CLASS}>
                {showUpgrade ? (
                  <Buttons
                    variant="premium-20"
                    size="btn-l"
                    leftIcon
                    rightIcon={false}
                    leftIconSrc={upgradeLeftIconSrc}
                    label={upgradeLabel}
                    onClick={onUpgrade}
                    className={GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTION_BUTTON_CLASS}
                  />
                ) : null}
                <Buttons
                  variant="rose"
                  size="btn-l"
                  leftIcon={false}
                  rightIcon
                  rightIconSrc={freeTokensRightIconSrc}
                  label={freeTokensLabel}
                  onClick={onGetFreeTokens}
                  className={GET_TOKENS_MODAL_OUT_OF_TOKENS_ACTION_BUTTON_CLASS}
                />
              </div>
            ) : (
              <Buttons
                variant="premium-20"
                size="btn-l"
                leftIcon
                rightIcon={false}
                leftIconSrc={upgradeLeftIconSrc}
                label={upgradeLabel}
                onClick={onUpgrade}
                className={GET_TOKENS_MODAL_UPGRADE_BUTTON_CLASS}
              />
            )}
          </>
        ) : null}
      </div>
    </ModalLayout>
  );
}
