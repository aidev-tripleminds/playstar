"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

import { Countdown } from "../../general/countdown/countdown";
import { GradientGrid } from "../../general/gradient-grid/gradient-grid";
import { MODAL_LAYOUT_OVERLAY_CLASSNAME } from "../../general/modal-layout/modal-layout.constants";
import type { DiscountProductCardProperty } from "../discount-product-card/discount-product-card";
import { DiscountProductCard } from "../discount-product-card/discount-product-card";

export type InfiniteUpsellVariant =
  | "infinite-upsell-yearly"
  | "infinite-upsell-monthly1"
  | "infinite-upsell-monthly2";

export type InfiniteUpsellProps = {
  trigger?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When false, mobile drawer ignores outside click / drag dismiss. */
  dismissible?: boolean;
  /** When false, browser Back does not close this dialog. Default true. */
  closeOnHistoryBack?: boolean;
  /**
   * Optional Back interceptor. Return `false` to keep the dialog open and
   * restore the history trap (used by skip-on-Back).
   */
  onHistoryBack?: () => boolean | void;

  variant?: InfiniteUpsellVariant;

  title?: string;
  subtitle?: string;
  footerText?: string;

  planName?: string;
  discountLabel?: string;
  originalPrice?: string;
  discountedPrice?: string;
  cardProperty?: DiscountProductCardProperty;

  primaryLabel?: string;
  secondaryLabel?: string;

  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;

  className?: string;
};

type VariantDefaults = {
  title: string;
  subtitle: string;
  footerText?: string;
  cardProperty: DiscountProductCardProperty;
  originalPrice: string;
  discountedPrice: string;
  discountLabel: string;
  primaryLabel: string;
  secondaryLabel: string;
};

const variantDefaults: Record<InfiniteUpsellVariant, VariantDefaults> = {
  "infinite-upsell-yearly": {
    title: "Switch to monthly infinite",
    subtitle: "No price difference, change is free!",
    footerText: "No additional cost this month then $119.99 every month. Cancel anytime.",
    cardProperty: "gold",
    originalPrice: "$119.99",
    discountedPrice: "$0.00",
    discountLabel: "-100%",
    primaryLabel: "Switch to monthly infinite",
    secondaryLabel: "No thanks",
  },

  /** Figma 13355:101729 / 13388:101789 — Infinite upsell after Premium Monthly purchase. */
  "infinite-upsell-monthly1": {
    title: "Hey, don't miss it!",
    subtitle: "The discount won't last for long!",
    footerText: "Billed $38.00 on the first month, then $56.99. Cancel anytime.",
    cardProperty: "red",
    originalPrice: "$56.99",
    discountedPrice: "$38.00",
    discountLabel: "-75%",
    primaryLabel: "Continue",
    secondaryLabel: "Skip discount",
  },

  /** Figma 13410:140195 / 13410:140219 — deeper Infinite discount after Skip. */
  "infinite-upsell-monthly2": {
    title: "Are you sure?",
    subtitle: "The discount won't last for long!",
    footerText: "Billed $28.00 on the first month, then $56.99. Cancel anytime.",
    cardProperty: "gold",
    originalPrice: "$56.99",
    discountedPrice: "$33.00",
    discountLabel: "-77%",
    primaryLabel: "Continue",
    secondaryLabel: "Skip discount",
  },
};

function InfiniteUpsellActions({
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  className,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Buttons
        variant="rose"
        size="btn-m"
        label={primaryLabel}
        leftIcon={false}
        rightIcon={false}
        onClick={onPrimaryAction}
        className="w-full cursor-pointer"
      />
      <Buttons
        variant="neutral2"
        size="btn-m"
        label={secondaryLabel}
        leftIcon={false}
        rightIcon={false}
        onClick={onSecondaryAction}
        className="w-full cursor-pointer"
      />
    </div>
  );
}

export function InfiniteUpsell({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  dismissible = true,
  closeOnHistoryBack = true,
  onHistoryBack,
  variant = "infinite-upsell-yearly",
  title,
  subtitle,
  footerText,
  planName = "Infinite Plan",
  discountLabel,
  originalPrice,
  discountedPrice,
  cardProperty,
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  className,
}: InfiniteUpsellProps) {
  const defaults = variantDefaults[variant];

  const resolvedTitle = title ?? defaults.title;
  const resolvedSubtitle = subtitle ?? defaults.subtitle;
  const resolvedFooterText = footerText ?? defaults.footerText;
  const resolvedCardProperty = cardProperty ?? defaults.cardProperty;
  const resolvedOriginalPrice = originalPrice ?? defaults.originalPrice;
  const resolvedDiscountedPrice = discountedPrice ?? defaults.discountedPrice;
  const resolvedDiscountLabel = discountLabel ?? defaults.discountLabel;
  const resolvedPrimaryLabel = primaryLabel ?? defaults.primaryLabel;
  const resolvedSecondaryLabel = secondaryLabel ?? defaults.secondaryLabel;
  const photoSrc = dummyImage(159);

  return (
    <Dialog
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      dismissible={dismissible}
      closeOnHistoryBack={closeOnHistoryBack}
      onHistoryBack={onHistoryBack}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        showCloseButton={false}
        data-testid="infinite-upsell"
        data-variant={variant}
        overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
        className={cn(
          "box-border border-0 border-[var(--border-strong)] md:border md:border-solid",
          "bg-(--dialog-bg) p-0 shadow-none ring-0",
          "h-[100vh] w-full sm:max-w-full md:h-auto md:max-w-[600px] md:min-w-[600px]",
          "top-0 z-70 translate-y-0 data-[vaul-drawer-direction=bottom]:max-h-[100vh]! md:top-1/2 md:-translate-y-1/2",
          className,
        )}
      >
        <div className="relative h-[100vh] max-h-[100dvh] overflow-y-auto md:h-[390px] md:overflow-visible">
          <div
            className={cn(
              "relative flex min-h-[100dvh] flex-col overflow-visible",
              "rounded-[28px] md:h-[390px] md:min-h-[390px] md:flex-row md:overflow-hidden",
            )}
          >
            {/* CONTENT — bottom-aligned on mobile, left column on desktop */}
            <div
              className={cn(
                "relative z-12 flex w-full flex-1 flex-col justify-end gap-4",
                "p-4 pb-[136px]",
                "md:w-[50%] md:justify-center md:gap-5 md:bg-[image:var(--background-neutral-gradient)] md:p-6",
              )}
            >
              <div className="pointer-events-none absolute -top-[250px] left-1/2 hidden h-[420px] w-[820px] -translate-x-1/2 opacity-45 md:block">
                <GradientGrid
                  minOpacity={0.9}
                  maxOpacity={0.35}
                  showGrid
                  className="pointer-events-none absolute inset-0 h-full opacity-100"
                />
              </div>

              <div className="relative z-10 flex w-full flex-col items-center gap-4 md:gap-5">
                <div className="flex w-full flex-col items-center gap-1 text-center">
                  <Image
                    src="/assets/iconsax-unlimited-gold.svg"
                    width={40}
                    height={40}
                    alt=""
                    className="drop-shadow-[0_0_70px_rgba(255,224,45,1)]"
                  />

                  <DialogTitle className="text-center text-[24px] leading-[133.333%] font-bold text-[var(--countdown-text)] md:text-[20px] md:leading-[140%]">
                    {resolvedTitle}
                  </DialogTitle>

                  <p className="text-center text-sm leading-[142.857%] font-normal text-[var(--modal-text)]">
                    {resolvedSubtitle}
                  </p>
                </div>

                <Countdown className="w-full" />

                <DiscountProductCard
                  property={resolvedCardProperty}
                  planName={planName}
                  discountLabel={resolvedDiscountLabel}
                  originalPrice={resolvedOriginalPrice}
                  discountedPrice={resolvedDiscountedPrice}
                />

                {resolvedFooterText ? (
                  <p className="text-center text-xs leading-[133.333%] font-medium text-[var(--gray-text)]">
                    {resolvedFooterText}
                  </p>
                ) : null}
              </div>
            </div>

            {/* PHOTO — top 459px on mobile, right column on desktop */}
            <div
              className={cn(
                "absolute inset-x-0 top-0 z-[10] h-[459px] overflow-hidden",
                "md:relative md:inset-auto md:z-[12] md:h-full md:min-h-[390px] md:w-[50%]",
              )}
            >
              <Image src={photoSrc} alt="" fill className="object-cover object-top md:hidden" />

              <div
                className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
                style={{
                  backgroundImage: `url(${photoSrc})`,
                }}
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,0)_47%,rgba(14,14,14,1)_94%)] md:hidden" />
              <div className="absolute inset-0 hidden bg-[image:var(--image-overlay-gradient-desktop)] md:block" />

              <div className="relative z-10 hidden h-full w-full flex-col justify-end p-6 md:flex">
                <InfiniteUpsellActions
                  primaryLabel={resolvedPrimaryLabel}
                  secondaryLabel={resolvedSecondaryLabel}
                  onPrimaryAction={onPrimaryAction}
                  onSecondaryAction={onSecondaryAction}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-[100] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_25%)] p-4 md:hidden">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-2">
            <InfiniteUpsellActions
              primaryLabel={resolvedPrimaryLabel}
              secondaryLabel={resolvedSecondaryLabel}
              onPrimaryAction={onPrimaryAction}
              onSecondaryAction={onSecondaryAction}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
