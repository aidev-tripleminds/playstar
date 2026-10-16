"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { cn } from "@/lib/utils";

import {
  EARN_FREE_TOKENS_CLOSE_CLASS,
  EARN_FREE_TOKENS_MODAL_CLASS,
  EARN_FREE_TOKENS_OFFER_CTA_LABEL,
  EARN_FREE_TOKENS_OFFER_DESCRIPTION,
  EARN_FREE_TOKENS_OFFER_DESCRIPTION_HIGHLIGHT,
  EARN_FREE_TOKENS_OFFER_IMAGE_ALT,
  EARN_FREE_TOKENS_OFFER_IMAGE_SRC,
  EARN_FREE_TOKENS_OFFER_TITLE,
  EARN_FREE_TOKENS_OFFER_TITLE_ICON,
  EARN_FREE_TOKENS_TOKEN_TEXT_CLASS,
} from "./earn-free-tokens.constants";

function renderDescriptionWithTokenHighlight(description: string) {
  const highlightIndex = description.lastIndexOf(EARN_FREE_TOKENS_OFFER_DESCRIPTION_HIGHLIGHT);
  if (highlightIndex === -1) {
    return description;
  }

  return (
    <>
      {description.slice(0, highlightIndex)}
      <span className={EARN_FREE_TOKENS_TOKEN_TEXT_CLASS}>
        {EARN_FREE_TOKENS_OFFER_DESCRIPTION_HIGHLIGHT}
      </span>
      {description.slice(highlightIndex + EARN_FREE_TOKENS_OFFER_DESCRIPTION_HIGHLIGHT.length)}
    </>
  );
}

export type EarnFreeTokensPopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  onGetTheApp?: () => void;
  onClose?: () => void;
  className?: string;
};

/** Figma 21867-139513 — mobile “Get 100 tokens, for FREE” after Earn 100 Free Tokens. */
export function EarnFreeTokensPopup({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = EARN_FREE_TOKENS_OFFER_TITLE,
  titleIconSrc = EARN_FREE_TOKENS_OFFER_TITLE_ICON,
  description = EARN_FREE_TOKENS_OFFER_DESCRIPTION,
  imageSrc = EARN_FREE_TOKENS_OFFER_IMAGE_SRC,
  imageAlt = EARN_FREE_TOKENS_OFFER_IMAGE_ALT,
  ctaLabel = EARN_FREE_TOKENS_OFFER_CTA_LABEL,
  onGetTheApp,
  onClose,
  className,
}: EarnFreeTokensPopupProps) {
  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleGetTheApp = () => {
    onGetTheApp?.();
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
      <div className="flex flex-col gap-4" data-slot="earn-free-tokens-popup">
        <div className="relative h-[180px] w-full overflow-hidden rounded-2xl">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 390px) 100vw, 390px"
            priority
          />
        </div>

        <p className="text-modal-text text-sm leading-5 font-normal">
          {renderDescriptionWithTokenHighlight(description)}
        </p>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={ctaLabel}
          onClick={handleGetTheApp}
          className="w-full cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
