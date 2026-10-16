"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

import { Countdown } from "../../general/countdown/countdown";
import { GradientGrid } from "../../general/gradient-grid/gradient-grid";
import { MODAL_LAYOUT_OVERLAY_CLASSNAME } from "../../general/modal-layout/modal-layout.constants";
import { PerkList } from "../../membership/perk-list/perk-list";
import { DiscountProductCard } from "../discount-product-card/discount-product-card";

export type JoinPremiumFlowVariant =
  | "join-premium-flow--step1"
  | "join-premium-flow--step2"
  | "join-premium-flow--step3"
  | "join-premium-flow--step4";

export type JoinPremiumFlowProps = {
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
   * restore the history trap (used by leave-retention Skip-on-Back).
   */
  onHistoryBack?: () => boolean | void;

  variant?: JoinPremiumFlowVariant;

  title?: string;
  subtitle?: string;

  tokenLabel?: string;
  planName?: string;
  discountLabel?: string;
  originalPrice?: string;
  discountedPrice?: string;

  primaryLabel?: string;
  mobilePrimaryLabel?: string;
  secondaryLabel?: string;

  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;

  className?: string;
};

type VariantDefaults = {
  title: string;
  subtitle: string;
  showPerks: boolean;
  showCountdown: boolean;
  showOfferCard: boolean;
  /** Figma Delete Account Promo — two perk rows + yearly offer. */
  showDeleteAccountPromo?: boolean;
  tokenLabel?: string;
  featuresLabel?: string;
  planName?: string;
  discountLabel?: string;
  originalPrice?: string;
  discountedPrice?: string;
  primaryLabel: string;
  mobilePrimaryLabel: string;
  secondaryLabel: string;
};

const variantDefaults: Record<JoinPremiumFlowVariant, VariantDefaults> = {
  "join-premium-flow--step1": {
    title: "Are you sure?",
    subtitle: "Don't miss on this opportunity.",
    showPerks: true,
    showCountdown: false,
    showOfferCard: false,
    primaryLabel: "Get this discount",
    mobilePrimaryLabel: "Get this discount",
    secondaryLabel: "Skip discount",
  },

  "join-premium-flow--step2": {
    title: "Hey, don't miss it!",
    subtitle: "Get an additional discount, if you're quick enough",
    showPerks: false,
    showCountdown: true,
    showOfferCard: true,
    tokenLabel: "200 tokens every month",
    planName: "3 months",
    discountLabel: "-66%",
    originalPrice: "$56.99",
    discountedPrice: "$19.99",
    primaryLabel: "Get this discount",
    mobilePrimaryLabel: "Get this discount",
    secondaryLabel: "Skip discount",
  },

  "join-premium-flow--step3": {
    title: "Hey, need wording here",
    subtitle: "We need some proper wording work done here.",
    showPerks: false,
    showCountdown: true,
    showOfferCard: true,
    tokenLabel: "200 tokens every month",
    planName: "1 month recurring",
    discountLabel: "-50%",
    originalPrice: "$18.99",
    discountedPrice: "$8.99",
    primaryLabel: "Get this discount",
    mobilePrimaryLabel: "Get this discount",
    secondaryLabel: "Skip discount",
  },

  /** Delete Account Promo — Figma 4599:40942 */
  "join-premium-flow--step4": {
    title: "Unlock Lifetime Access",
    subtitle: "Get everything, forever.\n$99.99 billed once.",
    showPerks: false,
    showCountdown: false,
    showOfferCard: true,
    showDeleteAccountPromo: true,
    tokenLabel: "200 tokens per month",
    featuresLabel: "Access to all features",
    planName: "Lifetime Premium",
    discountLabel: "-50%",
    originalPrice: "$999.99",
    discountedPrice: "$99.99",
    primaryLabel: "Claim lifetime access",
    mobilePrimaryLabel: "Claim lifetime access",
    secondaryLabel: "Skip discount",
  },
};

function JoinPremiumFlowActions({
  desktopPrimaryLabel,
  mobilePrimaryLabel,
  secondaryLabel,
  showCrownIcon,
  onPrimaryAction,
  onSecondaryAction,
  className,
}: {
  desktopPrimaryLabel: string;
  mobilePrimaryLabel: string;
  secondaryLabel: string;
  showCrownIcon?: boolean;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <Buttons
        variant="rose"
        size="btn-m"
        label={desktopPrimaryLabel}
        leftIcon={showCrownIcon}
        rightIcon={false}
        leftIconSrc={showCrownIcon ? "/assets/crown-filled.svg" : undefined}
        onClick={onPrimaryAction}
        className="hidden w-full cursor-pointer md:inline-flex"
      />

      <Buttons
        variant="rose"
        size="btn-m"
        label={mobilePrimaryLabel}
        leftIcon={showCrownIcon}
        rightIcon={false}
        leftIconSrc={showCrownIcon ? "/assets/crown-filled.svg" : undefined}
        onClick={onPrimaryAction}
        className="w-full cursor-pointer md:hidden"
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

export function JoinPremiumFlow({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  dismissible = true,
  closeOnHistoryBack = true,
  onHistoryBack,
  variant = "join-premium-flow--step1",
  title,
  subtitle,
  tokenLabel,
  planName,
  discountLabel,
  originalPrice,
  discountedPrice,
  primaryLabel,
  mobilePrimaryLabel,
  secondaryLabel,
  onPrimaryAction,
  onSecondaryAction,
  className,
}: JoinPremiumFlowProps) {
  const defaults = variantDefaults[variant];

  const resolvedTitle = title ?? defaults.title;
  const resolvedSubtitle = subtitle ?? defaults.subtitle;
  const resolvedTokenLabel = tokenLabel ?? defaults.tokenLabel;
  const resolvedPlanName = planName ?? defaults.planName;
  const resolvedDiscountLabel = discountLabel ?? defaults.discountLabel;
  const resolvedOriginalPrice = originalPrice ?? defaults.originalPrice;
  const resolvedDiscountedPrice = discountedPrice ?? defaults.discountedPrice;
  const resolvedPrimaryLabel = primaryLabel ?? defaults.primaryLabel;
  const resolvedMobilePrimaryLabel = mobilePrimaryLabel ?? defaults.mobilePrimaryLabel;
  const resolvedSecondaryLabel = secondaryLabel ?? defaults.secondaryLabel;
  const resolvedFeaturesLabel = defaults.featuresLabel ?? "Access to all features";

  const isDeleteAccountPromo = Boolean(defaults.showDeleteAccountPromo);
  const showCrownIcon = isDeleteAccountPromo;

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
        data-testid="join-premium-flow"
        data-variant={variant}
        overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
        className={cn(
          "box-border border-0 border-[var(--border-strong)] md:border md:border-solid",
          "bg-(--dialog-bg) p-0 shadow-none ring-0",
          "h-[100vh] w-full sm:max-w-full md:h-auto",
          "top-0 z-70 translate-y-0 data-[vaul-drawer-direction=bottom]:max-h-[100vh]! md:top-1/2 md:-translate-y-1/2",
          defaults.showPerks
            ? "md:max-w-[600px] md:min-w-[600px]"
            : "md:max-w-[600px] md:min-w-[600px]",
          className,
        )}
      >
        <div className="relative h-[100vh] max-h-[100dvh] overflow-y-auto md:h-[390px] md:overflow-visible">
          <div
            className={cn(
              "upsell-main relative overflow-visible md:overflow-hidden",
              "rounded-[28px] md:rounded-[28px]",
              // "border border-white/10 box-border",

              "flex md:flex-row",
              defaults.showPerks ? "md:h-[390px] md:min-h-[390px]" : "md:min-h-[390px]",
            )}
          >
            {/* CONTENT */}
            <div
              className={cn(
                "mob-upsell relative z-12 flex w-full flex-col",
                "md:w-[50%]",
                "md:bg-[image:var(--background-neutral-gradient)]",
                defaults.showPerks ? "p-4 px-0 md:p-[24px] md:pb-[24px]" : "p-4 md:p-[24px]",
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

              <div
                className={cn(
                  "relative z-10 flex flex-1 flex-col",
                  defaults.showPerks
                    ? "items-stretch gap-4 md:items-center md:justify-center md:gap-5"
                    : "items-center justify-center gap-5",
                )}
              >
                <div
                  className={cn(
                    "flex w-full flex-col items-center text-center",
                    isDeleteAccountPromo ? "gap-1" : "gap-0",
                    defaults.showPerks && "px-4 md:px-0",
                  )}
                >
                  <Image
                    src="/assets/crown-filled.svg"
                    width={40}
                    height={40}
                    alt=""
                    className={cn(
                      "mt-2 md:mt-0",
                      !isDeleteAccountPromo && "drop-shadow-[0_0_70px_rgba(255,224,45,1)]",
                    )}
                  />

                  <DialogTitle className="text-center text-[20px] leading-[140%] font-bold text-[var(--countdown-text)]">
                    {resolvedTitle}
                  </DialogTitle>

                  {resolvedSubtitle ? (
                    <p className="text-center text-sm leading-[142.857%] font-normal whitespace-pre-line text-[var(--modal-text)]">
                      {resolvedSubtitle}
                    </p>
                  ) : null}
                </div>

                {defaults.showCountdown && <Countdown className="w-full max-w-[280px]" />}

                <div
                  className={cn(
                    "flex w-full flex-col",
                    isDeleteAccountPromo
                      ? "max-w-full gap-2"
                      : defaults.showPerks
                        ? "max-w-none gap-4 px-4 md:max-w-[320px] md:px-0"
                        : "max-w-full gap-5",
                  )}
                >
                  {defaults.showPerks && (
                    <PerkList
                      variant="joinPremium"
                      line="one"
                      maxBlocks={4}
                      items={[
                        {
                          title: "200 tokens every month",
                          iconSrc: "/assets/spice-coin.png",
                          variant: "premium",
                        },
                        {
                          title: "AI Porn Videos + Images",
                          iconSrc: "/assets/clapper-board.svg",
                          variant: "default",
                        },
                        {
                          title: "Unlimited Messages",
                          iconSrc: "/assets/speech-balloon.svg",
                          variant: "default",
                        },
                        {
                          title: "Audio chat + Voice calls",
                          iconSrc: "/assets/mic.svg",
                          variant: "default",
                        },
                      ]}
                    />
                  )}
                  {defaults.showOfferCard && (
                    <div className="flex w-full flex-col gap-2">
                      {isDeleteAccountPromo ? (
                        <PerkList
                          variant="joinPremium"
                          line="one"
                          maxBlocks={2}
                          items={[
                            {
                              title: resolvedTokenLabel ?? "200 tokens every month",
                              iconSrc: "/assets/spice-coin.png",
                              variant: "premium",
                            },
                            {
                              title: resolvedFeaturesLabel,
                              iconSrc: "/assets/crown-filled.svg",
                              variant: "default",
                            },
                          ]}
                        />
                      ) : (
                        <PerkList
                          variant="joinPremium"
                          line="one"
                          maxBlocks={1}
                          items={[
                            {
                              title: "200 tokens per month",
                              iconSrc: "/assets/spice-coin.png",
                            },
                          ]}
                        />
                      )}
                      <DiscountProductCard
                        property={isDeleteAccountPromo ? "gold" : "red"}
                        tokenLabel={resolvedTokenLabel}
                        planName={resolvedPlanName}
                        discountLabel={resolvedDiscountLabel}
                        originalPrice={resolvedOriginalPrice}
                        discountedPrice={resolvedDiscountedPrice}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* IMAGE + DESKTOP ACTIONS */}
            <div
              className={cn(
                "relative w-full md:w-[50%]",
                "z-[10] flex flex-col justify-end overflow-hidden md:z-[12]",
                "bg-top-center bg-cover bg-no-repeat md:bg-center",
                defaults.showPerks
                  ? "min-h-[459px] p-4 md:min-h-[390px] md:p-[24px]"
                  : "min-h-[459px] p-4 md:min-h-[390px] md:p-[24px]",
              )}
              // style={{
              //   backgroundImage: `

              //   url((resolveAsset("demo_pics_nangi").image ?? ""))
              // `,
              // }}
            >
              <div className="bg-top-center absolute inset-0 bg-cover bg-no-repeat opacity-70 md:hidden">
                <Image
                  src={resolveAsset("demo_pics_nangi").image ?? ""}
                  alt="Background"
                  fill
                  className="object-cover object-top md:hidden"
                />
              </div>

              <div
                className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
                style={{
                  backgroundImage: `url(${resolveAsset("demo_pics_nangi").image ?? ""})`,
                }}
              />

              {/* Mobile opacity overlay */}
              <div className="absolute inset-0 bg-black/30 md:hidden" />

              {/* OVERLAY  DESKTOP*/}
              <div className="absolute inset-0 hidden bg-[image:var(--image-overlay-gradient-desktop)] md:block" />
              {/* OVERLAY  MOBILE*/}
              <div className="absolute inset-0 block bg-[image:var(--image-overlay-gradient-mobile)] md:hidden" />
              <div className="relative z-10 hidden w-full md:flex">
                <JoinPremiumFlowActions
                  desktopPrimaryLabel={resolvedPrimaryLabel}
                  mobilePrimaryLabel={resolvedMobilePrimaryLabel}
                  secondaryLabel={resolvedSecondaryLabel}
                  showCrownIcon={showCrownIcon}
                  onPrimaryAction={onPrimaryAction}
                  onSecondaryAction={onSecondaryAction}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE FIXED ACTIONS */}
        <div className="absolute right-0 bottom-0 left-0 z-[100] p-4 md:hidden">
          <div className="mx-auto flex w-full max-w-[720px] flex-col gap-2">
            <JoinPremiumFlowActions
              desktopPrimaryLabel={resolvedPrimaryLabel}
              mobilePrimaryLabel={resolvedMobilePrimaryLabel}
              secondaryLabel={resolvedSecondaryLabel}
              showCrownIcon={showCrownIcon}
              onPrimaryAction={onPrimaryAction}
              onSecondaryAction={onSecondaryAction}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
