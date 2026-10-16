"use client";

import Image from "next/image";
import * as React from "react";

import { Slider } from "@/components/common/general/slider/slider";
import { cn } from "@/lib/utils";

import {
  formatTopUpTokenAmount,
  formatTopUpTokensLabel,
  TOP_UP_TOKENS_DEFAULT_STEP_INDEX,
  TOP_UP_TOKENS_ICON_ALT,
  TOP_UP_TOKENS_ICON_SRC,
  TOP_UP_TOKENS_STEP_MIN,
  TOP_UP_TOKENS_STEP_SIZE,
  TOP_UP_TOKENS_STEPS,
  TOP_UP_TOKENS_TITLE,
  type TopUpTokensStep,
} from "./top-up-tokens.constants";

export type TopUpTokensProps = {
  steps?: readonly TopUpTokensStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (stepIndex: number) => void;
  title?: string;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
};

function TokenStarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12.6562 4.07666C12.429 3.44128 11.571 3.44128 11.3438 4.07666L9.82617 8.32324C9.72764 8.59902 9.48027 8.78646 9.19922 8.79932L4.87207 8.99707C4.22422 9.0267 3.95883 9.88267 4.46631 10.3052L7.85596 13.1279C8.07612 13.3112 8.1699 13.6147 8.09473 13.8984L6.9375 18.2681C6.76484 18.9218 7.46039 19.4496 8.00098 19.0752L11.6133 16.5732C11.8479 16.4108 12.1521 16.4107 12.3867 16.5732L15.999 19.0752C16.5396 19.4496 17.2352 18.9218 17.0625 18.2681L15.9053 13.8984C15.8301 13.6147 15.9239 13.3112 16.144 13.1279L19.5337 10.3052C20.0412 9.88267 19.7758 9.0267 19.1279 8.99707L14.8008 8.79932C14.5197 8.78646 14.2724 8.59902 14.1738 8.32324L12.6562 4.07666Z"
        fill="currentColor"
      />
    </svg>
  );
}

function clampStepIndex(value: number, max: number) {
  return Math.min(max, Math.max(TOP_UP_TOKENS_STEP_MIN, Math.round(value)));
}

export function TopUpTokens({
  steps = TOP_UP_TOKENS_STEPS,
  value,
  defaultValue = TOP_UP_TOKENS_DEFAULT_STEP_INDEX,
  onValueChange,
  title = TOP_UP_TOKENS_TITLE,
  iconSrc = TOP_UP_TOKENS_ICON_SRC,
  iconAlt = TOP_UP_TOKENS_ICON_ALT,
  className,
}: TopUpTokensProps) {
  const stepMax = Math.max(TOP_UP_TOKENS_STEP_MIN, steps.length - 1);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(() =>
    clampStepIndex(defaultValue, stepMax),
  );

  const stepIndex = clampStepIndex(isControlled ? value : internalValue, stepMax);
  const selectedStep = steps[stepIndex] ?? steps[0]!;
  const stepCount = steps.length;
  // Equal flex columns + gap-3 → thumb travel inset so stops sit on label centers.
  const sliderInlinePad =
    stepCount > 0 ? `calc((100% - ${(stepCount - 1) * 0.75}rem) / ${stepCount * 2})` : undefined;

  const handleStepChange = React.useCallback(
    (nextValue: number) => {
      const nextIndex = clampStepIndex(nextValue, stepMax);
      if (!isControlled) {
        setInternalValue(nextIndex);
      }
      onValueChange?.(nextIndex);
    },
    [isControlled, onValueChange, stepMax],
  );

  return (
    <div
      data-slot="top-up-tokens"
      className={cn(
        "w-full max-w-[360px] min-w-[360px] rounded-[16px] bg-[linear-gradient(180deg,var(--color-alert-border-start),var(--color-alert-border-end))] p-px",
        className,
      )}
    >
      <div className="bg-countdown-bg flex flex-col gap-3 rounded-2xl p-3">
        <div className="flex items-center gap-3">
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={24}
            height={24}
            className="size-6 shrink-0 object-contain"
          />
          <p className="text-tooltip-text text-base leading-6 font-medium">{title}</p>
        </div>

        <div style={{ paddingInline: sliderInlinePad }}>
          <Slider
            min={TOP_UP_TOKENS_STEP_MIN}
            max={stepMax}
            step={TOP_UP_TOKENS_STEP_SIZE}
            value={stepIndex}
            onValueChange={handleStepChange}
            showMaxlabel={false}
            showSliderValue={false}
            showFlexCol
            minLabel=""
            maxLabel=""
            className="gap-0 px-0 pt-3 pb-3 [&>.text-divider-label]:hidden"
            aria-label={title}
          />
        </div>

        <div className="flex w-full items-center gap-3">
          {steps.map((step, index) => {
            const isReached = stepIndex >= index;
            return (
              <button
                key={step.tokens}
                type="button"
                onClick={() => handleStepChange(index)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 text-sm leading-5 font-medium transition-colors",
                  isReached ? "text-tooltip-text" : "text-divider-label",
                )}
                aria-pressed={stepIndex === index}
                aria-label={`${formatTopUpTokensLabel(step.tokens)}, ${step.priceLabel}`}
              >
                <TokenStarIcon className="size-4 shrink-0" />
                <span>{formatTopUpTokenAmount(step.tokens)}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-slider-track h-px w-full" />

        <div className="flex w-full items-center justify-between">
          <span className="text-divider-label text-sm leading-5 font-medium">
            {formatTopUpTokensLabel(selectedStep.tokens)}
          </span>
          <span className="text-tooltip-text text-lg leading-5 font-semibold">
            {selectedStep.priceLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
