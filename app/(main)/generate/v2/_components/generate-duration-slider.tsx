"use client";

import { Slider } from "@/components/common/general/slider/slider";
import { cn } from "@/lib/utils";

import {
  formatGenerateDuration,
  GENERATE_DURATION_MAX_SECONDS,
  GENERATE_DURATION_MIN_SECONDS,
  GENERATE_DURATION_MODAL_TITLE,
  parseGenerateDurationSeconds,
} from "../_lib/constants";

export type GenerateDurationSliderProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function GenerateDurationSlider({
  value,
  onValueChange,
  className,
}: GenerateDurationSliderProps) {
  const seconds = parseGenerateDurationSeconds(value ?? "");
  const valueLabel = formatGenerateDuration(seconds);

  return (
    <div
      data-slot="generate-duration-slider"
      className={cn("flex w-full flex-col items-center pt-2", className)}
    >
      <div className="text-tooltip-text flex w-full items-center justify-between pb-3 text-[14px] leading-5 font-medium">
        <span>{GENERATE_DURATION_MODAL_TITLE}</span>
        <span>{valueLabel}</span>
      </div>
      <Slider
        min={GENERATE_DURATION_MIN_SECONDS}
        max={GENERATE_DURATION_MAX_SECONDS}
        step={1}
        value={seconds}
        onValueChange={(nextSeconds) => onValueChange?.(formatGenerateDuration(nextSeconds))}
        minLabel={`${GENERATE_DURATION_MIN_SECONDS}s`}
        maxLabel={`${GENERATE_DURATION_MAX_SECONDS}s`}
        minLabelSuffix=""
        showSliderValue={false}
        formatValueLabel={formatGenerateDuration}
        aria-label={GENERATE_DURATION_MODAL_TITLE}
        className="flex-col-reverse gap-2 px-0 pt-0 pb-0"
      />
    </div>
  );
}
