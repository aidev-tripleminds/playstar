"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { GradientGrid } from "@/components/common/general/gradient-grid/gradient-grid";
import { cn } from "@/lib/utils";

export type PriceTabType = "highlight" | "default";

/** Figma 19580:72489 Highlight + CTA: #171717 → #893F57 */
const HIGHLIGHT_STROKE_CTA =
  "linear-gradient(var(--tooltip-default-bg), var(--tooltip-default-bg)), linear-gradient(180deg, #171717 0%, #893F57 100%)";
/** Figma 19980:72087 Highlight + unselected: #181818 → #884057 */
const HIGHLIGHT_STROKE_SELECTABLE =
  "linear-gradient(var(--tooltip-default-bg), var(--tooltip-default-bg)), linear-gradient(180deg, #181818 0%, #884057 100%)";
const DEFAULT_STROKE =
  "linear-gradient(var(--tooltip-default-bg), var(--tooltip-default-bg)), var(--card-border)";

const UNSELECTED_STROKE_STYLE = {
  borderColor: "transparent",
  backgroundOrigin: "padding-box, border-box",
  backgroundClip: "padding-box, border-box",
} as const;

export type PriceTabProps = {
  type?: PriceTabType;
  selected?: boolean;
  showCta?: boolean;
  label?: string;
  price?: string;
  periodLabel?: string;
  priceLayout?: "stacked" | "inline";
  originalPrice?: string;
  badgeLabel?: string;
  showBadge?: boolean;
  bonusLabel?: string;
  showBonus?: boolean;
  ctaLabel?: string;
  planPriceId?: string;
  onCtaClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
};

export function PriceTab({
  type = "highlight",
  selected = false,
  showCta = false,
  label = "1 Month",
  price = "$9.99",
  periodLabel = "/mo",
  priceLayout = "inline",
  originalPrice = "$39.99",
  badgeLabel = "-50%",
  showBadge = true,
  bonusLabel = "+500 free tokens",
  showBonus = true,
  ctaLabel = "Get Started",
  planPriceId,
  onCtaClick,
  onClick,
  className,
}: PriceTabProps) {
  const isHighlight = type === "highlight";
  const isSelectable = !showCta;

  const content = (
    <>
      {isHighlight ? (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute overflow-hidden",
            selected ? "inset-[2px] rounded-[17px]" : "inset-0 rounded-[19px]",
          )}
        >
          <GradientGrid
            showGrid={false}
            minOpacity={1}
            className={cn(
              "pointer-events-none absolute h-[258px] w-[445px] opacity-45",
              showCta ? "top-[18px] -left-[132px]" : "-top-[30px] -left-[132px]",
            )}
          />
        </div>
      ) : null}

      <div className="relative z-10 flex w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-2 self-stretch">
          <p className="text-select-text text-sm leading-5 font-semibold">{label}</p>

          {showBadge && badgeLabel ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-[28px] px-1.5 py-1",
                "bg-[image:var(--token-gradient-gold-premium)] text-xs leading-none font-medium text-[#0E0E0E]",
                "shadow-[var(--badge-shadow)]",
              )}
            >
              {badgeLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-0.5 self-stretch">
          <div
            className={cn(
              "flex",
              priceLayout === "inline"
                ? "flex-row flex-nowrap items-center gap-1"
                : "flex-col gap-0.5",
            )}
          >
            {originalPrice ? (
              <span className="text-sm leading-5 font-medium whitespace-nowrap text-[#E60076] line-through">
                {originalPrice}
              </span>
            ) : null}
            <div className="flex items-center gap-0.5">
              <span className="text-select-text text-xl leading-7 font-bold whitespace-nowrap">
                {price}
              </span>
              <span className="text-select-muted-text text-xs leading-4 font-medium whitespace-nowrap">
                {periodLabel}
              </span>
            </div>
          </div>

          {showBonus && bonusLabel ? (
            <span className="text-xs leading-4 font-semibold text-[#FFD900]">{bonusLabel}</span>
          ) : null}
        </div>
      </div>

      {showCta ? (
        <div className="relative z-10 w-full">
          <Buttons
            variant={isHighlight ? "rose" : "neutral-hover"}
            size="btn-s"
            leftIcon={false}
            rightIcon={false}
            label={ctaLabel}
            onClick={onCtaClick}
            className="w-full"
          />
        </div>
      ) : null}
    </>
  );

  const rootClassName = cn(
    "relative flex w-[182px] flex-col gap-3 overflow-hidden rounded-[20px] border border-transparent p-3",
    "bg-[var(--tooltip-default-bg)]",
    "shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)]",
    selected && "outline-solid outline-[3px] -outline-offset-[3px] outline-[var(--select-text)]",
    isSelectable && "cursor-pointer font-[inherit] text-left",
    className,
  );

  const rootStyle = selected
    ? undefined
    : {
        ...UNSELECTED_STROKE_STYLE,
        backgroundImage: isHighlight
          ? showCta
            ? HIGHLIGHT_STROKE_CTA
            : HIGHLIGHT_STROKE_SELECTABLE
          : DEFAULT_STROKE,
      };

  if (isSelectable) {
    return (
      <button
        type="button"
        data-slot="price-tab"
        data-type={type}
        data-selected={selected ? "true" : "false"}
        data-cta="false"
        data-plan-price-id={planPriceId}
        aria-pressed={selected}
        onClick={onClick}
        className={rootClassName}
        style={rootStyle}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      data-slot="price-tab"
      data-type={type}
      data-selected={selected ? "true" : "false"}
      data-cta="true"
      data-plan-price-id={planPriceId}
      onClick={onClick}
      className={rootClassName}
      style={rootStyle}
    >
      {content}
    </div>
  );
}
