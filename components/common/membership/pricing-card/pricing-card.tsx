"use client";

import Image from "next/image";
import React from "react";

import { cn } from "@/lib/utils";

import { Buttons } from "../../general/button/buttons";
import { AffiliateBonus } from "../affiliate-bonus";
import { PerkList } from "../perk-list/perk-list";

type Variant = "default" | "discount" | "infinite" | "purchased";

type PricingCardProps = {
  variant?: Variant;
  price: number;
  originalPrice?: number;
  affiliate?: string;
  affiliateTokens?: number;
};

const purchasedPerks = [
  {
    title: "AI Porn Videos + Images",
    iconSrc: "/assets/tick_gray.svg",
  },
  {
    title: "200 tokens",
    iconSrc: "/assets/tick_gray.svg",
  },
  {
    title: "Access to all features",
    iconSrc: "/assets/tick_gray.svg",
  },
  {
    title: "Voice Call Your AI Crush",
    iconSrc: "/assets/tick_gray.svg",
  },
];

export const PricingCard: React.FC<PricingCardProps> = ({
  variant = "default",
  price,
  originalPrice,
  affiliate = "affiliate-name",
  affiliateTokens = 300,
}) => {
  const isDiscount = variant === "discount";
  const isInfinite = variant === "infinite";
  const isPurchased = variant === "purchased";

  return (
    <div
      className={cn(
        "relative w-[100%] overflow-hidden rounded-[28px] p-2 shadow-[var(--shadow-card-dark)] md:w-[370px]",
        isPurchased
          ? "[background-image:var(--gradient-neutral-dark)]"
          : "[background-image:var(--gradient-pink-dark)]",
      )}
    >
      {!isPurchased && (
        <div
          className="absolute top-[-163px] left-1/2 h-[298px] w-[298px] -translate-x-1/2"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, #FDA5D5 0%, #C6005C 100%)",
          }}
        />
      )}

      {/* INNERCARD */}
      <div className="rounded-[26px]">
        {/* TOP */}
        <div className="relative mb-4 rounded-[24px] border border-transparent bg-[var(--select-trigger-bg)] [background-image:var(--perk-default-bg),var(--perk-default-border)] [background-clip:padding-box,border-box] [background-origin:padding-box,border-box] p-[1rem]">
          {/* Discount badge */}
          {(isDiscount || isInfinite) && (
            <div className="absolute top-3 right-3 rounded-full [background-image:var(--button-pink-primary-gradient)] px-2 py-1 text-base leading-[100%] font-medium text-[var(--select-text)]">
              -50%
            </div>
          )}

          {/* TITLE */}
          <p
            className={`text-[20px] leading-[100%] font-bold ${
              isInfinite
                ? "flex items-center gap-1 [background-image:radial-gradient(238.39%_44.19%_at_96.59%_31.25%,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0)_100%),radial-gradient(182.56%_55.34%_at_5.68%_100%,rgba(255,240,133,0.51)_0%,rgba(255,158,69,0)_100%),radial-gradient(137.51%_118.3%_at_32.95%_0%,rgba(255,217,0,0.74)_21.25%,rgba(255,223,32,0.80)_88.62%),radial-gradient(178.09%_220.16%_at_94.89%_-132.81%,#FFD400_67.59%,rgba(255,223,32,0.38)_100%)] bg-clip-text text-transparent"
                : "text-select-text"
            }`}
          >
            PREMIUM
            {isInfinite && (
              <Image
                src={"/assets/infinity-yellow-icon.svg"}
                width={24}
                height={24}
                alt="infinity-yellow-icon"
              />
            )}
          </p>

          {/* PRICE */}
          {!isPurchased && (
            <div className="mt-[42px] flex items-end gap-2">
              {(isDiscount || isInfinite) && originalPrice && (
                <span className="relative text-[25px] leading-[100%] text-[var(--select-muted-text)]">
                  ${originalPrice}
                  <span className="absolute top-1/2 right-0 left-0 h-[2px] -rotate-[20deg] bg-[#E60076]" />
                </span>
              )}

              <h2 className="relative top-[1px] text-[36px] leading-[100%] font-semibold text-[var(--select-text)]">
                ${price}
              </h2>

              <span className="mb-1 text-base leading-[100%] font-normal text-[var(--modal-text)]">
                per month
              </span>
            </div>
          )}

          {/* BUTTON */}
          <Buttons
            variant={isPurchased ? "neutral-hover" : "rose"}
            leftIcon={false}
            rightIcon={false}
            size="btn-l"
            label={isPurchased ? "Already purchased" : "Get premium"}
            className={cn(
              "w-full",
              isPurchased ? "mt-6 cursor-not-allowed bg-[var(--surface-strong)]!" : "mt-4",
            )}
          />

          {/* BILL TEXT */}
          {!isPurchased && (
            <p className="mt-2 text-center text-[10px] leading-[100%] font-normal text-[var(--gray-text)]">
              Billed ${price} every month. Cancel anytime.
            </p>
          )}
        </div>

        <div className="px-2 pb-2">
          {/* AFFILIATE */}
          {!isPurchased && <AffiliateBonus tokens={affiliateTokens} affiliateName={affiliate} />}

          {/* FEATURES */}
          <div className="space-y-1">
            {" "}
            {isPurchased ? (
              <>
                {" "}
                <PerkList variant="purchased" line="one" />{" "}
              </>
            ) : (
              <>
                {" "}
                <PerkList variant="yearly" line="two" />{" "}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
