"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAsset } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import { GradientGrid } from "../../general/gradient-grid/gradient-grid";
import { PerkList } from "../../membership/perk-list/perk-list";
import { DiscountProductCard } from "../discount-product-card/discount-product-card";

export type DeleteAccountPromoProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  tokenLabel?: string;
  featuresLabel?: string;
  planName?: string;
  discountLabel?: string;
  originalPrice?: string;
  discountedPrice?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  secondaryDisabled?: boolean;
  secondaryError?: string | null;
  className?: string;
};

function DeleteAccountPromoActions({
  primaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  secondaryDisabled,
  secondaryError,
  className,
}: {
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  secondaryDisabled?: boolean;
  secondaryError?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Buttons
        variant="rose"
        size="btn-m"
        label={primaryLabel}
        leftIcon
        rightIcon={false}
        leftIconSrc="/assets/crown-filled.svg"
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
        disabled={secondaryDisabled}
        className="w-full cursor-pointer"
      />
      {secondaryError ? (
        <p className="text-sm leading-5 font-medium text-[var(--state-error-border)]" role="alert">
          {secondaryError}
        </p>
      ) : null}
    </div>
  );
}

export function DeleteAccountPromo({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Unlock Yearly Premium!",
  tokenLabel = "200 tokens every month",
  featuresLabel = "Access to all features",
  planName = "1 Year Premium",
  discountLabel = "-50%",
  originalPrice = "$47.88",
  discountedPrice = "$29.99",
  primaryLabel = "Unlock now!",
  secondaryLabel = "Delete my account",
  onPrimaryAction,
  onSecondaryAction,
  secondaryDisabled = false,
  secondaryError,
  className,
}: DeleteAccountPromoProps) {
  const nangiSrc = useAsset("demo_pics_nangi").image ?? "";

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent
        showCloseButton={false}
        data-testid="delete-account-promo"
        overlayClassName="supports-backdrop-filter:backdrop-blur-none bg-black/20 supports-backdrop-filter:backdrop-blur-lg"
        className={cn(
          "box-border border-0 border-[var(--border-strong)] md:border md:border-solid",
          "bg-(--dialog-bg) p-0 shadow-none ring-0",
          "h-[100vh] w-full sm:max-w-full md:h-auto",
          "top-0 translate-y-0 md:top-1/2 md:-translate-y-1/2",
          "z-71! mb-0 data-[vaul-drawer-direction=bottom]:max-h-[100vh] md:max-w-[600px] md:min-w-[600px]",
          className,
        )}
      >
        <div className="relative max-h-[100dvh] min-h-[100vh] overflow-y-auto md:min-h-[390px] md:overflow-visible">
          <div className="upsell-main relative flex min-h-[100dvh] flex-col overflow-visible rounded-[28px] md:min-h-[390px] md:flex-row md:overflow-hidden">
            {/* Content first (left on desktop). Not using .mob-upsell — that CSS centers/clips on short phones. */}
            <div className="relative z-12 flex h-full w-full flex-col p-4 pb-[0px] md:w-[50%] md:bg-[image:var(--background-neutral-gradient)] md:p-6 md:pb-6">
              <div className="pointer-events-none absolute -top-[250px] left-1/2 hidden h-[420px] w-[820px] -translate-x-1/2 opacity-45 md:block">
                <GradientGrid
                  showGrid
                  className="pointer-events-none absolute inset-0 h-full opacity-100"
                />
              </div>

              <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5">
                <div className="flex w-full flex-col items-center gap-1 text-center">
                  <Image
                    src="/assets/crown-filled.svg"
                    width={40}
                    height={40}
                    alt=""
                    className="mt-2 drop-shadow-[0_0_70px_rgba(255,224,45,1)] md:mt-0"
                  />
                  <DialogTitle className="text-center text-[20px] leading-[140%] font-bold text-[var(--countdown-text)]">
                    {title}
                  </DialogTitle>
                </div>

                <div className="flex w-full max-w-full flex-col gap-2">
                  <PerkList
                    variant="joinPremium"
                    line="one"
                    maxBlocks={2}
                    items={[
                      {
                        title: tokenLabel,
                        iconSrc: "/assets/spice-coin.png",
                        variant: "premium",
                      },
                      {
                        title: featuresLabel,
                        iconSrc: "/assets/crown-filled.svg",
                        variant: "default",
                      },
                    ]}
                  />
                  <DiscountProductCard
                    property="gold"
                    planName={planName}
                    discountLabel={discountLabel}
                    originalPrice={originalPrice}
                    discountedPrice={discountedPrice}
                  />
                </div>
              </div>
            </div>

            {/* Mobile: full-bleed background. Desktop: right column. */}
            <div className="absolute inset-0 z-[10] overflow-hidden md:relative md:z-[12] md:min-h-[390px] md:w-[50%]">
              <div className="absolute inset-0 md:hidden">
                <Image src={nangiSrc} alt="" fill className="object-cover object-top md:hidden" />
              </div>

              <div
                className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
                style={{ backgroundImage: `url('${nangiSrc}')` }}
              />

              <div className="absolute inset-0 bg-black/30 md:hidden" />
              <div className="absolute inset-0 hidden bg-[image:var(--image-overlay-gradient-desktop)] md:block" />
              <div className="absolute inset-0 block bg-[image:var(--image-overlay-gradient-mobile)] md:hidden" />

              <div className="relative z-10 hidden h-full w-full items-end p-6 md:flex">
                <DeleteAccountPromoActions
                  primaryLabel={primaryLabel}
                  secondaryLabel={secondaryLabel}
                  onPrimaryAction={onPrimaryAction}
                  onSecondaryAction={onSecondaryAction}
                  secondaryDisabled={secondaryDisabled}
                  secondaryError={secondaryError}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 z-[100] p-4 md:hidden">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-2">
            <DeleteAccountPromoActions
              primaryLabel={primaryLabel}
              secondaryLabel={secondaryLabel}
              onPrimaryAction={onPrimaryAction}
              onSecondaryAction={onSecondaryAction}
              secondaryDisabled={secondaryDisabled}
              secondaryError={secondaryError}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
