"use client";

import * as React from "react";

import { Slider as UiSlider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export type SliderProps = Omit<
  React.ComponentProps<typeof UiSlider>,
  "defaultValue" | "value" | "onValueChange"
> & {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  minLabel?: string;
  maxLabel?: string;
  /** Appended after `minLabel` in the stacked layout. Pass `""` to omit (e.g. `"5s"`). */
  minLabelSuffix?: string;
  showMaxlabel?: boolean;
  showSliderValue?: boolean;
  showFlexCol?: boolean;
  /** Tooltip that follows the thumb. Defaults to `"above"`. */
  valueTooltipPosition?: "above" | "below";
  formatValueLabel?: (value: number) => string;

  onValueChange?: (value: number) => void;
};

const THUMB_WIDTH_PX = 6;

export function Slider({
  min = 0,
  max = 100,
  value,
  defaultValue = 18,
  minLabel = "0",
  maxLabel = "100",
  minLabelSuffix = "+",
  formatValueLabel = (currentValue) => `${currentValue}`,
  onValueChange,
  showMaxlabel = true,
  showSliderValue = true,
  showFlexCol = true,
  valueTooltipPosition = "above",
  className,
  ...props
}: SliderProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const currentValue = isControlled ? value : internalValue;

  const ratio = max > min ? Math.min(1, Math.max(0, (currentValue - min) / (max - min))) : 0;

  const tooltipLeft = `calc(${ratio} * (100% - ${THUMB_WIDTH_PX}px) + ${THUMB_WIDTH_PX / 2}px)`;

  const handleValueChange = React.useCallback(
    (values: number[]) => {
      const nextValue = values[0] ?? min;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, min, onValueChange],
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-1 px-3 pt-4 text-left sm:px-0",
        showSliderValue && valueTooltipPosition === "below" ? "pb-10" : "pb-3",
        className,
      )}
    >
      {/* Labels */}
      {showFlexCol && (
        <div className="text-divider-label flex w-full items-center justify-between gap-5 text-[12px] leading-3 font-medium">
          <span>
            {minLabel}
            {minLabelSuffix}
          </span>
          {showMaxlabel && <span className="text-right">{maxLabel}</span>}
        </div>
      )}

      <div
        className={cn(
          "relative flex w-full items-center py-2 text-center text-xs",
          showFlexCol ? "flex-col gap-1" : "gap-4",
        )}
      >
        {!showFlexCol && (
          <div className="w-[64px] text-left md:w-fit">
            <span>{minLabel}</span>
          </div>
        )}
        <UiSlider
          min={min}
          max={max}
          value={isControlled ? [currentValue] : undefined}
          defaultValue={isControlled ? undefined : [defaultValue]}
          onValueChange={handleValueChange}
          className={cn(
            "w-full",

            "**:data-[slot=slider-track]:h-1.5",
            "**:data-[slot=slider-track]:rounded-[50px]",
            "**:data-[slot=slider-track]:bg-slider-track",

            "**:data-[slot=slider-range]:h-full",
            "**:data-[slot=slider-range]:rounded-l-full",
            "**:data-[slot=slider-range]:rounded-r-none",

            "**:data-[slot=slider-thumb]:h-7",
            "**:data-[slot=slider-thumb]:w-1.5",
            "**:data-[slot=slider-thumb]:rounded-full",
            "**:data-[slot=slider-thumb]:border-0",
            "**:data-[slot=slider-thumb]:bg-slider-thumb-gradient",
            "**:data-[slot=slider-thumb]:shadow-(--slider-thumb-shadow)",
            "**:data-[slot=slider-thumb]:focus-visible:ring-0",
            "**:data-[slot=slider-thumb]:hover:ring-0",
          )}
          {...props}
        />
        {showSliderValue && (
          <span
            aria-hidden
            role="presentation"
            className={cn(
              "border-slider-tooltip-border bg-slider-tooltip-bg shadow-badge pointer-events-none absolute rounded-md border px-2 py-1",
              valueTooltipPosition === "below" ? "top-full mt-0.75" : "-top-11",
            )}
            style={{
              left: tooltipLeft,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-tooltip-text bg-(--gradient-tooltip-text) bg-clip-text leading-3">
              {formatValueLabel(currentValue)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
