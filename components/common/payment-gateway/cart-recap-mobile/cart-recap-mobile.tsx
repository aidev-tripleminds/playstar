"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Close } from "@/components/common/general/close/close";
import { Handle } from "@/components/common/general/handle/handle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { AffiliateBonus } from "../../membership/affiliate-bonus";
import { type PerkItem, PerkList } from "../../membership/perk-list/perk-list";

type PerkListVariant = React.ComponentProps<typeof PerkList>["variant"];

export type CartRecapMobileProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  title?: string;

  showMobileHandle?: boolean;

  generateLabel?: string;

  onGenerate?: () => void;
  onClose?: () => void;

  className?: string;
  overlayClassName?: string;
  children?: React.ReactNode;

  affiliateTokens?: number;
  affiliateName?: string;
  showAffiliateBonus?: boolean;

  price?: string;
  onPay?: () => void;
  perkVariant?: PerkListVariant;
  perkItems?: PerkItem[];
  /** Hide the docked Pay CTA — used when card payments are locked out. */
  showPay?: boolean;
};

export function CartRecapMobile({
  trigger,
  open,
  defaultOpen,
  onOpenChange,

  title = "This is my modal popup",

  showMobileHandle = true,

  generateLabel = "Pay",

  onGenerate,
  onClose,

  className,
  overlayClassName,
  children,

  affiliateTokens = 200,
  affiliateName = "john-doe",
  showAffiliateBonus = true,

  price = "29.99€",
  onPay,
  perkVariant = "yearly",
  perkItems,
  showPay = true,
}: CartRecapMobileProps) {
  const isControlled = open !== undefined;

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      {!trigger && !isControlled ? (
        <DialogTrigger asChild>
          <Buttons
            variant="rose"
            size="btn-m"
            label="Open Modal"
            leftIcon={false}
            rightIcon={false}
            className="cursor-pointer"
          />
        </DialogTrigger>
      ) : null}

      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        data-slot="cart-recap-mobile"
        showCloseButton={false}
        overlayClassName={overlayClassName}
        className={cn(
          "border-surface-strong bg-dialog-bg flex w-full max-w-[calc(100%-1rem)] flex-col gap-4 rounded-[28px]! border",
          "max-h-[90vh] overflow-hidden px-4 pt-2 pb-4 ring-0 sm:max-w-[375px]",
          "data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10 sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95",
          "top-auto bottom-0 translate-y-0 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2",
          className,
        )}
      >
        {showMobileHandle ? (
          <div className="flex shrink-0 justify-center">
            <Handle />
          </div>
        ) : null}

        <header className="flex shrink-0 items-center gap-2">
          <DialogTitle className="text-select-text flex-1 text-left text-[18px]! leading-7 font-medium">
            {title}
          </DialogTitle>

          <DialogClose asChild>
            <Close aria-label="Close modal" onClick={onClose} size="medium" status="default" />
          </DialogClose>
        </header>

        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2.5">
            {children}
            {showAffiliateBonus ? (
              <AffiliateBonus
                tokens={affiliateTokens}
                affiliateName={affiliateName}
                className="my-0"
              />
            ) : null}
            <PerkList variant={perkVariant} items={perkItems} />
          </div>
        </div>

        {showPay ? (
          <div className="shrink-0">
            <Buttons
              variant="rose"
              size="btn-m"
              leftIconSrc="/assets/solar_card.svg"
              rightIcon={false}
              label={`${generateLabel} ${price}`}
              onClick={onPay || onGenerate}
              className="h-11! w-full max-w-none rounded-[64px]"
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
