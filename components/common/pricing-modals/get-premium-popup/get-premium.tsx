"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCatalog } from "@/hooks/use-catalog";
import {
  catalogIntervalPrices,
  catalogPriceTabCopy,
  catalogYearlyDiscount,
  EMPTY_CATALOG_PRICE_TAB_COPY,
} from "@/lib/pricing-display";
import { buildPremiumHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { Close } from "../../general/close/close";
import TabGroup from "../../general/tabs-group/tabs-group";
import { type PerkItem, PerkList } from "../../membership/perk-list/perk-list";
import { PriceTab } from "../../membership/price-tab";

export type GetPremiumVariant = "get-premium--yearly" | "get-premium--monthly";
export type GetPremiumPlan = "premium" | "infinite";
export type GetPremiumInterval = "yearly" | "monthly";

export type GetPremiumSelection = {
  plan: GetPremiumPlan;
  interval: GetPremiumInterval;
  planPriceId?: string;
};

export type GetPremiumProps = {
  trigger?: React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  variant?: GetPremiumVariant;

  title?: string;
  subtitle?: string;

  yearlyTokens?: string;
  monthlyTokens?: string;

  saleTime?: string;

  onContinue?: (selection: GetPremiumSelection) => void;
  onSeePricing?: (selection: GetPremiumSelection) => void;

  className?: string;
};

const DESKTOP_SUBTITLE = "Get access to all premium features";
const MOBILE_SUBTITLE = "Get premium, gain tokens and get access to all premium features";
const HERO_IMAGE_SRC = "/assets/get-premium-hero.png";

const PREMIUM_PERKS: PerkItem[] = [
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
  {
    title: "Voice Call Your AI Crush",
    iconSrc: "/assets/phone-green.svg",
    variant: "default",
  },
];

const INFINITE_PERKS: PerkItem[] = [
  {
    title: "600 tokens every month",
    iconSrc: "/assets/spice-coin.png",
    variant: "premium",
  },
  {
    title: "Unlimited Images",
    iconSrc: "/assets/infinity-icon.svg",
    variant: "default",
  },
  {
    title: "Unlimited Messages",
    iconSrc: "/assets/speech-balloon.svg",
    variant: "default",
  },
  {
    title: "Unlimited Audio Messages",
    iconSrc: "/assets/mic.svg",
    variant: "default",
  },
  {
    title: "AI Porn Videos + Images",
    iconSrc: "/assets/clapper-board.svg",
    variant: "default",
  },
  {
    title: "Voice Call Your AI Crush",
    iconSrc: "/assets/phone-green.svg",
    variant: "default",
  },
];

function infinitePlanTabs(discountPercent: number) {
  return [
    { label: "Premium", showIcon: false, showBadge: false },
    {
      label: "Infinite",
      showIcon: true,
      leftIconSrc: "/assets/infinity-yellow-icon.svg",
      showBadge: discountPercent > 0,
      badgeText: discountPercent > 0 ? `-${discountPercent}%` : undefined,
      badgeType: "rose" as const,
      labelClassName: "text-[#FFE02D]",
    },
  ];
}

export function GetPremium({
  trigger,

  open,
  defaultOpen,
  onOpenChange,

  variant = "get-premium--yearly",

  title = "Join Spicestars",
  subtitle,

  onContinue,
  onSeePricing,

  className,
}: GetPremiumProps) {
  const initialPrice = variant === "get-premium--monthly" ? 1 : 0;
  const [selectedPrice, setSelectedPrice] = React.useState(initialPrice);
  const [prevInitialPrice, setPrevInitialPrice] = React.useState(initialPrice);
  const [selectedPlan, setSelectedPlan] = React.useState(0);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(Boolean(defaultOpen));
  const isOpen = open ?? uncontrolledOpen;

  if (initialPrice !== prevInitialPrice) {
    setPrevInitialPrice(initialPrice);
    setSelectedPrice(initialPrice);
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const catalog = useCatalog({ enabled: isOpen });
  const plan: GetPremiumPlan = selectedPlan === 1 ? "infinite" : "premium";
  const interval: GetPremiumInterval = selectedPrice === 0 ? "yearly" : "monthly";
  const catalogPlan = catalog.data?.plans.find((item) => item.code === plan);
  const infinitePlan = catalog.data?.plans.find((item) => item.code === "infinite");
  const { yearly: yearlyOffer, monthly: monthlyOffer } = catalogIntervalPrices(catalogPlan?.prices);
  const { yearly: infiniteYearly, monthly: infiniteMonthly } = catalogIntervalPrices(
    infinitePlan?.prices,
  );
  const yearlyDiscount = catalogYearlyDiscount(yearlyOffer, monthlyOffer);
  const infiniteTabDiscount = catalogYearlyDiscount(infiniteYearly, infiniteMonthly);
  const currency = catalog.data?.currency;
  const yearlyCopy =
    yearlyOffer && currency
      ? catalogPriceTabCopy({
          price: yearlyOffer,
          monthlyPrice: monthlyOffer,
          yearlyDiscount,
          signupBonusTokens: catalogPlan?.signupBonusTokens,
          currency,
          usesMonthlyYearlyOffers: true,
        })
      : EMPTY_CATALOG_PRICE_TAB_COPY;
  const monthlyCopy =
    monthlyOffer && currency
      ? catalogPriceTabCopy({
          price: monthlyOffer,
          monthlyPrice: monthlyOffer,
          yearlyDiscount,
          signupBonusTokens: catalogPlan?.signupBonusTokens,
          currency,
          usesMonthlyYearlyOffers: true,
        })
      : EMPTY_CATALOG_PRICE_TAB_COPY;
  const selectedOffer = interval === "yearly" ? yearlyOffer : monthlyOffer;
  const selection: GetPremiumSelection = selectedOffer?.id
    ? { plan, interval, planPriceId: selectedOffer.id }
    : { plan, interval };
  const canContinue = Boolean(selectedOffer?.id);
  const perkItems = plan === "infinite" ? INFINITE_PERKS : PREMIUM_PERKS;
  const pricingHref = buildPremiumHref(plan);
  const desktopSubtitle = subtitle ?? DESKTOP_SUBTITLE;
  const mobileSubtitle = subtitle ?? MOBILE_SUBTITLE;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        showCloseButton={false}
        className={cn(
          "z-99 box-border border-0 border-[var(--border-strong)] md:border md:border-solid",
          "bg-transparent p-0 shadow-none",
          "w-full sm:max-w-none md:w-[800px] md:max-w-[800px] md:min-w-[800px]",
          "ring-0",
          "mb-0 h-dvh gap-0 rounded-none",
          "data-[vaul-drawer-direction=bottom]:h-dvh! data-[vaul-drawer-direction=bottom]:max-h-dvh!",
          "md:h-auto md:rounded-[28px]",
          className,
        )}
      >
        <div
          data-slot="get-premium"
          data-plan={plan}
          data-interval={selectedPrice === 0 ? "yearly" : "monthly"}
          className={cn(
            "relative overflow-hidden",
            "rounded-none md:rounded-[28px]",
            "border-border-strong box-border border",
            "bg-dialog-bg",
            "flex h-full min-h-dvh flex-col md:h-auto md:min-h-0 md:flex-row",
          )}
        >
          <div
            className={cn(
              "relative z-50 flex h-full w-full flex-col",
              "md:w-[440px] md:flex-none md:shrink-0",
              "md:bg-none",
            )}
          >
            <div className="absolute inset-0 md:hidden">
              <Image src={HERO_IMAGE_SRC} alt="" fill className="object-cover object-top" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,rgba(14,14,14,0)_47%,rgba(14,14,14,1)_94%)]" />
            </div>

            <div className="absolute inset-0 hidden bg-[linear-gradient(135deg,#171717_0%,#0e0e0e_100%)] md:block" />

            <DialogClose asChild className="absolute top-4 right-4 z-100 cursor-pointer md:hidden">
              <Close aria-label="Close" />
            </DialogClose>

            <div className="custom-scrollbar relative z-70 flex min-h-0 flex-1 flex-col items-center justify-end gap-4 overflow-y-auto px-4 pt-16 pb-28 md:gap-5 md:overflow-visible md:p-10">
              <div className="flex w-full max-w-[280px] flex-col items-center gap-1.5 text-center md:gap-1">
                <Image
                  src="/assets/crown-filled.svg"
                  width={40}
                  height={40}
                  alt=""
                  className="size-10 drop-shadow-[0_0_70px_rgba(255,224,45,1)]"
                />

                <DialogTitle
                  className={cn(
                    "text-tooltip-text text-center font-bold",
                    "text-2xl leading-8",
                    "md:text-[30px] md:leading-8",
                  )}
                >
                  {title}
                </DialogTitle>

                <p className="text-hover-text hidden text-center text-base leading-6 font-normal md:block">
                  {desktopSubtitle}
                </p>
                <p className="text-hover-text max-w-[260px] text-center text-base leading-6 font-normal md:hidden">
                  {mobileSubtitle}
                </p>
              </div>

              {catalog.isError ? (
                <p className="text-hover-text w-full max-w-[360px] text-center text-sm leading-5">
                  We couldn&apos;t load the available plans.
                </p>
              ) : (
                <>
                  <TabGroup
                    variant="compact"
                    fit="hug"
                    selected={selectedPlan}
                    onChange={setSelectedPlan}
                    className="border-border-focus border shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)]"
                    tabs={infinitePlanTabs(infiniteTabDiscount)}
                  />

                  <div className="flex w-full max-w-[360px] items-stretch gap-1.5">
                    <PriceTab
                      type="highlight"
                      selected={selectedPrice === 0}
                      showCta={false}
                      label="1 Year"
                      planPriceId={yearlyOffer?.id}
                      price={yearlyCopy.price}
                      originalPrice={yearlyCopy.originalPrice}
                      periodLabel="/mo"
                      badgeLabel={yearlyCopy.badgeLabel}
                      showBadge={yearlyCopy.showBadge}
                      bonusLabel={yearlyCopy.bonusLabel}
                      showBonus={yearlyCopy.showBonus}
                      onClick={() => setSelectedPrice(0)}
                      className="w-auto min-w-0 flex-1"
                    />
                    <PriceTab
                      type="default"
                      selected={selectedPrice === 1}
                      showCta={false}
                      label="1 Month"
                      planPriceId={monthlyOffer?.id}
                      price={monthlyCopy.price}
                      originalPrice={monthlyCopy.originalPrice}
                      periodLabel="/mo"
                      badgeLabel={monthlyCopy.badgeLabel}
                      showBadge={monthlyCopy.showBadge}
                      bonusLabel={monthlyCopy.bonusLabel}
                      showBonus={monthlyCopy.showBonus}
                      onClick={() => setSelectedPrice(1)}
                      className="w-auto min-w-0 flex-1"
                    />
                  </div>
                </>
              )}

              <div className="w-full max-w-[360px] md:hidden">
                <PerkList key={plan} variant="joinPremium" line="one" items={perkItems} />
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 w-full px-4 pt-8 pb-4 md:static md:max-w-[360px] md:p-0">
                <div className="absolute inset-0 bg-[image:var(--infinite-bg-gradient)] md:hidden" />
                <div className="relative z-10 flex w-full flex-col items-stretch gap-4">
                  <Buttons
                    variant="rose"
                    size="btn-m"
                    label={catalog.isError ? "Try again" : "Continue"}
                    leftIcon={false}
                    rightIcon={false}
                    disabled={!catalog.isError && !canContinue}
                    onClick={() => {
                      if (catalog.isError) {
                        void catalog.refetch();
                        return;
                      }
                      if (!canContinue) return;
                      onContinue?.(selection);
                    }}
                    className="w-full cursor-pointer"
                  />
                  {onSeePricing ? (
                    <button
                      type="button"
                      onClick={() => onSeePricing(selection)}
                      className="text-center text-xs leading-4 font-medium text-[#D4D4D4]"
                    >
                      See pricing page
                    </button>
                  ) : (
                    <Link
                      href={pricingHref}
                      className="text-center text-xs leading-4 font-medium text-[#D4D4D4]"
                    >
                      See pricing page
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "relative hidden min-h-[422px] w-[360px] shrink-0 flex-col justify-end overflow-hidden p-10 md:flex",
            )}
          >
            <Image src={HERO_IMAGE_SRC} alt="" fill className="object-cover object-center" />
            <DialogClose asChild className="absolute top-4 right-4 z-100 cursor-pointer">
              <Close aria-label="Close" />
            </DialogClose>

            <div className="absolute inset-0 bg-[image:var(--get-premium-overlay-gradient)]" />

            <div className="relative z-10 w-full">
              <PerkList key={plan} variant="joinPremium" line="one" items={perkItems} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
