"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { State } from "@/components/common/general/state/state";
import { cn } from "@/lib/utils";

import {
  EARN_FREE_TOKENS_CLOSE_CLASS,
  EARN_FREE_TOKENS_MODAL_CLASS,
  EARN_FREE_TOKENS_SUCCESS_CTA_LABEL,
  EARN_FREE_TOKENS_SUCCESS_DESCRIPTION,
  EARN_FREE_TOKENS_SUCCESS_TITLE,
  EARN_FREE_TOKENS_SUCCESS_TITLE_ICON,
} from "./earn-free-tokens.constants";

export type EarnFreeTokensSuccessPopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  ctaLabel?: string;
  onGotIt?: () => void;
  onClose?: () => void;
  className?: string;
};

/** Figma 21867-139513 — success after the native notification prompt (or Redeem). */
export function EarnFreeTokensSuccessPopup({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = EARN_FREE_TOKENS_SUCCESS_TITLE,
  titleIconSrc = EARN_FREE_TOKENS_SUCCESS_TITLE_ICON,
  description = EARN_FREE_TOKENS_SUCCESS_DESCRIPTION,
  ctaLabel = EARN_FREE_TOKENS_SUCCESS_CTA_LABEL,
  onGotIt,
  onClose,
  className,
}: EarnFreeTokensSuccessPopupProps) {
  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleGotIt = () => {
    onGotIt?.();
    onOpenChange?.(false);
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel="Close"
      closeClassName={EARN_FREE_TOKENS_CLOSE_CLASS}
      onClose={handleClose}
      className={cn(EARN_FREE_TOKENS_MODAL_CLASS, className)}
    >
      <div className="flex flex-col items-center gap-4" data-slot="earn-free-tokens-success-popup">
        <State status="success" />

        <p className="text-modal-text text-center text-sm leading-5 font-normal">{description}</p>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={ctaLabel}
          onClick={handleGotIt}
          className="w-full cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
